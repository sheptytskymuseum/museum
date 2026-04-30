"use client";
import classes from "./slider.module.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { delay, motion } from "motion/react";

const images = [
    "/images/image-3.png",
    "/images/sheptycki-1.jpg",
    "/images/sheptycki-2.jpg",
    "/images/sheptycki-3.jpg",
];

export default function Slider() {
    const [current, setCurrent] = useState(0);
    const [fade, setFade] = useState(false);
    const fadeTimeout = useRef(null);
    const interval = useRef(null);

    useEffect(() => {
        interval.current = setInterval(() => {
            setFade(true);
            fadeTimeout.current = setTimeout(() => {
                setCurrent((prev) => (prev + 1) % images.length);
                setFade(false);
            }, 400); // 400ms = must be the same as transition property of image class
        }, 5000);

        return () => {
            clearInterval(interval.current);
            clearTimeout(fadeTimeout.current);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{
                opacity: 1,
                x: 0,
                transition: { duration: 0.5 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className={classes.frame}
        >
            <div className={classes.image_container}>
                <Image
                    src={images[current]}
                    className={`${classes.image} ${
                        fade ? classes.fadeOut : classes.fadeIn
                    }`}
                    alt="logo-img"
                    width={100}
                    height={100}
                    priority
                />
            </div>
        </motion.div>
    );
}
