"use client";

import Image from "next/image";
import { useImageLightbox } from "@/components/image_lightbox/image_lightbox_context";
import styles from "./event_gallery.module.css";

export default function EventGallery({ images, title, startIndex = 0 }) {
    const { open } = useImageLightbox();

    if (!images || images.length < 1) return null;

    return (
        <div className={styles.gallery}>
            <div className={styles.grid}>
                {images.map((src, i) => (
                    <button
                        key={src}
                        type="button"
                        className={styles.thumb_btn}
                        onClick={() => open(startIndex + i)}
                        aria-label={`Переглянути зображення ${i + 1} з ${images.length}`}
                    >
                        <Image
                            src={src}
                            alt={`${title} — зображення ${i + 1}`}
                            fill
                            className={styles.thumb_image}
                            sizes="(max-width: 768px) 33vw, 200px"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
