import { useState } from 'react'
import '../../index.css'
import styles from './Layout.module.css'

const Layout = ({ children }) => {
    const [colours, setColours] = useState({
        primary: 'white',
        secondary: '#f3f3f3',
        text: 'black'
    })

    return (
        <div
            id={styles.mainContainer}
            style={{
                "--primary-colour": colours.primary,
                "--secondary-colour": colours.secondary,
                "--text-colour": colours.text
            }}
        >
            <header>
                { }
            </header>

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout