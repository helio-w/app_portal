import { useCurrentUser } from "../../api/currentUser.ts";
import { strings } from "../../strings.ts";
import styles from "./Navbar.module.css";

export default function Navbar() {
    const { data: user } = useCurrentUser();

    return (
        <nav className={styles.nav}>
            <ul className={styles.bar}>
                <li>
                    <span className={styles.title}>{strings.appName}</span>
                </li>
            </ul>
            <ul className={`${styles.bar} ${styles.actionBar}`}>
                <li>
                    <a className={styles.link} href="/">
                        {strings.navbar.applications}
                    </a>
                </li>

                <li className={styles.spacer}></li>
                {user?.is_staff && (
                    <li>
                        <a className={styles.link} href="/admin/">
                            {strings.navbar.admin}
                        </a>
                    </li>
                )}
                {user && !user.is_authenticated && (
                    <li>
                        <a className={styles.link} href="/admin/login/?next=/">
                            {strings.navbar.login}
                        </a>
                    </li>
                )}
            </ul>
        </nav>
    );
}
