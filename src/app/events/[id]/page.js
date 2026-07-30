import { notFound } from "next/navigation";
import Image from "next/image";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import EventAdminActions from "@/components/event_admin_actions/event_admin_actions";
import EventGallery from "@/components/event_gallery/event_gallery";
import formatISOToDDMMYYYY from "@/utils/formatDate";
import { getEvent, stripHtml } from "@/lib/events";
import styles from "./page.module.css";

function formatTimestamp(timestamp) {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatISOToDDMMYYYY(date.toISOString());
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) return {};

    const description = stripHtml(event.description || "").slice(0, 200);

    return {
        title: event.title,
        description,
        openGraph: {
            title: event.title,
            description,
        },
    };
}

export default async function EventPage({ params }) {
    const { id } = await params;
    const event = await getEvent(id);

    if (!event) notFound();

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
                        <EventAdminActions eventId={event.id} />
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

                <EventGallery images={galleryImages} title={event.title} />
            </article>
        </PageWrapper>
    );
}
