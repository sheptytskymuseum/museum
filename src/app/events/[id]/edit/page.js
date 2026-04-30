"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import EventForm from "@/components/event_form/event_form";
import useEventStore from "@/store/event_store";

export default function EditEventPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated, isAdmin } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    const setDescription = useEventStore((state) => state.setDescription);
    const setMainImage = useEventStore((state) => state.setMainImage);
    const setImages = useEventStore((state) => state.setImages);
    const reset = useEventStore((state) => state.reset);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push("/login");
        }
    }, [isAuthenticated, isAdmin, router]);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) return;

        const fetchEvent = async () => {
            try {
                const snap = await getDoc(doc(firestore, "events", id));
                if (!snap.exists()) {
                    router.replace("/events");
                    return;
                }
                const data = { id: snap.id, ...snap.data() };
                setEvent(data);

                setDescription(data.description || "");

                if (data.main_image) {
                    setMainImage({
                        id: "existing-main",
                        isExisting: true,
                        url: data.main_image,
                        preview: data.main_image,
                        name: "",
                        size: 0,
                    });
                }

                setImages(
                    (data.images || []).map((url, i) => ({
                        id: `existing-${i}`,
                        isExisting: true,
                        url,
                        preview: url,
                        name: "",
                        size: 0,
                    })),
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();

        return () => reset();
    }, [id, isAuthenticated, isAdmin]);

    if (!isAuthenticated || !isAdmin) return null;

    if (loading) {
        return (
            <PageWrapper>
                <p>Завантаження...</p>
            </PageWrapper>
        );
    }

    if (!event) return null;

    const toDate = (ts) => (ts?.toDate ? ts.toDate() : null);

    return (
        <PageWrapper>
            <h1>Редагування події</h1>
            <EventForm
                mode="edit"
                eventId={id}
                initialTitle={event.title}
                initialDescription={event.description}
                initialDateRange={[toDate(event.start_date), toDate(event.end_date)]}
            />
        </PageWrapper>
    );
}
