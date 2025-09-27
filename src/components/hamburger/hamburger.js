import classes from "./hamburger.module.css";

export default function Hamburger({ isOpen, onToggle }) {
    return (
        <div className={classes.hamburger} onClick={onToggle}>
            <div
                className={`${isOpen ? classes.opened : ""} ${classes.wrapper}`}
            >
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
