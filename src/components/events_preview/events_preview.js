import Image from "next/image";
import Link from "next/link";
import classes from "./events_preview.module.css";
import ArrowIcon from "../../assets/arrow.svg";
import formatISOToDDMMYYYY from "@/utils/formatDate";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore/lite";
import { firestoreServer } from "@/firebase-server";

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

export default async function EventsPreview() {
    let events = [];
    try {
        const q = query(
            collection(firestoreServer, "events"),
            orderBy("createdAt", "desc"),
            limit(4),
        );
        const snapshot = await getDocs(q);
        events = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (err) {
        console.error("Error fetching events:", err);
    }

    return (
        <section className={`full-bleed ${classes.wrap}`}>
            <div className={classes.inner}>
                <div className={classes.header_row}>
                    <h2 className={classes.title}>Виставки та події</h2>
                    <Link href="/events" className={classes.link}>
                        Усі події
                        <ArrowIcon className={classes.arrow} />
                    </Link>
                </div>
                <div className={classes.list}>
                    {events.map((event, i) => (
                        <Link
                            href={`/events/${event.id}`}
                            className={classes.row}
                            key={event.id}
                        >
                            <div className={classes.index}>
                                {String(i + 1).padStart(2, "0")}
                            </div>
                            {event.images?.[0] && (
                                <Image
                                    src={event.images[0]}
                                    alt="event-img"
                                    width={220}
                                    height={140}
                                    className={classes.image}
                                />
                            )}
                            <div>
                                <h3 className={classes.event_title}>
                                    {event.title}
                                </h3>
                                <p className={classes.event_text}>
                                    {limitText(
                                        stripHtml(event.description),
                                        24,
                                    )}
                                </p>
                                <p className={classes.event_date}>
                                    {formatTimestamp(event.start_date)}
                                    {event.end_date && (
                                        <>
                                            {" "}
                                            —{" "}
                                            {formatTimestamp(event.end_date)}
                                        </>
                                    )}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
