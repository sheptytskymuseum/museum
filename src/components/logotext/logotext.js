import Link from "next/link";
import classes from "./logotext.module.css";

export default function Logotext({ isALink = true }) {
    return (
        <>
            {isALink ? (
                <Link href="/" className={classes.logo_text}>
                    МУЗЕЙ МИТРОПОЛИТА
                    <div className={classes.logo_text_bold}>АНДРЕЯ</div>
                </Link>
            ) : (
                <div className={classes.logo_text}>
                    МУЗЕЙ МИТРОПОЛИТА
                    <div className={classes.logo_text_bold}>АНДРЕЯ</div>
                </div>
            )}
        </>
    );
}
