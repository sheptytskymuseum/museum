import classes from "./footer.module.css";
import Logotext from "../logotext/logotext";
import Social from "../social/social";
import Link from "next/link";

export default function Footer({}) {
    return (
        <div className={classes.footer}>
            <div className={`container`}>
                <div className={classes.main_block}>
                    <div className={classes.info_block}>
                        <Logotext />
                        <div>Львів, вул. Максима Кривоноса 1, 79000</div>
                        <div>Тел: 050 519 1371</div>
                        <div>Email: museum.andrey@gmail.com</div>
                    </div>
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
                    <div>
                        <p className={classes.footer_text}>
                            Продовжуємо культурно-просвітницьку місію
                            митрополита Андрея
                        </p>
                        <Social />
                    </div>
                </div>
                <div className={classes.bottom_block}>
                    &copy; {new Date().getFullYear()} | Developed by Ivan
                    Shpynda
                </div>
            </div>
        </div>
    );
}
