import './navbar.css'

export default function () {
    return (
        <>
            <nav>
                <ul className="header-bar">
                    <li><span className="app-title">Portail des applications</span></li>
                </ul>
                <ul className="action-bar">
                    <li>
                        <a href="">Applications</a>
                    </li>

                    <li className="spacer"></li>
                    <li>
                        <a href='/admin'>Panneau d'administration</a>
                    </li>
                    <li><a href="">Se connecter</a></li>
                </ul>
            </nav>
        </>
    )
}