"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import ImageLightbox from "./image_lightbox";

const LightboxContext = createContext(null);

export function useImageLightbox() {
    const ctx = useContext(LightboxContext);
    if (!ctx) throw new Error("useImageLightbox must be used within LightboxProvider");
    return ctx;
}

export default function LightboxProvider({ images, children }) {
    const [activeIndex, setActiveIndex] = useState(null);
    const triggerRef = useRef(null);

    const open = useCallback((index) => {
        triggerRef.current = document.activeElement;
        setActiveIndex(index);
    }, []);
    const close = useCallback(() => {
        setActiveIndex(null);
        triggerRef.current?.focus?.();
    }, []);
    const next = useCallback(() => {
        setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));
    }, [images.length]);
    const prev = useCallback(() => {
        setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    }, [images.length]);

    useEffect(() => {
        if (activeIndex === null) return;
        document.body.style.overflow = "hidden";
        const onKey = (e) => {
            if (e.key === "Escape") close();
            else if (e.key === "ArrowRight") next();
            else if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", onKey);
        };
    }, [activeIndex, close, next, prev]);

    return (
        <LightboxContext.Provider value={{ images, activeIndex, open, close, next, prev }}>
            {children}
            <ImageLightbox />
        </LightboxContext.Provider>
    );
}
