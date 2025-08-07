import classes from "./partners.module.css";
import Image from "next/image";

export default function Partners() {
    return (
        <div className={classes.wrap}>
            <h2>Наші партнери</h2>
            <p className={classes.partners_intro}>
                Наші партнери — це спільнота однодумців, які підтримують
                збереження духовної спадщини та вшанування постаті Андрея
                Шептицького.
            </p>
            <div className={classes.image_container}>
                <Image
                    src="images/lviv-region.png"
                    alt="partner-img"
                    width={200}
                    height={250}
                />
                <Image
                    src="images/ugcc.png"
                    alt="partner-img"
                    width={200}
                    height={250}
                />
                <Image
                    src="images/ucu.png"
                    alt="partner-img"
                    width={250}
                    height={250}
                />
                <Image
                    src="images/lviv-city.png"
                    alt="partner-img"
                    width={180}
                    height={230}
                />
            </div>
        </div>
    );
}
