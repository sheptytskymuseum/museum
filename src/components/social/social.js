import classes from "./social.module.css";
import Image from "next/image";
import YouTubeIcon from "../../assets/youtube.svg";
import FacebookIcon from "../../assets/facebook.svg";
export default function Social() {
    return (
        <div className={classes.wrap}>
            <a href="https://www.youtube.com/@InfoMMASH" target="_blank">
                <YouTubeIcon className={classes.icon} />
            </a>
            <a href="https://www.facebook.com/Sheptyckymuz" target="_blank">
                <FacebookIcon className={classes.icon} />
            </a>
        </div>
    );
}
