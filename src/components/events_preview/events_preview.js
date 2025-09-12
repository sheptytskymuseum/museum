"use client";
import Image from "next/image";
import Link from "next/link";
import classes from "./events_preview.module.css";
import ArrowIcon from "../../assets/arrow.svg";
import { motion } from "motion/react";
import formatISOToDDMMYYYY from "@/utils/formatDate";

const articlesData = [
    {
        id: "1",
        title: "Яворівська писанка",
        text: "Виставка присвячена унікальному явищу української культури — яворівській писанці, що походить із Яворівщини на Львівщині. Вона вирізняється світлими барвами, традиційними орнаментами та символікою, що передається з покоління в покоління. У кожній писанці — закодовані бажання добра, здоров’я, родинного щастя. Відвідувачі побачать рідкісні зразки, дізнаються про техніки виготовлення та зможуть відчути живий зв’язок між минулим і сучасністю. Виставка запрошує замислитися над значенням писанки як не лише святкового атрибута, а й духовного символу української ідентичності.",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        mainImage: "/images/event1.jpg",
    },
    {
        id: "2",
        title: "Вистава Олега Беньковського",
        text: "У центрі вистави — глибоке психологічне занурення у внутрішній світ людини, її вибір, страхи та надії. Режисер Олег Беньковський, знаний своєю уважністю до деталей та повагою до глядача, створює сценічний простір, де важлива кожна тиша, кожен жест. У цій постановці він поєднує традиції української сцени з елементами європейського модерну, відкриваючи нове звучання знайомих тем. Актори втілюють образи з надзвичайною щирістю, запрошуючи глядача до співпереживання й роздумів. Це не просто театральне дійство — це жива розмова, яка залишається з вами надовго.",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        mainImage: "/images/event2.jpg",
    },
    {
        id: "3",
        title: "Музичний концерт",
        text: "Запрошуємо на незабутній музичний вечір, де мелодія поєднається з емоцією, а сцена — з душею кожного слухача. У програмі — твори українських і світових композиторів у виконанні талановитих музикантів, які створюють атмосферу натхнення й гармонії. Концерт охоплює різні жанри — від класики до сучасних інтерпретацій, що дозволяє кожному знайти свою ноту. Це не просто виступ — це зустріч із живою музикою, яка пробуджує спогади, мрії та глибокі переживання. Приходьте, щоб розділити цю особливу мить, у якій час завмирає, а звучання лишається з вами надовго.",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        mainImage: "/images/event3.jpg",
    },
    {
        id: "4",
        title: "Виставка художніх творів",
        text: "Запрошуємо відвідати виставку, де мистецтво оживає в кольорах, формах і сюжетах. Тут зібрані роботи сучасних українських художників, які сміливо поєднують традиції та експеримент, створюючи унікальний діалог між минулим і сучасністю. Картини розкривають глибину людських емоцій, красу природи та силу уяви. Відвідувачі матимуть можливість не лише насолодитися естетикою творів, а й відчути авторське бачення світу, зануритися у творчий процес і знайти власне натхнення. Виставка стане зустріччю з мистецтвом, яке говорить без слів, але промовляє до кожного серця.",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        mainImage: "/images/event4.jpg",
    },
];

function limitText(text, limit) {
    const words = text.split(/\s+/);
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
}

export default function EventsPreview({}) {
    return (
        <div className={classes.wrap}>
            <h2 className={classes.title}>Виставки та події</h2>
            <div className={classes.link_wrap}>
                <Link href="/events" className={classes.link}>
                    Дізнатись більше
                </Link>
                <ArrowIcon className={classes.arrow} />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0, duration: 0.5, delay: 0.2 }}
                className={classes.grid}
            >
                {articlesData.map((data, i) => (
                    <Link
                        href="events"
                        className={classes.event_card}
                        key={data.id}
                    >
                        <Image
                            src={data.mainImage}
                            alt="event-img"
                            width={300}
                            height={200}
                        />
                        <div>
                            <h3 className={classes.event_title}>
                                {data.title}
                            </h3>
                            <p className={classes.event_text}>
                                {i === 0
                                    ? limitText(data.text, 60)
                                    : limitText(data.text, 15)}
                            </p>
                            <p className={classes.event_date}>
                                {formatISOToDDMMYYYY(data.startDate)}
                                {" - "}
                                {formatISOToDDMMYYYY(data.endDate)}
                            </p>
                        </div>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
