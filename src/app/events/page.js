import Link from "next/link";
import classes from "./page.module.css";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import Image from "next/image";
import formatISOToDDMMYYYY from "@/utils/formatDate";
import ArrowIcon from "../../assets/arrow.svg";
import EventsAdminBar from "@/components/events_admin_bar/events_admin_bar";
import EventEditButton from "@/components/event_edit_button/event_edit_button";
import { collection, getDocs, orderBy, query } from "firebase/firestore/lite";
import { firestoreServer } from "@/firebase-server";

export const metadata = {
    title: "Виставки та події",
    description:
        "Актуальні та минулі виставки й події Музею митрополита Андрея Шептицького у Львові.",
};

export const revalidate = 60;

function formatTimestamp(timestamp) {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatISOToDDMMYYYY(date.toISOString());
}

export default async function Events() {
    let events = [];
    try {
        const q = query(
            collection(firestoreServer, "events"),
            orderBy("createdAt", "desc"),
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
        <PageWrapper>
            <h1>Виставки та події</h1>
            <EventsAdminBar count={events.length} />
            <div className={classes.divider}></div>
            {events.length === 0 ? (
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
                                        <EventEditButton
                                            eventId={event.id}
                                        />
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
