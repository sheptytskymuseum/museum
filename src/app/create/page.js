"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import EventForm from "@/components/event_form/event_form";
import useEventStore from "@/store/event_store";

export default function CreateEvent() {
    const { isAuthenticated, isAdmin } = useAuth();
    const router = useRouter();
    const reset = useEventStore((state) => state.reset);

    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            router.push("/login");
        }
    }, [isAuthenticated, isAdmin, router]);

    useEffect(() => {
        reset();
    }, []);

    if (!isAuthenticated || !isAdmin) return null;

    return (
        <PageWrapper>
            <h1>Створення нової події</h1>
            <EventForm mode="create" />
        </PageWrapper>
    );
}
