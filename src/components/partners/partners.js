"use client";
import classes from "./partners.module.css";
import Image from "next/image";
import { motion } from "motion/react";
import Link from "next/link";

export default function Partners() {
    return (
        <div className={classes.wrap}>
            <h2>Наші партнери</h2>
            <p className={classes.partners_intro}>
                Наші партнери — це спільнота однодумців, які підтримують
                збереження духовної спадщини та вшанування постаті Андрея
                Шептицького.
            </p>
            <div className={classes.partners_list}>
                <Link href="https://loda.gov.ua/" target="_blank">
                    <Image
                        src="images/lviv-region.png"
                        alt="partner-img"
                        width={200}
                        height={250}
                        className={classes.image}
                    />
                </Link>
                <Link href="https://ugcc.lviv.ua/" target="_blank">
                    <Image
                        src="images/ugcc.png"
                        alt="partner-img"
                        width={200}
                        height={250}
                        className={classes.image}
                    />
                </Link>
                <Link href="https://ucu.edu.ua/" target="_blank">
                    <Image
                        src="images/ucu.png"
                        alt="partner-img"
                        width={250}
                        height={250}
                        className={classes.image}
                    />
                </Link>
                <Link href="https://city-adm.lviv.ua/" target="_blank">
                    <Image
                        src="images/lviv-city.png"
                        alt="partner-img"
                        width={180}
                        height={230}
                        className={classes.image}
                    />
                </Link>
            </div>
        </div>
    );
}
