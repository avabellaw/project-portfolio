import styles from './ProjectNav.module.css';

import { AnimatePresence, motion } from 'motion/react'

const Nav = ({ viewControls, projects }) => {
    // Nav-link names animation
    const navNameAnimation = {
        initial: { x: -200, opacity: 0 },
        animate: { x: 0, opacity: 1},
        exit: { x: -200, opacity: 0},
    };

    // Nav-link buttons animation
    const navButtonAnimation = {
        initial: { height: 0},
        animate: {height: 100},
        exit: {height: 0, scale: 0, marginTop: 0, flexGrow: 0, transition: {delay: 0.3/* Wait for name animation */}}
    }

    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']}>
                <AnimatePresence>
                    {projects.map((project, i) => (
                        <motion.span
                            key={project.title}
                            onClick={() => viewControls.scrollToProject(i)}
                            data-current={viewControls.getIndex() === i ? 'true' : 'false'}
                            layout='position' // Animations the position changes
                            {...navNameAnimation}
                            transition={{duration: 0.3}}
                        >
                            {project.title}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            <div id={styles['nav-indicator']} >
                <AnimatePresence>
                {projects.map((project, i) => (
                    <motion.button
                        key={i}
                        onClick={() => viewControls.scrollToProject(i)}
                        className={styles['project-nav-button']}
                        aria-label={`View project ${project.title}`}
                        aria-current={viewControls.getIndex() === i ? 'true' : 'false'}
                        layout // Animation the position and size changes
                        transition={{duration: 0.3}}
                        {...navButtonAnimation}
                    >
                    </motion.button>
                ))}
                </AnimatePresence>
            </div>
        </nav>
    )
}

export default Nav