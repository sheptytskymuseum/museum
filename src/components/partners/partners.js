"use client";
import classes from "./partners.module.css";
import Image from "next/image";
import { motion } from "motion/react";

export default function Partners() {
    return (
        <div className={classes.wrap}>
            <h2>Наші партнери</h2>
            <p className={classes.partners_intro}>
                Наші партнери — це спільнота однодумців, які підтримують
                збереження духовної спадщини та вшанування постаті Андрея
                Шептицького.
            </p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, delay: 0.2 },
                }}
                className={classes.image_container}
            >
                <Image
                    src="images/lviv-region.png"
                    alt="partner-img"
                    width={200}
                    height={250}
                />
                <Image
                    src="images/ugcc.png"
                    alt="partner-img"
                    width={200}
                    height={250}
                />
                <Image
                    src="images/ucu.png"
                    alt="partner-img"
                    width={250}
                    height={250}
                />
                <Image
                    src="images/lviv-city.png"
                    alt="partner-img"
                    width={180}
                    height={230}
                />
            </motion.div>
        </div>
    );
}
