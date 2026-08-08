"use client";

import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import EventRow from "@/components/event_row/event_row";
import EventEditButton from "@/components/event_edit_button/event_edit_button";
import EventDeleteButton from "@/components/event_delete_button/event_delete_button";
import classes from "./events_list.module.css";

const DELETED_EVENT_KEY = "museum:event-deleted";

function serializeEventDoc(doc) {
    const data = doc.data();
    const toISO = (ts) =>
        ts ? (ts.toDate ? ts.toDate() : new Date(ts)).toISOString() : null;
    return {
        id: doc.id,
        ...data,
        start_date: toISO(data.start_date),
        end_date: toISO(data.end_date),
        createdAt: toISO(data.createdAt),
    };
}

export default function EventsList({ initialEvents, initialHasMore, pageSize }) {
    const [events, setEvents] = useState(initialEvents);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const raw = sessionStorage.getItem(DELETED_EVENT_KEY);
        if (!raw) return;
        sessionStorage.removeItem(DELETED_EVENT_KEY);
        try {
            const { id, message } = JSON.parse(raw);
            setEvents((prev) => prev.filter((event) => event.id !== id));
            setNotice(message);
        } catch {
            // ignore malformed payload
        }
    }, []);

    useEffect(() => {
        if (!notice) return;
        const timeout = setTimeout(() => setNotice(""), 4000);
        return () => clearTimeout(timeout);
    }, [notice]);

    const handleDeleted = (eventId) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
        setNotice("Подію видалено.");
    };

    const loadMore = async () => {
        if (loading) return;
        setLoading(true);
        setError(false);
        try {
            const lastEvent = events[events.length - 1];
            const cursor = Timestamp.fromDate(new Date(lastEvent.createdAt));
            const q = query(
                collection(firestore, "events"),
                orderBy("createdAt", "desc"),
                startAfter(cursor),
                limit(pageSize + 1),
            );
            const snapshot = await getDocs(q);
            const nextHasMore = snapshot.docs.length > pageSize;
            const nextEvents = snapshot.docs
                .slice(0, pageSize)
                .map(serializeEventDoc);

            setEvents((prev) => [...prev, ...nextEvents]);
            setHasMore(nextHasMore);
        } catch (err) {
            console.error("Error loading more events:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {notice && <p className={classes.notice}>{notice}</p>}
            <div className={classes.list}>
                {events.map((event, i) => (
                    <EventRow
                        event={event}
                        index={i}
                        wordLimit={32}
                        actions={
                            <>
                                <EventEditButton eventId={event.id} />
                                <EventDeleteButton
                                    eventId={event.id}
                                    onDeleted={handleDeleted}
                                />
                            </>
                        }
                        key={event.id}
                    />
                ))}
            </div>
            {error && (
                <p className={classes.error}>
                    Не вдалося завантажити події. Спробуйте ще раз.
                </p>
            )}
            {hasMore && (
                <div className={classes.load_more_wrap}>
                    <button
                        type="button"
                        className={classes.load_more}
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading && <span className={classes.spinner} />}
                        {loading ? "Завантаження..." : "Завантажити більше"}
                    </button>
                </div>
            )}
        </>
    );
}
