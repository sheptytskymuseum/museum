"use client";
import classes from "./slider.module.css";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

const images = [
    // "/images/image-1.jpg",
    // "/images/image-2.png",
    // "/images/image-3.png",
    // "/images/image-4.png",
    "https://picsum.photos/200/400",
    "https://picsum.photos/300/700",
    "https://picsum.photos/400/900",
    "https://picsum.photos/500/1000",
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
    }, [images.length]);

    return (
        <div className={classes.frame}>
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
        </div>
    );
}
