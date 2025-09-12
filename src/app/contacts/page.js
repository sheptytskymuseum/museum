import classes from "./page.module.css";
import PageWrapper from "@/components/page_wrapper/page_wrapper";
import MyMap from "@/components/map/map";

export default function Contacts() {
    return (
        <PageWrapper>
            <div className={classes.text_wrap}>
                <h1>Контакти</h1>
                <p>м. Львів, вул. Максима Кривоноса 1, 79000</p>
                <p>тел: 050 519 1371</p>
                <p>email: museum.andrey@gmail.com</p>
            </div>
            <MyMap />
        </PageWrapper>
    );
}
