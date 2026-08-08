"use client";

import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { ref, listAll, deleteObject } from "firebase/storage";
import { firestore, storage } from "@/firebase";
import { useAuth } from "@/hooks/useAuth";
import classes from "./event_delete_button.module.css";
import DeleteIcon from "@/assets/delete.svg";

export default function EventDeleteButton({ eventId, onDeleted }) {
    const { isAuthenticated } = useAuth();
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    if (!isAuthenticated) return null;

    const handleDelete = async (e) => {
        e.preventDefault();

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
            onDeleted?.(eventId);
        } catch (err) {
            console.error("Помилка при видаленні:", err);
            setError("Не вдалося видалити подію. Спробуйте ще раз.");
            setDeleting(false);
        }
    };

    return (
        <div className={classes.delete_wrap}>
            <div className={classes.delete_link}>
                <button
                    className={classes.delete_btn}
                    onClick={handleDelete}
                    disabled={deleting}
                >
                    {deleting ? "Видалення..." : "Видалити"}
                    <DeleteIcon className={classes.delete_icon} />
                </button>
            </div>
            {error && <p className={classes.error}>{error}</p>}
        </div>
    );
}
