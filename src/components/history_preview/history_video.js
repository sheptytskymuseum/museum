"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function HistoryVideo({ className }) {
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        if (document.readyState === "complete") {
            setShouldLoadVideo(true);
            return;
        }

        const handleLoad = () => setShouldLoadVideo(true);
        window.addEventListener("load", handleLoad);

        return () => window.removeEventListener("load", handleLoad);
    }, []);

    useEffect(() => {
        if (!shouldLoadVideo || !videoRef.current) return;

        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
    }, [shouldLoadVideo]);

    if (!shouldLoadVideo) {
        return (
            <Image
                src="/videos/poster.png"
                alt="museum-img"
                className={className}
                width={1920}
                height={822}
            />
        );
    }

    return (
        <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster="/videos/poster.png"
            className={className}
        >
            <source src="/videos/video.mp4" type="video/mp4" />
        </video>
    );
}
