import { useContext, useEffect } from 'react'

import '../../index.css'
import styles from './Layout.module.css'

import Header from './header/Header'
import Footer from './footer/Footer'

import { ColourSchemeContext } from '../ColourSchemeContext'
import { LoadingContext } from '../LoadingContext'

const Layout = ({ children }) => {
    const { colours } = useContext(ColourSchemeContext)
    const { loading } = useContext(LoadingContext);

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
            {!loading && <Header />}

            <main id={styles['main-content']}>
                {children}
            </main>

            {!loading && <Footer />}
        </div>
    )
}

export default Layout