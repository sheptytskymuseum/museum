"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useImageLightbox } from "./image_lightbox_context";
import ArrowIcon from "@/assets/arrow.svg";
import styles from "./image_lightbox.module.css";

export default function ImageLightbox() {
    const { images, activeIndex, close, next, prev } = useImageLightbox();
    const isOpen = activeIndex !== null;
    const current = isOpen ? images[activeIndex] : null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="lightbox"
                    className={styles.overlay}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Перегляд зображення"
                    onClick={close}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <button
                        type="button"
                        className={styles.close_btn}
                        onClick={close}
                        aria-label="Закрити"
                    >
                        &times;
                    </button>

                    <div
                        className={styles.image_wrap}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={current.src}
                            alt={current.alt}
                            fill
                            className={styles.image}
                            sizes="100vw"
                        />
                    </div>

                    {images.length > 1 && (
                        <>
                            <button
                                type="button"
                                className={`${styles.nav_btn} ${styles.prev_btn}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prev();
                                }}
                                aria-label="Попереднє зображення"
                            >
                                <ArrowIcon />
                            </button>
                            <button
                                type="button"
                                className={`${styles.nav_btn} ${styles.next_btn}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    next();
                                }}
                                aria-label="Наступне зображення"
                            >
                                <ArrowIcon />
                            </button>
                            <div
                                className={styles.counter}
                                onClick={(e) => e.stopPropagation()}
                                aria-live="polite"
                            >
                                {activeIndex + 1} / {images.length}
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
