"use client";
import classes from "./intro_section.module.css";
import Image from "next/image";
import Slider from "../slider/slider";
import { motion } from "motion/react";

export default function IntroSection() {
    return (
        <div id="hero" className={`container ${classes.main_wrap}`}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                    transition: { duration: 0.5 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                className={classes.logo_wrap}
            >
                <Image
                    src="/images/logo.png"
                    alt="logo-img"
                    className={classes.logo}
                    width={270}
                    height={270}
                />

                <h1>
                    МУЗЕЙ МИТРОПОЛИТА <span>АНДРЕЯ</span>
                </h1>
            </motion.div>
            <Slider />
        </div>
    );
}
