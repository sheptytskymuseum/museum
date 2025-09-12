"use client";

import Link from "next/link";
import classes from "./header.module.css";
import Social from "@/components/social/social";
import Hamburger from "@/components/hamburger/hamburger";
import Logotext from "../logotext/logotext";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const links = [
    { href: "/", label: "ГОЛОВНА" },
    { href: "/events", label: "АКТУАЛЬНЕ" },
    { href: "/about", label: "ПРО НАС" },
    { href: "/contacts", label: "КОНТАКТИ" },
];

export default function Navbar() {
    const path = usePathname();
    return (
        <header className={classes.header}>
            <div className={`container ${classes.wrapper}`}>
                <Logotext />
                <nav className={classes.nav}>
                    <ul>
                        {links.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>
                                    {link.label}
                                    {link.href === path && (
                                        <motion.span
                                            layoutId="underline"
                                            className={classes.item_underline}
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <Social />
                </nav>
                <Hamburger />
            </div>
        </header>
    );
}
