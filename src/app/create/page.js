"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import styles from "./page.module.css";
import PageWrapper from "@/components/page_wrapper/page_wrapper";

export default function CreateEvent() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
    });
    const [images, setImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const { isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();

    // Redirect if not authenticated or not admin
    if (!isAuthenticated || !isAdmin) {
        router.push("/login");
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageAdd = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImages((prev) => [
                        ...prev,
                        {
                            id: Date.now() + Math.random(),
                            file: file,
                            preview: e.target.result,
                            name: file.name,
                        },
                    ]);
                };
                reader.readAsDataURL(file);
            }
        });

        // Reset input
        e.target.value = "";
    };

    const handleImageRemove = (imageId) => {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (
            !formData.title.trim() ||
            !formData.description.trim() ||
            !formData.start_date
        ) {
            setError("Будь ласка, заповніть всі обов'язкові поля");
            return;
        }

        setIsSubmitting(true);

        try {
            // Here you would implement the actual event creation logic
            // For now, just simulate the process
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("Event data:", formData);
            console.log("Images:", images);

            // Redirect to events page after successful creation
            router.push("/events");
        } catch (err) {
            setError("Помилка при створенні події. Спробуйте ще раз.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            title: "",
            description: "",
            start_date: "",
            end_date: "",
        });
        setImages([]);
        setError("");
    };

    return (
        <PageWrapper>
            <h1>Створення нової події</h1>
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
                    <label htmlFor="description" className={styles.label}>
                        Опис події *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        placeholder="Введіть опис події"
                        rows={10}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="start_date" className={styles.label}>
                        Початок *
                    </label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="end_date" className={styles.label}>
                        Кінець
                    </label>
                    <input
                        type="datetime-local"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                        disabled={isSubmitting}
                    />
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="images" className={styles.label}>
                        Зображення
                    </label>
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        onChange={handleImageAdd}
                        className={styles.file_input}
                        disabled={isSubmitting}
                    />

                    <div className={styles.images_preview}>
                        {images.length > 0 && (
                            <div>
                                <h4>Додані зображення:</h4>
                                <div className={styles.images_list}>
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className={styles.image_item}
                                        >
                                            <img
                                                src={image.preview}
                                                alt={image.name}
                                                className={styles.image_preview}
                                            />
                                            <div className={styles.image_info}>
                                                <span
                                                    className={styles.imageName}
                                                >
                                                    {image.name}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleImageRemove(
                                                            image.id
                                                        )
                                                    }
                                                    className={
                                                        styles.remove_button
                                                    }
                                                    disabled={isSubmitting}
                                                >
                                                    Видалити
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.form_actions}>
                    <button
                        type="button"
                        onClick={() => handleCancel()}
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
                            !formData.description.trim() ||
                            !formData.date
                        }
                    >
                        {isSubmitting ? "Створення..." : "Створити подію"}
                    </button>
                </div>
            </form>
        </PageWrapper>
    );
}
