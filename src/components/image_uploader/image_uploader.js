"use client";

import { useRef, useState } from "react";
import useEventStore from "@/store/event_store";
import { compressImage } from "@/utils/compressImage";
import styles from "./image_uploader.module.css";

const MAX_IMAGES = 20;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function formatBytes(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageUploader({ disabled = false }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const images = useEventStore((state) => state.images);
    const addImages = useEventStore((state) => state.addImages);
    const removeImage = useEventStore((state) => state.removeImage);

    const isFull = images.length >= MAX_IMAGES;
    const isInteractive = !disabled && !isProcessing && !isFull;

    async function processFiles(fileList) {
        setError("");

        const remaining = MAX_IMAGES - images.length;
        if (remaining <= 0) {
            setError(`Максимум ${MAX_IMAGES} зображень`);
            return;
        }

        const all = Array.from(fileList);
        const invalid = all.filter((f) => !ACCEPTED_TYPES.includes(f.type));
        const valid = all
            .filter((f) => ACCEPTED_TYPES.includes(f.type))
            .slice(0, remaining);

        if (invalid.length > 0 && valid.length === 0) {
            setError("Дозволені лише PNG та JPG файли");
            return;
        }
        if (invalid.length > 0) {
            setError(
                `${invalid.length} файл(ів) пропущено — дозволені лише PNG та JPG`,
            );
        }
        if (!valid.length) return;

        setIsProcessing(true);
        try {
            const processed = await Promise.all(
                valid.map(async (file) => {
                    const compressed = await compressImage(file);
                    const preview = await fileToDataURL(compressed);
                    return {
                        id: Math.random().toString(36).slice(2),
                        file: compressed,
                        preview,
                        name: file.name,
                        size: compressed.size,
                    };
                }),
            );
            addImages(processed);
        } catch {
            setError("Помилка при обробці зображень. Спробуйте ще раз.");
        } finally {
            setIsProcessing(false);
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        setIsDragging(false);
        if (!isInteractive) return;
        processFiles(e.dataTransfer.files);
    }

    function handleDragOver(e) {
        e.preventDefault();
        if (isInteractive) setIsDragging(true);
    }

    function handleDragLeave(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDragging(false);
        }
    }

    function handleFileInput(e) {
        processFiles(e.target.files);
        e.target.value = "";
    }

    return (
        <div className={styles.wrapper}>
            <div
                className={[
                    styles.dropzone,
                    isDragging ? styles.dragging : "",
                    isFull || disabled ? styles.disabled : "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <svg
                    className={styles.icon}
                    width="40"
                    height="40"
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
                    <p className={styles.processing_text}>Обробка...</p>
                ) : isFull ? (
                    <p className={styles.drop_text}>
                        Досягнуто максимуму зображень
                    </p>
                ) : (
                    <>
                        <p className={styles.drop_text}>
                            Перетягніть зображення сюди
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

                <p className={styles.hint}>
                    PNG, JPG &nbsp;·&nbsp; {images.length} / {MAX_IMAGES}{" "}
                    зображень
                </p>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className={styles.hidden_input}
                />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            {images.length > 0 && (
                <div className={styles.preview_grid}>
                    {images.map((image) => (
                        <div key={image.id} className={styles.preview_item}>
                            <img
                                src={image.preview}
                                alt={image.name}
                                className={styles.preview_img}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className={styles.remove_btn}
                                disabled={disabled}
                                title="Видалити"
                            >
                                ×
                            </button>
                            <div className={styles.image_meta}>
                                <span
                                    className={styles.image_name}
                                    title={image.name}
                                >
                                    {image.name}
                                </span>
                                <span className={styles.image_size}>
                                    {formatBytes(image.size)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
