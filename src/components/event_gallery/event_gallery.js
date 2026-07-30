"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "@/app/events/[id]/page.module.css";

export default function EventGallery({ images, title }) {
    const [activeImage, setActiveImage] = useState(0);

    if (!images || images.length === 0) return null;

    return (
        <div className={styles.gallery}>
            <div className={styles.gallery_main_wrap}>
                <Image
                    src={images[activeImage]}
                    alt={`${title} ${activeImage + 1}`}
                    fill
                    className={styles.gallery_main_image}
                    sizes="(max-width: 768px) 100vw, 860px"
                />
            </div>
            {images.length > 1 && (
                <div className={styles.thumbnails}>
                    {images.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`${styles.thumb_btn} ${i === activeImage ? styles.thumb_active : ""}`}
                        >
                            <Image
                                src={src}
                                alt={`${title} ${i + 1}`}
                                fill
                                className={styles.thumb_image}
                                sizes="100px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
