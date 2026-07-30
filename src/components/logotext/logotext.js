import Link from "next/link";
import Image from "next/image";
import classes from "./logotext.module.css";

export default function Logotext({
    isALink = true,
    theme = "light",
    variant = "header",
}) {
    const size = variant === "footer" ? 40 : 46;

    const content = (
        <>
            <Image
                src="/images/logo.png"
                alt="logo"
                width={size}
                height={size}
                className={classes.logo_img}
            />
            <span
                className={`${classes.logo_text} ${
                    theme === "dark" ? classes.dark : ""
                } ${variant === "footer" ? classes.footer_size : ""}`}
            >
                МУЗЕЙ МИТРОПОЛИТА
                <br />
                <span className={classes.logo_text_bold}>АНДРЕЯ</span>
            </span>
        </>
    );

    return isALink ? (
        <Link href="/" className={classes.wrap}>
            {content}
        </Link>
    ) : (
        <div className={classes.wrap}>{content}</div>
    );
}
