import Image from "next/image";
import Link from "next/link";
import classes from "./event_row.module.css";
import formatISOToDDMMYYYY from "@/utils/formatDate";
import { limitText, stripHtml } from "@/lib/events";

function formatTimestamp(timestamp) {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return formatISOToDDMMYYYY(date.toISOString());
}

export default function EventRow({ event, index, wordLimit = 24, actions }) {
    const coverImage = event.main_image || event.images?.[0];

    return (
        <Link href={`/events/${event.id}`} className={classes.row}>
            <div className={classes.index}>
                {String(index + 1).padStart(2, "0")}
            </div>
            {coverImage && (
                <div className={classes.image_wrap}>
                    <Image
                        src={coverImage}
                        alt="event-img"
                        width={260}
                        height={190}
                        className={classes.image}
                    />
                </div>
            )}
            <div className={classes.content}>
                <h3 className={classes.event_title}>{event.title}</h3>
                <p className={classes.event_date}>
                    {formatTimestamp(event.start_date)}
                    {event.end_date && (
                        <> — {formatTimestamp(event.end_date)}</>
                    )}
                </p>
                <p className={classes.event_text}>
                    {limitText(stripHtml(event.description), wordLimit)}
                </p>
            </div>
            <div className={classes.side}>{actions}</div>
        </Link>
    );
}
