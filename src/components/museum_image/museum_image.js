import Image from "next/image";
import classes from "./museum_image.module.css";

export default function MuseumImage({ src }) {
    return (
        <div>
            <Image src={src} alt="image" width={100} height={100} />
        </div>
    );
}
