"use client";

import Link from "next/link";
import classes from "@/app/events/page.module.css";
import { useAuth } from "@/hooks/useAuth";

export default function EventsAdminBar({ count }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <div className={classes.top_info}>
            <p>
                Загальна кількість подій:{" "}
                <span className={classes.event_count}>{count}</span>
            </p>
            <Link href="/create" className={classes.create_event}>
                Створити подію
            </Link>
        </div>
    );
}
