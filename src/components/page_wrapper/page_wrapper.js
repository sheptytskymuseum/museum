"use client";

import classes from "./page_wrapper.module.css";
import { motion } from "motion/react";

export default function PageWrapper({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={classes.wrap}
        >
            {children}
        </motion.div>
    );
}
