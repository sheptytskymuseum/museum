"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import classes from "./events_preview.module.css";
import ArrowIcon from "../../assets/arrow.svg";
import formatISOToDDMMYYYY from "@/utils/formatDate";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { firestore } from "@/firebase";

function limitText(text, wordLimit) {
    const words = text.split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
}

function stripHtml(html) {
    return html.replace(/<[^>]*>/g, "");
}

function formatTimestamp(timestamp) {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatISOToDDMMYYYY(date.toISOString());
}

export default function EventsPreview() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(
                    collection(firestore, "events"),
                    orderBy("createdAt", "desc"),
                    limit(4),
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEvents(data);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className={classes.wrap}>
            <h2 className={classes.title}>Виставки та події</h2>
            <div className={classes.link_wrap}>
                <Link href="/events" className={classes.link}>
                    Дізнатись більше
                </Link>
                <ArrowIcon className={classes.arrow} />
            </div>
            <div className={classes.grid}>
                {events.map((event, i) => (
                    <Link
                        href={`/events/${event.id}`}
                        className={classes.event_card}
                        key={event.id}
                    >
                        {event.images?.[0] && (
                            <Image
                                src={event.images[0]}
                                alt="event-img"
                                width={300}
                                height={200}
                                className={classes.image}
                            />
                        )}
                        <div>
                            <h3 className={classes.event_title}>
                                {event.title}
                            </h3>
                            <p className={classes.event_text}>
                                {i === 0
                                    ? limitText(
                                          stripHtml(event.description),
                                          60,
                                      )
                                    : limitText(
                                          stripHtml(event.description),
                                          15,
                                      )}
                            </p>
                            <p className={classes.event_date}>
                                {formatTimestamp(event.start_date)}
                                {event.end_date && (
                                    <> - {formatTimestamp(event.end_date)}</>
                                )}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
