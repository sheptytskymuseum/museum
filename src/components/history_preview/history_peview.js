import classes from "./history_preview.module.css";
import Image from "next/image";
import Link from "next/link";

export default function HistoryPreview() {
    return (
        <div className={classes.wrap}>
            <div className={classes.top_block}>
                <Image
                    src="/images/museum1.png"
                    alt="museum-img"
                    className={classes.top_image}
                    width={300}
                    height={200}
                ></Image>
                <div className={classes.text_wrap}>
                    <h2>Про музей</h2>
                    <p className={classes.text}>
                        Історія колекції музею тісно пов’язана з особистою
                        ініціативою та тривалою працею о. Севастіяна Дмитруха,
                        який власноруч збирав усі експонати, що нині складають
                        основу музейного фонду. Колекція поєднує в собі предмети
                        сакральної спадщини, а також речі, які пов’язують із
                        постаттю митрополита Андрея. Частина з них — це об’єкти,
                        які люди зберігали, щиро вірячи в їхню автентичність і
                        належність самому Шептицькому...
                    </p>
                    <Link href="/history" className={classes.link}>
                        Дізнатись більше
                    </Link>
                </div>
            </div>
            <Image
                src="/images/museum2.png"
                alt="museum-img"
                className={classes.bottom_image}
                width={300}
                height={200}
            />
        </div>
    );
}
