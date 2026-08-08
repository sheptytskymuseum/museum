"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";
import { firestore, storage } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import EditIcon from "@/assets/edit.svg";
import DeleteIcon from "@/assets/delete.svg";
import styles from "@/app/events/[id]/page.module.css";

const DELETED_EVENT_KEY = "museum:event-deleted";

export default function EventAdminActions({ eventId }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    if (!isAuthenticated) return null;

    const handleDelete = async () => {
        if (
            !confirm(
                "Ви впевнені, що хочете видалити цю подію? Цю дію неможливо скасувати.",
            )
        )
            return;

        setError("");
        setDeleting(true);
        try {
            const storageRef = ref(storage, `events/${eventId}`);
            const list = await listAll(storageRef);
            await Promise.all(list.items.map((item) => deleteObject(item)));

            await deleteDoc(doc(firestore, "events", eventId));
            sessionStorage.setItem(
                DELETED_EVENT_KEY,
                JSON.stringify({ id: eventId, message: "Подію видалено." }),
            );
            router.push("/events");
        } catch (err) {
            console.error("Помилка при видаленні:", err);
            setError("Не вдалося видалити подію. Спробуйте ще раз.");
            setDeleting(false);
        }
    };

    return (
        <div className={styles.admin_actions_wrap}>
            <div className={styles.admin_actions}>
                <Link
                    href={`/events/${eventId}/edit`}
                    className={styles.edit_link}
                >
                    Редагувати
                    <EditIcon className={styles.edit_icon} />
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={styles.delete_btn}
                >
                    {deleting ? "Видалення..." : "Видалити"}
                    <DeleteIcon className={styles.delete_icon} />
                </button>
            </div>
            {error && <p className={styles.delete_error}>{error}</p>}
        </div>
    );
}
