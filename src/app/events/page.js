import PageWrapper from "@/components/page_wrapper/page_wrapper";
import EventsAdminBar from "@/components/events_admin_bar/events_admin_bar";
import EventsList from "@/components/events_list/events_list";
import {
    collection,
    getCount,
    getDocs,
    limit,
    orderBy,
    query,
} from "firebase/firestore/lite";
import { firestoreServer } from "@/firebase-server";

export const metadata = {
    title: "Події",
    description:
        "Актуальні та минулі події Музею митрополита Андрея Шептицького у Львові.",
};

export const revalidate = 60;

const PAGE_SIZE = 5;

function serializeEvent(event) {
    const toISO = (ts) =>
        ts ? (ts.toDate ? ts.toDate() : new Date(ts)).toISOString() : null;
    return {
        ...event,
        start_date: toISO(event.start_date),
        end_date: toISO(event.end_date),
        createdAt: toISO(event.createdAt),
    };
}

export default async function Events() {
    let events = [];
    let hasMore = false;
    let totalCount = 0;
    try {
        const eventsRef = collection(firestoreServer, "events");
        const [countSnapshot, pageSnapshot] = await Promise.all([
            getCount(query(eventsRef)),
            getDocs(
                query(
                    eventsRef,
                    orderBy("createdAt", "desc"),
                    limit(PAGE_SIZE + 1),
                ),
            ),
        ]);
        totalCount = countSnapshot.data().count;
        hasMore = pageSnapshot.docs.length > PAGE_SIZE;
        events = pageSnapshot.docs
            .slice(0, PAGE_SIZE)
            .map((doc) => serializeEvent({ id: doc.id, ...doc.data() }));
    } catch (err) {
        console.error("Error fetching events:", err);
    }

    return (
        <PageWrapper>
            <h1>Події</h1>
            <EventsAdminBar count={totalCount} />
            {events.length === 0 ? (
                <p>Подій поки немає</p>
            ) : (
                <EventsList
                    initialEvents={events}
                    initialHasMore={hasMore}
                    pageSize={PAGE_SIZE}
                />
            )}
        </PageWrapper>
    );
}
