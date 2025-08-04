import Link from "next/link";
import classes from "./page.module.css";

export default function Events() {
    return (
        <div>
            <h1>Виставки та події</h1>
            <h3>
                Тут поки що пусто, але щось прекрасне проростає просто зараз! 🌱
            </h3>
            <Link href="events/event-1">Test Link to Event 1</Link>
        </div>
    );
}
