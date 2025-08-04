import Image from "next/image";
import Link from "next/link";
import classes from "./events_preview.module.css";
import ArrowIcon from "../../assets/arrow.svg";

export default function EventsPreview({}) {
    return (
        <div className={classes.wrap}>
            <h2>Виставки та події</h2>
            <div className={classes.link_wrap}>
                <Link href="/events" className={classes.link}>
                    Дізнатись більше
                </Link>
                <ArrowIcon className={classes.arrow} />
            </div>
            <div>
                <Image
                    src="https://picsum.photos/500/300"
                    alt="test-img"
                    width={500}
                    height={300}
                />
            </div>
        </div>
    );
}
