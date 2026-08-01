"use client";

import Image from "next/image";
import { useImageLightbox } from "@/components/image_lightbox/image_lightbox_context";
import styles from "./event_main_image.module.css";

export default function EventMainImage({ src, alt }) {
    const { open } = useImageLightbox();
    if (!src) return null;

    return (
        <button
            type="button"
            className={styles.main_image_wrap}
            onClick={() => open(0)}
            aria-label="Переглянути зображення на весь екран"
        >
            <Image
                src={src}
                alt={alt}
                fill
                className={styles.main_image}
                sizes="(max-width: 768px) 100vw, 860px"
                priority
            />
        </button>
    );
}
