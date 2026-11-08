import "./app.css"

type AppCardProps = {
    appTitle: string;
    appUrl: string;
    appDescription?: string;
    appIconUrl?: string;
}

export default function ({appTitle , appUrl, appDescription = "No description", appIconUrl} : AppCardProps) {
    return(
        <>
            <a href={appUrl} target="_blank">
                <div className="app-card">
                    { appIconUrl ? <img className="app-card-icon" src={appIconUrl} alt="logo"/> : <div className="app-card-icon">{appTitle.slice(0,1)}</div>}
                    <div className="app-card-title">
                        <span>{appTitle}</span>
                    </div>
                    <div className="app-card-description">
                        <span>{appDescription}</span>
                    </div>
                </div>
            </a>
        </>
    )
}