"use client";

import Link from "next/link";
import classes from "./header.module.css";
import Social from "@/components/social/social";
import Hamburger from "@/components/hamburger/hamburger";
import Logotext from "../logotext/logotext";
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
    const isHome = path === "/";
    const { isAuthenticated, logout } = useAuth();
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [showFullHeader, setShowFullHeader] = useState(!isHome);

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

    useEffect(() => {
        if (!isHome) {
            setShowFullHeader(true);
            return;
        }

        const hero = document.getElementById("hero");
        if (!hero) {
            setShowFullHeader(true);
            return;
        }

        setShowFullHeader(false);

        const observer = new IntersectionObserver(
            ([entry]) => setShowFullHeader(!entry.isIntersecting),
            { rootMargin: "-77px 0px 0px 0px" },
        );

        observer.observe(hero);

        return () => observer.disconnect();
    }, [isHome]);

    const navLinks = (
        <ul>
            {links.map((link) => (
                <li key={link.href}>
                    <Link
                        href={link.href}
                        className={`${classes.link} ${
                            link.href === path ? classes.active : ""
                        }`}
                    >
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            {isHome && (
                <header
                    className={`${classes.heroHeader} ${
                        isHamburgerOpen ? classes.menuOpen : ""
                    }`}
                >
                    <div
                        className={`${classes.wrapper} ${classes.heroWrapper}`}
                    >
                        <nav className={`${classes.nav}`}>{navLinks}</nav>
                        <Hamburger
                            isOpen={isHamburgerOpen}
                            onToggle={toggleHamburger}
                        />
                    </div>
                </header>
            )}

            <header
                className={`${classes.header} ${
                    isHome
                        ? `${classes.floating} ${
                              showFullHeader ? classes.visible : ""
                          }`
                        : ""
                }`}
            >
                <div className={classes.wrapper}>
                    <Logotext
                        isALink={!isHamburgerOpen}
                        theme="dark"
                        variant="header"
                    />

                    <nav className={classes.nav}>
                        {navLinks}
                        <Social theme="dark" size="sm" />
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
