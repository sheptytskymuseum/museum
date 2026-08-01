import { notFound } from "next/navigation";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import EventAdminActions from "@/components/event_admin_actions/event_admin_actions";
import EventGallery from "@/components/event_gallery/event_gallery";
import EventMainImage from "@/components/event_main_image/event_main_image";
import LightboxProvider from "@/components/image_lightbox/image_lightbox_context";
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
    const galleryStartIndex = event.main_image ? 1 : 0;
    const lightboxImages = [
        ...(event.main_image ? [{ src: event.main_image, alt: event.title }] : []),
        ...galleryImages.map((src, i) => ({
            src,
            alt: `${event.title} — зображення ${i + 1}`,
        })),
    ];

    return (
        <PageWrapper>
            <article className={styles.article}>
                <LightboxProvider images={lightboxImages}>
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

                    <EventMainImage src={event.main_image} alt={event.title} />

                    <div
                        className={styles.description}
                        dangerouslySetInnerHTML={{ __html: event.description }}
                    />

                    <EventGallery
                        images={galleryImages}
                        title={event.title}
                        startIndex={galleryStartIndex}
                    />
                </LightboxProvider>
            </article>
        </PageWrapper>
    );
}
