import Link from "next/link";
import classes from "./logotext.module.css";

export default function Logotext({}) {
    return (
        <Link href="/" className={classes.logo_text}>
            МУЗЕЙ ПАМʼЯТI МИТРОПОЛИТА
            <div className={classes.logo_text_bold}>АНДРЕЯ</div>
        </Link>
    );
}
