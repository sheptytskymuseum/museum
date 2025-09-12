"use client";
import classes from "./history_preview.module.css";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HistoryPreview() {
    return (
        <div className={classes.wrap}>
            <h2>Про нас</h2>
            <div className={classes.text_wrap}>
                <p className={classes.text}>
                    Історія колекції музею тісно пов’язана з особистою
                    ініціативою та тривалою працею о. Севастіяна Дмитруха, який
                    власноруч збирав усі експонати, що нині складають основу
                    музейного фонду. Колекція поєднує в собі предмети сакральної
                    спадщини, а також речі, які пов’язують із постаттю
                    митрополита Андрея...
                </p>
                <Link href="/about" className={classes.link}>
                    Дізнатись більше
                </Link>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileInView={{ opacity: 1 }}
            >
                <Image
                    src="/images/museum2.png"
                    alt="museum-img"
                    className={classes.bottom_image}
                    width={300}
                    height={200}
                />
            </motion.div>
        </div>
    );
}
