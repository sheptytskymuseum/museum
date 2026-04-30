"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import formatISOToDDMMYYYY from "@/utils/formatDate";
import { useAuth } from "@/hooks/useAuth";
import EditIcon from "@/assets/edit.svg";
import ArrowIcon from "@/assets/arrow.svg";
import styles from "./page.module.css";

function formatTimestamp(timestamp) {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatISOToDDMMYYYY(date.toISOString());
}

export default function EventPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const snap = await getDoc(doc(firestore, "events", id));
                if (!snap.exists()) {
                    router.replace("/events");
                    return;
                }
                setEvent({ id: snap.id, ...snap.data() });
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id, router]);

    if (loading) {
        return (
            <PageWrapper>
                <p className={styles.loading}>Завантаження...</p>
            </PageWrapper>
        );
    }

    if (!event) return null;

    const startDate = formatTimestamp(event.start_date);
    const endDate = formatTimestamp(event.end_date);
    const galleryImages = event.images?.length > 0 ? event.images : [];

    return (
        <PageWrapper>
            <article className={styles.article}>
                <header className={styles.header}>
                    <h1 className={styles.title}>{event.title}</h1>
                    <div className={styles.meta}>
                        {startDate && (
                            <span className={styles.date}>
                                {startDate}
                                {endDate && <> &mdash; {endDate}</>}
                            </span>
                        )}
                        {isAuthenticated && (
                            <Link
                                href={`/events/${event.id}/edit`}
                                className={styles.edit_link}
                            >
                                Редагувати
                                <EditIcon className={styles.edit_icon} />
                            </Link>
                        )}
                    </div>
                </header>

                {event.main_image && (
                    <div className={styles.main_image_wrap}>
                        <Image
                            src={event.main_image}
                            alt={event.title}
                            fill
                            className={styles.main_image}
                            sizes="(max-width: 768px) 100vw, 860px"
                            priority
                        />
                    </div>
                )}

                <div
                    className={styles.description}
                    dangerouslySetInnerHTML={{ __html: event.description }}
                />

                {galleryImages.length > 0 && (
                    <div className={styles.gallery}>
                        <div className={styles.gallery_main_wrap}>
                            <Image
                                src={galleryImages[activeImage]}
                                alt={`${event.title} ${activeImage + 1}`}
                                fill
                                className={styles.gallery_main_image}
                                sizes="(max-width: 768px) 100vw, 860px"
                            />
                        </div>
                        {galleryImages.length > 1 && (
                            <div className={styles.thumbnails}>
                                {galleryImages.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`${styles.thumb_btn} ${i === activeImage ? styles.thumb_active : ""}`}
                                    >
                                        <Image
                                            src={src}
                                            alt={`${event.title} ${i + 1}`}
                                            fill
                                            className={styles.thumb_image}
                                            sizes="100px"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </article>
        </PageWrapper>
    );
}
