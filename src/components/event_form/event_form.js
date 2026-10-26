"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { auth, storage, firestore } from "@/firebase";
import { revalidateEvents } from "@/app/actions/revalidate_events";
import styles from "@/app/create/page.module.css";
import RichTextEditor from "@/components/rich_text_editor/rich_text_editor";
import ImageUploader from "@/components/image_uploader/image_uploader";
import MainImageUploader from "@/components/main_image_uploader/main_image_uploader";
import useEventStore from "@/store/event_store";

function getSaveErrorMessage(err, isEdit) {
  const action = isEdit ? "оновленні" : "створенні";
  switch (err.code) {
    case "storage/unauthorized":
    case "permission-denied":
      return `Немає прав для ${action} події. Увійдіть в систему ще раз.`;
    case "storage/canceled":
      return "Завантаження зображень скасовано.";
    case "storage/quota-exceeded":
      return "Перевищено ліміт сховища. Зверніться до адміністратора.";
    case "unavailable":
    case "storage/retry-limit-exceeded":
      return "Проблема з мережею. Перевірте з'єднання та спробуйте ще раз.";
    default:
      return `Помилка при ${action} події. Спробуйте ще раз.`;
  }
}

export default function EventForm({
  mode = "create",
  eventId,
  initialTitle = "",
  initialDateRange = [null, null],
  initialDescription = "",
}) {
  const [formData, setFormData] = useState({
    title: initialTitle,
    start_date: initialDateRange[0]
      ? Timestamp.fromDate(initialDateRange[0])
      : "",
    end_date: initialDateRange[1]
      ? Timestamp.fromDate(initialDateRange[1])
      : "",
  });
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [startDate, endDate] = dateRange;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const createIdRef = useRef(null);

  const description = useEventStore((state) => state.description);
  const mainImage = useEventStore((state) => state.mainImage);
  const images = useEventStore((state) => state.images);
  const reset = useEventStore((state) => state.reset);

  const router = useRouter();
  const isEdit = mode === "edit";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const descriptionText = description.replace(/<[^>]*>/g, "").trim();
    if (!formData.title.trim()) {
      setError("Будь ласка, вкажіть заголовок події");
      return;
    }
    if (!descriptionText) {
      setError("Будь ласка, додайте опис події");
      return;
    }
    if (!formData.start_date) {
      setError("Будь ласка, вкажіть дату початку події");
      return;
    }
    if (
      formData.end_date &&
      formData.end_date.toMillis() < formData.start_date.toMillis()
    ) {
      setError("Дата завершення не може бути раніше дати початку");
      return;
    }

    setIsSubmitting(true);

    const uploadedPaths = [];

    try {
      // Один id на всі спроби створення, щоб повторний сабміт не створював дублікат
      const targetId = isEdit
        ? eventId
        : (createIdRef.current ??= doc(collection(firestore, "events")).id);
      const docRef = doc(firestore, "events", targetId);

      let mainImageUrl = null;
      if (mainImage) {
        if (mainImage.isExisting) {
          mainImageUrl = mainImage.url;
        } else {
          // Унікальне ім'я: новий файл не перезаписує поточне головне зображення,
          // тож відкат при помилці видаляє лише щойно завантажений файл
          const path = `events/${targetId}/main-${mainImage.id}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, mainImage.file);
          uploadedPaths.push(path);
          mainImageUrl = await getDownloadURL(storageRef);
        }
      }

      const imageUrls = await Promise.all(
        images.map(async (img) => {
          if (img.isExisting) return img.url;
          const path = `events/${targetId}/${img.id}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, img.file);
          uploadedPaths.push(path);
          return getDownloadURL(storageRef);
        }),
      );

      const data = {
        title: formData.title.trim(),
        description,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        main_image: mainImageUrl,
        images: imageUrls,
      };

      if (isEdit) {
        await updateDoc(docRef, data);
      } else {
        await setDoc(docRef, { ...data, createdAt: serverTimestamp() });
      }

      try {
        const idToken = await auth.currentUser?.getIdToken();
        if (idToken) await revalidateEvents(idToken, targetId);
      } catch (err) {
        console.error("Помилка ревалідації:", err);
      }

      setSuccess(isEdit ? "Подію оновлено." : "Подію створено.");
      setTimeout(() => {
        reset();
        router.push(isEdit ? `/events/${eventId}` : "/events");
      }, 900);
    } catch (err) {
      if (uploadedPaths.length) {
        await Promise.allSettled(
          uploadedPaths.map((path) =>
            deleteObject(ref(storage, path)),
          ),
        );
      }
      setError(getSaveErrorMessage(err, isEdit));
      console.error("Error saving event:", err);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ title: initialTitle, start_date: "", end_date: "" });
    setDateRange([null, null]);
    reset();
    setError("");
    setSuccess("");
  };

  const isDescriptionEmpty = !description.replace(/<[^>]*>/g, "").trim();
  const isEndBeforeStart =
    formData.end_date &&
    formData.start_date &&
    formData.end_date.toMillis() < formData.start_date.toMillis();
  const isFormValid =
    !!formData.title.trim() &&
    !isDescriptionEmpty &&
    !!formData.start_date &&
    !isEndBeforeStart;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}

      <div className={styles.form_group}>
        <label htmlFor="title" className={styles.label}>
          Заголовок події *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Введіть заголовок події"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.form_group}>
        <label className={styles.label}>Опис події *</label>
        <RichTextEditor
          initialContent={initialDescription}
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.form_group}>
        <label className={styles.label}>Дата події *</label>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
            setFormData((prev) => ({
              ...prev,
              start_date: update[0]
                ? Timestamp.fromDate(update[0])
                : "",
              end_date: update[1]
                ? Timestamp.fromDate(update[1])
                : "",
            }));
          }}
          isClearable={true}
          className={`${styles.input} ${styles.datepicker}`}
          placeholderText="Виберіть дату"
          dateFormat="dd/MM/yyyy"
          disabled={isSubmitting}
        />
      </div>

      <div className={styles.form_group}>
        <label className={styles.label}>Головне зображення</label>
        <MainImageUploader disabled={isSubmitting} />
      </div>

      <div className={styles.form_group}>
        <label className={styles.label}>Галерея зображень</label>
        <ImageUploader disabled={isSubmitting} />
      </div>

      <div className={styles.form_actions}>
        <button
          type="button"
          onClick={handleCancel}
          className={styles.cancelButton}
          disabled={isSubmitting}
        >
          Скасувати
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting
            ? isEdit
              ? "Збереження..."
              : "Створення..."
            : isEdit
             ? "Зберегти зміни"
             : "Створити подію"}
        </button>
      </div>
    </form>
  );
}
