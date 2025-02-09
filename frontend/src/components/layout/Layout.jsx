import { useState } from 'react'
import '../../index.css'
import styles from './Layout.module.css'
import Header from './header/Header'

const Layout = ({ children }) => {
    const [colours, setColours] = useState({
        primary: 'white',
        secondary: 'gray',
        text: 'black'
    })

    return (
        <div
            id={styles['main-container']}
            style={{
                "--primary-colour": colours.primary,
                "--secondary-colour": colours.secondary,
                "--text-colour": colours.text
            }}
        >
            <Header />

            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout