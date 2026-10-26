"use server";

import { revalidatePath } from "next/cache";

async function verifyIdToken(idToken) {
  if (!idToken) return false;
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        cache: "no-store",
      },
    );
    if (!res.ok) return false;
    const data = await res.json();
    return Array.isArray(data.users) && data.users.length > 0;
  } catch (err) {
    console.error("Error verifying id token:", err);
    return false;
  }
}

export async function revalidateEvents(idToken, eventId) {
  if (!(await verifyIdToken(idToken))) return { ok: false };

  revalidatePath("/");
  revalidatePath("/events");
  if (eventId) revalidatePath(`/events/${eventId}`);

  return { ok: true };
}
