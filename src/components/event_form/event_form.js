"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    collection,
    doc,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { storage, firestore } from "@/firebase";
import styles from "@/app/create/page.module.css";
import RichTextEditor from "@/components/rich_text_editor/rich_text_editor";
import ImageUploader from "@/components/image_uploader/image_uploader";
import MainImageUploader from "@/components/main_image_uploader/main_image_uploader";
import useEventStore from "@/store/event_store";

export default function EventForm({
    mode = "create",
    eventId,
    initialTitle = "",
    initialDateRange = [null, null],
    initialDescription = "",
}) {
    const [formData, setFormData] = useState({
        title: initialTitle,
        start_date: initialDateRange[0] ? Timestamp.fromDate(initialDateRange[0]) : "",
        end_date: initialDateRange[1] ? Timestamp.fromDate(initialDateRange[1]) : "",
    });
    const [dateRange, setDateRange] = useState(initialDateRange);
    const [startDate, endDate] = dateRange;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

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

        const descriptionText = description.replace(/<[^>]*>/g, "").trim();
        if (!formData.title.trim() || !descriptionText || !formData.start_date) {
            setError("Будь ласка, заповніть всі обов'язкові поля");
            return;
        }

        setIsSubmitting(true);

        try {
            const targetId = isEdit ? eventId : doc(collection(firestore, "events")).id;
            const docRef = doc(firestore, "events", targetId);

            let mainImageUrl = null;
            if (mainImage) {
                if (mainImage.isExisting) {
                    mainImageUrl = mainImage.url;
                } else {
                    const storageRef = ref(storage, `events/${targetId}/main`);
                    await uploadBytes(storageRef, mainImage.file);
                    mainImageUrl = await getDownloadURL(storageRef);
                }
            }

            const imageUrls = await Promise.all(
                images.map(async (img) => {
                    if (img.isExisting) return img.url;
                    const storageRef = ref(storage, `events/${targetId}/${img.id}`);
                    await uploadBytes(storageRef, img.file);
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

            reset();
            router.push(isEdit ? `/events/${eventId}` : "/events");
        } catch (err) {
            setError(
                isEdit
                    ? "Помилка при оновленні події. Спробуйте ще раз."
                    : "Помилка при створенні події. Спробуйте ще раз.",
            );
            console.error("Error saving event:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({ title: initialTitle, start_date: "", end_date: "" });
        setDateRange([null, null]);
        reset();
        setError("");
    };

    const isDescriptionEmpty = !description.replace(/<[^>]*>/g, "").trim();

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}

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
                <RichTextEditor initialContent={initialDescription} disabled={isSubmitting} />
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
                            start_date: update[0] ? Timestamp.fromDate(update[0]) : "",
                            end_date: update[1] ? Timestamp.fromDate(update[1]) : "",
                        }));
                    }}
                    isClearable={true}
                    className={styles.input}
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
                    disabled={
                        isSubmitting ||
                        !formData.title.trim() ||
                        isDescriptionEmpty ||
                        !formData.start_date
                    }
                >
                    {isSubmitting
                        ? isEdit ? "Збереження..." : "Створення..."
                        : isEdit ? "Зберегти зміни" : "Створити подію"}
                </button>
            </div>
        </form>
    );
}
