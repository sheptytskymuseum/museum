"use client";

import { useRouter } from "next/navigation";
import classes from "@/app/events/page.module.css";
import { useAuth } from "@/hooks/useAuth";
import EditIcon from "@/assets/edit.svg";

export default function EventEditButton({ eventId }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <div className={classes.edit_link}>
            <button
                className={classes.edit_btn}
                onClick={(e) => {
                    e.preventDefault();
                    router.push(`/events/${eventId}/edit`);
                }}
            >
                Редагувати
                <EditIcon className={classes.edit_icon} />
            </button>
        </div>
    );
}
