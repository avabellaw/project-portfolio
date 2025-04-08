import { useEffect } from 'react';
import styles from './Footer.module.css'

import { ReactComponent as GitHubLogo } from "./github-logo.svg"

import { motion, useAnimate } from 'motion/react'

const Footer = () => {
    const [scope, animate] = useAnimate();

    useEffect(() => {
        async function animateFooter(){
            await animate(scope.current, { y: 0 }, {
                // Matches the header enter animation
                type: 'spring',
                stiffness: 100,
                damping: 20
            });

            // Animates a subtle flash to draw user's attention
            await animate(scope.current, { opacity: [1, 0.5, 1] }, { delay: 0.4, duration: 0.6, ease: 'easeInOut' })
        }
        
        animateFooter();
    }, [animate, scope])

    return (
        <motion.div
            ref={scope}
            initial={{ y: 50 }}
        >
            <footer id={styles['footer']}>
                <a href="https://github.com/avabellaw/project-portfolio" target='_blank' rel="noreferrer"><GitHubLogo className={styles['github-logo']} />View GitHub repo</a>
            </footer>
        </motion.div>
    )
};

export default Footer