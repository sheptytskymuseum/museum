"use client";

import classes from "./hamburger.module.css";
import { useState } from "react";

export default function Hamburger() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            className={classes.hamburger}
            onClick={() => setIsOpen((value) => !value)}
        >
            <div
                className={`${isOpen ? classes.opened : ""} ${classes.wrapper}`}
            >
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
