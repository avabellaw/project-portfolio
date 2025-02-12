import { useContext, useEffect } from 'react'

import '../../index.css'
import styles from './Layout.module.css'

import Header from './header/Header'
import { ColourSchemeContext } from './ColourSchemeContext'

const Layout = ({ children }) => {
    const { colours } = useContext(ColourSchemeContext)

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-colour', colours.primary_colour)
        document.documentElement.style.setProperty('--secondary-colour', colours.secondary_colour)
        document.documentElement.style.setProperty('--text-colour', colours.text_colour)
        document.documentElement.style.setProperty('--highlight-colour', colours.highlight_colour)
    }, [colours])

    return (
        <div
            id={styles['main-container']}
        >
            <Header />

            <main id={styles['main-content']}>
                {children}
            </main>
        </div>
    )
}

export default Layout