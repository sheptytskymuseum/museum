import classes from "./page.module.css";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import EventsAdminBar from "@/components/events_admin_bar/events_admin_bar";
import EventEditButton from "@/components/event_edit_button/event_edit_button";
import EventDeleteButton from "@/components/event_delete_button/event_delete_button";
import EventRow from "@/components/event_row/event_row";
import { collection, getDocs, orderBy, query } from "firebase/firestore/lite";
import { firestoreServer } from "@/firebase-server";

export const metadata = {
    title: "Виставки та події",
    description:
        "Актуальні та минулі виставки й події Музею митрополита Андрея Шептицького у Львові.",
};

export const revalidate = 60;

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
            {events.length === 0 ? (
                <p>Подій поки немає</p>
            ) : (
                <div className={classes.list}>
                    {events.map((event, i) => (
                        <EventRow
                            event={event}
                            index={i}
                            wordLimit={32}
                            actions={
                                <>
                                    <EventEditButton eventId={event.id} />
                                    <EventDeleteButton eventId={event.id} />
                                </>
                            }
                            key={event.id}
                        />
                    ))}
                </div>
            )}
        </PageWrapper>
    );
}
