import classes from "./page.module.css";
export default function Contacts() {
    return (
        <div className={classes.wrap}>
            <h1>Контакти</h1>
            <p>м. Львів, вул. Максима Кривоноса 1, 79000</p>
            <p>тел: 050 519 1371</p>
            <p>email: museum.andrey@gmail.com</p>
        </div>
    );
}
