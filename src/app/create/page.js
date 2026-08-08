"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import EventForm from "@/components/event_form/event_form";
import LoadingSpinner from "@/components/loading_spinner/loading_spinner";
import useEventStore from "@/store/event_store";

export default function CreateEvent() {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const router = useRouter();
    const reset = useEventStore((state) => state.reset);

    useEffect(() => {
        if (loading) return;
        if (!isAuthenticated || !isAdmin) {
            router.push("/login");
        }
    }, [isAuthenticated, isAdmin, loading, router]);

    useEffect(() => {
        reset();
        return () => reset();
    }, []);

    if (loading) return <LoadingSpinner />;
    if (!isAuthenticated || !isAdmin) return null;

    return (
        <PageWrapper>
            <h1>Створення нової події</h1>
            <EventForm mode="create" />
        </PageWrapper>
    );
}
