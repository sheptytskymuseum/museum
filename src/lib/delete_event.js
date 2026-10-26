import { doc, deleteDoc } from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";
import { auth, firestore, storage } from "@/firebase";
import { revalidateEvents } from "@/app/actions/revalidate_events";

export async function deleteEvent(eventId) {
  // Спершу документ: якщо це не вдасться, подія залишиться цілою разом із зображеннями
  await deleteDoc(doc(firestore, "events", eventId));

  try {
    const list = await listAll(ref(storage, `events/${eventId}`));
    await Promise.all(list.items.map((item) => deleteObject(item)));
  } catch (err) {
    console.error("Не вдалося очистити файли події:", err);
  }

  try {
    const idToken = await auth.currentUser?.getIdToken();
    if (idToken) await revalidateEvents(idToken, eventId);
  } catch (err) {
    console.error("Помилка ревалідації:", err);
  }
}
