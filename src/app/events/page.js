"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./page.module.css";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import Image from "next/image";
import formatISOToDDMMYYYY from "@/utils/formatDate";
import ArrowIcon from "../../assets/arrow.svg";
import { useAuth } from "@/hooks/useAuth";
import EditIcon from "@/assets/edit.svg";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { firestore } from "@/firebase";

export default function Events() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(
                    collection(firestore, "events"),
                    orderBy("createdAt", "desc"),
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(data);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return null;
        const date = timestamp.toDate
            ? timestamp.toDate()
            : new Date(timestamp);
        return formatISOToDDMMYYYY(date.toISOString());
    };

    return (
        <PageWrapper>
            <h1>Виставки та події</h1>
            {isAuthenticated && (
                <div className={classes.top_info}>
                    <p>
                        Загальна кількість подій:{" "}
                        <span className={classes.event_count}>
                            {events.length}
                        </span>
                    </p>
                    <Link href="/create" className={classes.create_event}>
                        Створити подію
                    </Link>
                </div>
            )}
            <div className={classes.divider}></div>
            {loading ? (
                <p>Завантаження...</p>
            ) : events.length === 0 ? (
                <p>Подій поки немає</p>
            ) : (
                events.map((event) => (
                    <Link href={`/events/${event.id}`} key={event.id}>
                        <div className={classes.event_wrap}>
                            {event.images?.[0] && (
                                <div className={classes.image_wrap}>
                                    <Image
                                        src={event.images[0]}
                                        alt="event-image"
                                        fill
                                        className={classes.image}
                                        sizes="30vw"
                                    />
                                </div>
                            )}
                            <div className={classes.about_event}>
                                <div>
                                    <h3 className={classes.event_title}>
                                        {event.title}
                                    </h3>
                                    <div
                                        className={classes.event_text}
                                        dangerouslySetInnerHTML={{
                                            __html: event.description,
                                        }}
                                    />
                                </div>
                                <div className={classes.event_bottom}>
                                    <span className={classes.event_date}>
                                        {formatTimestamp(event.start_date)}
                                        {event.end_date && (
                                            <>
                                                {" "}
                                                -{" "}
                                                {formatTimestamp(
                                                    event.end_date,
                                                )}
                                            </>
                                        )}
                                    </span>
                                    <div className={classes.link_wrap}>
                                        {isAuthenticated && (
                                            <div className={classes.edit_link}>
                                                <button
                                                    className={classes.edit_btn}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        router.push(
                                                            `/events/${event.id}/edit`,
                                                        );
                                                    }}
                                                >
                                                    Редагувати
                                                    <EditIcon
                                                        className={
                                                            classes.edit_icon
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        )}
                                        <p>Читати більше</p>
                                        <ArrowIcon
                                            className={classes.arrow_icon}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            )}
        </PageWrapper>
    );
}
