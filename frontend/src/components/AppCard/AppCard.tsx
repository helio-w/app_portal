import { strings } from "../../strings.ts";
import styles from "./AppCard.module.css";

type AppCardProps = {
    title: string;
    url: string;
    description?: string;
    iconUrl?: string;
};

export default function AppCard({
    title,
    url,
    description = strings.appCard.noDescription,
    iconUrl,
}: AppCardProps) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <div className={styles.card}>
                {iconUrl ? (
                    <img className={styles.icon} src={iconUrl} alt="" />
                ) : (
                    <div className={styles.icon}>{title.slice(0, 1)}</div>
                )}
                <div className={styles.title}>
                    <span>{title}</span>
                </div>
                <div className={styles.description}>
                    <span>{description}</span>
                </div>
            </div>
        </a>
    );
}
