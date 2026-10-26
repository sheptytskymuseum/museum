import classes from "./page_wrapper.module.css";

// fullWidth: сторінка сама розставляє .container всередині, щоб мати повноширинні секції
export default function PageWrapper({ children, fullWidth = false }) {
  return (
    <div className={fullWidth ? classes.wrap : `container ${classes.wrap}`}>
      {children}
    </div>
  );
}
