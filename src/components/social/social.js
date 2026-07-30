import classes from "./social.module.css";
import YouTubeIcon from "@/assets/youtube.svg";
import FacebookIcon from "@/assets/facebook.svg";

export default function Social({ theme = "light", size = "md" }) {
    return (
        <div
            className={`${classes.wrap} ${theme === "dark" ? classes.dark : ""} ${
                size === "sm" ? classes.small : ""
            }`}
        >
            <a
                href="https://www.youtube.com/@InfoMMASH"
                target="_blank"
                className={classes.link}
            >
                <YouTubeIcon className={classes.icon} />
            </a>
            <a
                href="https://www.facebook.com/Sheptyckymuz"
                target="_blank"
                className={classes.link}
            >
                <FacebookIcon className={classes.icon} />
            </a>
        </div>
    );
}
