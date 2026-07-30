import classes from "./history_preview.module.css";
import Image from "next/image";
import Link from "next/link";

export default function HistoryPreview() {
    return (
        <section className={`full-bleed ${classes.wrap}`}>
            <div className={classes.inner}>
                <div>
                    <div className={classes.eyebrow}>Про нас</div>
                    <h2 className={classes.title}>
                        Історія, збережена руками одного священника
                    </h2>
                </div>
                <div>
                    <p className={classes.text}>
                        Історія колекції музею тісно пов’язана з особистою
                        ініціативою та тривалою працею о. Севастіяна
                        Дмитруха, який власноруч збирав усі експонати, що
                        нині складають основу музейного фонду. Колекція
                        поєднує в собі предмети сакральної спадщини, а також
                        речі, які пов’язують із постаттю митрополита Андрея.
                    </p>
                    <Link href="/about" className={classes.link}>
                        Читати історію музею
                    </Link>
                </div>
            </div>
            <Image
                src="/images/museum2.png"
                alt="museum-img"
                className={classes.bottom_image}
                width={1280}
                height={420}
            />
        </section>
    );
}
