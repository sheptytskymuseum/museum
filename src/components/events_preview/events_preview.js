import Link from "next/link";
import classes from "./events_preview.module.css";
import ArrowIcon from "../../assets/arrow.svg";
import EventRow from "@/components/event_row/event_row";
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
} from "firebase/firestore/lite";
import { firestoreServer } from "@/firebase-server";

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
    <section>
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
            <EventRow event={event} index={i} key={event.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
