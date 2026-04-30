"use client";

import { useRef, useState } from "react";
import useEventStore from "@/store/event_store";
import { compressImage } from "@/utils/compressImage";
import styles from "./main_image_uploader.module.css";

const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export default function MainImageUploader({ disabled = false }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const mainImage = useEventStore((state) => state.mainImage);
    const setMainImage = useEventStore((state) => state.setMainImage);
    const removeMainImage = useEventStore((state) => state.removeMainImage);

    const isInteractive = !disabled && !isProcessing && !mainImage;

    async function processFile(file) {
        setError("");
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError("Дозволені лише PNG та JPG файли");
            return;
        }
        setIsProcessing(true);
        try {
            const compressed = await compressImage(file);
            const preview = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(compressed);
            });
            setMainImage({
                id: Math.random().toString(36).slice(2),
                file: compressed,
                preview,
                name: file.name,
                size: compressed.size,
            });
        } catch {
            setError("Помилка при обробці зображення. Спробуйте ще раз.");
        } finally {
            setIsProcessing(false);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        if (!isInteractive) return;
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (isInteractive) setIsDragging(true);
    }

    function handleDragLeave(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false);
    }

    function handleFileInput(e) {
        const file = e.target.files[0];
        if (file) processFile(file);
        e.target.value = "";
    }

    if (mainImage) {
        return (
            <div className={styles.preview_wrap}>
                <img
                    src={mainImage.preview}
                    alt="main"
                    className={styles.preview_img}
                />
                <button
                    type="button"
                    onClick={removeMainImage}
                    className={styles.remove_btn}
                    disabled={disabled}
                >
                    ×
                </button>
            </div>
        );
    }

    return (
        <div>
            <div
                className={[
                    styles.dropzone,
                    isDragging ? styles.dragging : "",
                    disabled ? styles.disabled : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <svg
                    className={styles.icon}
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {isProcessing ? (
                    <p className={styles.drop_text}>Обробка...</p>
                ) : (
                    <>
                        <p className={styles.drop_text}>
                            Перетягніть головне зображення сюди
                        </p>
                        <span className={styles.or_text}>або</span>
                        <button
                            type="button"
                            className={styles.browse_btn}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!isInteractive}
                        >
                            Огляд файлів
                        </button>
                    </>
                )}
                <p className={styles.hint}>PNG, JPG &nbsp;·&nbsp; 1 зображення</p>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className={styles.hidden_input}
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
