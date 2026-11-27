import { strings } from "../../strings.ts";
import styles from "./AppCard.module.css";
import { Featured } from "../../theme/Icons.tsx";

type AppCardProps = {
    title: string;
    featured: boolean;
    url: string;
    description?: string;
    iconUrl?: string;
};

export default function AppCard({
    title,
    url,
    featured,
    description = strings.appCard.noDescription,
    iconUrl,
}: AppCardProps) {
    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <div className={styles.card}>
                {featured && (
                    <div className={styles.badge} role="img" aria-label={strings.appCard.featured}>
                        <Featured size={24} />
                    </div>
                )}
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
