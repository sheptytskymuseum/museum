import classes from "./footer.module.css";
import Logotext from "../logotext/logotext";
import Social from "../social/social";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className={classes.footer}>
            <div className={classes.inner}>
                <div className={classes.top_row}>
                    <div className={classes.info_block}>
                        <Logotext variant="footer" />
                        <div className={classes.address}>
                            Львів, вул. Максима Кривоноса 1, 79000
                            <br />
                            050 519 1371
                            <br />
                            museum.andrey@gmail.com
                        </div>
                    </div>
                    <ul className={classes.nav_list}>
                        <li>
                            <Link href="/">Головна</Link>
                        </li>
                        <li>
                            <Link href="/events">Актуальне</Link>
                        </li>
                        <li>
                            <Link href="/about">Про нас</Link>
                        </li>
                        <li>
                            <Link href="/contacts">Контакти</Link>
                        </li>
                    </ul>
                    <Social />
                </div>
                <div className={classes.bottom_row}>
                    {new Date().getFullYear()} · Музей митрополита Андрея. Усі
                    права захищено.
                </div>
            </div>
        </footer>
    );
}
