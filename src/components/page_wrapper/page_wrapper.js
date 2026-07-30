import classes from "./page_wrapper.module.css";

export default function PageWrapper({ children }) {
    return <div className={classes.wrap}>{children}</div>;
}
