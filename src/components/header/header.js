import Link from "next/link";
import classes from "./header.module.css";
import Social from "@/components/social/social";
import Hamburger from "@/components/hamburger/hamburger";
import Logotext from "../logotext/logotext";

export default function Navbar() {
    return (
        <header className={classes.header}>
            <div className={`container ${classes.wrapper}`}>
                <Logotext />
                <nav className={classes.nav}>
                    <ul>
                        <li>
                            <Link href="/events">ВИСТАВКИ ТА ПОДІЇ</Link>
                        </li>
                        <li>
                            <Link href="/history">ІСТОРІЯ МУЗЕЮ</Link>
                        </li>
                        <li>
                            <Link href="/mission">МІСІЯ</Link>
                        </li>
                        <li>
                            <Link href="/contacts">КОНТАКТИ</Link>
                        </li>
                    </ul>
                    <Social />
                </nav>
                <Hamburger />
            </div>
        </header>
    );
}
