import { doc, getDoc } from "firebase/firestore/lite";
import { firestoreServer } from "@/firebase-server";

export function stripHtml(html) {
    return html.replace(/<[^>]*>/g, "");
}

export async function getEvent(id) {
    try {
        const snap = await getDoc(doc(firestoreServer, "events", id));
        if (!snap.exists()) return null;
        return { id: snap.id, ...snap.data() };
    } catch (err) {
        console.error("Error fetching event:", err);
        return null;
    }
}
