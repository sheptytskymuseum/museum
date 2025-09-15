"use client";

import Link from "next/link";
import classes from "./header.module.css";
import Social from "@/components/social/social";
import Hamburger from "@/components/hamburger/hamburger";
import Logotext from "../logotext/logotext";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LogoutIcon from "@/assets/logout.svg";
import { useState, useEffect } from "react";

const links = [
    { href: "/", label: "ГОЛОВНА" },
    { href: "/events", label: "АКТУАЛЬНЕ" },
    { href: "/about", label: "ПРО НАС" },
    { href: "/contacts", label: "КОНТАКТИ" },
];

export default function Navbar() {
    const path = usePathname();
    const { isAuthenticated, logout } = useAuth();
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsHamburgerOpen(false);
    };

    const toggleHamburger = () => {
        setIsHamburgerOpen((prev) => !prev);
    };

    const closeHamburger = () => {
        setIsHamburgerOpen(false);
    };

    useEffect(() => {
        if (isHamburgerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        // Cleanup function to restore scroll on unmount
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isHamburgerOpen]);

    return (
        <>
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
                                                className={
                                                    classes.item_underline
                                                }
                                            />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Social />
                        {isAuthenticated && (
                            <div
                                onClick={handleLogout}
                                className={classes.logout}
                            >
                                ВИЙТИ
                                <LogoutIcon className={classes.logoutIcon} />
                            </div>
                        )}
                    </nav>
                    <Hamburger
                        isOpen={isHamburgerOpen}
                        onToggle={toggleHamburger}
                    />
                </div>
            </header>

            {isHamburgerOpen && (
                <div className={classes.modal} onClick={closeHamburger}>
                    <div
                        className={classes.modal_content}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className={classes.mobile_nav}>
                            <ul>
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={closeHamburger}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Social />
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
