import AppCard from "../AppCard/AppCard.tsx";
import { useApplications } from "../../api/applications.ts";
import { strings } from "../../strings.ts";
import styles from "./AppList.module.css";

export default function AppList() {
    const { data: apps, isPending, isError } = useApplications();

    if (isPending) return <p className={styles.status}>{strings.appList.loading}</p>;
    if (isError) return <p className={`${styles.status} ${styles.error}`}>{strings.appList.error}</p>;
    if (apps.length === 0) return <p className={styles.status}>{strings.appList.empty}</p>;

    return (
        <ul className={styles.list}>
            {apps.map((app) => (
                <li key={app.id}>
                    <AppCard
                        title={app.title}
                        featured={app.featured}
                        url={app.url}
                        description={app.description || undefined}
                        iconUrl={app.icon ?? undefined}
                    />
                </li>
            ))}
        </ul>
    );
}
