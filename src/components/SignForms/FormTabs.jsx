import Link from "next/link";
import React from 'react'
import styles from './FormTabs.module.css'

const FormTabs = ({activeTabIndex}) => {
    return (
        <div className={styles.login_tab}>
            <Link href="/sign-in" className={activeTabIndex === 0 ? `${styles.login_tab_link} ${styles.active}` : styles.login_tab_link}>Sign In</Link>
            <Link href="/sign-up" className={activeTabIndex === 1 ? `${styles.login_tab_link} ${styles.active}` : styles.login_tab_link}>Sign Up</Link>
        </div>
    )
}

export default FormTabs
