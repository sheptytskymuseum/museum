import classes from "./partners.module.css";
import Image from "next/image";
import Link from "next/link";

const partners = [
  {
    href: "https://loda.gov.ua/",
    src: "/images/lviv-region.png",
    width: 170,
    height: 210,
  },
  {
    href: "https://ugcc.lviv.ua/",
    src: "/images/ugcc.png",
    width: 170,
    height: 210,
  },
  {
    href: "https://ucu.edu.ua/",
    src: "/images/ucu.png",
    width: 210,
    height: 210,
  },
  {
    href: "https://city-adm.lviv.ua/",
    src: "/images/lviv-city.png",
    width: 150,
    height: 190,
  },
];

export default function Partners() {
  return (
    <section className={classes.wrap}>
      <div className={classes.inner}>
        <div className={classes.header_row}>
          <h2 className={classes.title}>Наші партнери</h2>
          <p className={classes.text}>
            Спільнота однодумців, які підтримують збереження духовної спадщини
            та вшанування постаті Андрея Шептицького.
          </p>
        </div>
        <div className={classes.list}>
          {partners.map((partner) => (
            <Link href={partner.href} target="_blank" key={partner.href}>
              <Image
                src={partner.src}
                alt="partner-img"
                width={partner.width}
                height={partner.height}
                className={classes.image}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
