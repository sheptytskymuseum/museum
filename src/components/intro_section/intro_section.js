import classes from "./intro_section.module.css";
import Image from "next/image";
import Slider from "../slider/slider";

export default function IntroSection() {
    return (
        <div className={`container ${classes.main_wrap}`}>
            <div className={classes.logo_wrap}>
                <Image
                    src="/images/logo.png"
                    alt="logo-img"
                    className={classes.logo}
                    width={270}
                    height={270}
                />
                <h1>
                    МУЗЕЙ ПАМʼЯТI МИТРОПОЛИТА <span>АНДРЕЯ</span>
                </h1>
            </div>
            <Slider />
        </div>
    );
}
