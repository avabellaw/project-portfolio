import { useContext, useRef } from 'react';

import { AnimatePresence, motion } from 'motion/react'

import styles from './ProjectNav.module.css';

import { ViewportSizeContext } from '../../../ViewportSizeContext';


const Nav = ({ viewControls, filteredProjects }) => {
    const { isFullLayout } = useContext(ViewportSizeContext);
    const navTransitionValues = { duration: 0.3, type:'tween', ease: 'easeInOut'    }
    const navIndicatorRef = useRef(null);
    const navLinkNamesRef = useRef(null);

    // Nav-link names animation
    const navNameAnimation = {
        initial: { x: -200, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { delay: 0.1, ...navTransitionValues } },
        exit: { x: -200, opacity: 0 },
    };

    // Nav-link buttons animation
    const navButtonAnimation = {
        initial: { flexGrow: 0 },
        animate: { flexGrow: 1, transition: { duration: 0.4, ...navTransitionValues } }, /* Extra 0.1 duration to sync with nav name entering */
        exit: { marginTop: 0, flexGrow: 0, transition: { delay: isFullLayout ? 0.3 : 0/* Wait for name animation */, ...navTransitionValues } }
    }

    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']} ref={navLinkNamesRef}>
                <AnimatePresence>
                    {filteredProjects.map((project, i) => (
                        <motion.span
                            key={project.title}
                            data-index={i}
                            onClick={() => {
                                viewControls.setColours(filteredProjects[i].colour_scheme);
                                viewControls.scrollToProject(i);
                            }}
                            onHoverStart={() => {
                                navIndicatorRef.current.querySelector(`[data-index="${i}"]`).classList.add(styles['hover']);
                            }}
                            onHoverEnd={() => {
                                navIndicatorRef.current.querySelector(`[data-index="${i}"]`).classList.remove(styles['hover']);
                            }}
                            data-current={viewControls.getIndex() === i ? 'true' : 'false'}
                            layout // Animations the position changes
                            {...navNameAnimation}
                            transition={{ ...navTransitionValues }}
                        >
                            <motion.span layout transition={{...navTransitionValues }}>{project.title}</motion.span>
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            <div id={styles['nav-indicator']} ref={navIndicatorRef}>
                <AnimatePresence>
                    {filteredProjects.map((project, i) => (
                        <motion.button
                            key={i}
                            data-index={i}
                            onClick={() => {
                                viewControls.setColours(filteredProjects[i].colour_scheme);
                                viewControls.scrollToProject(i);
                            }}
                            onHoverStart={() => {
                                navLinkNamesRef.current.querySelector(`[data-index="${i}"]`).classList.add(styles['hover']);
                            }}
                            onHoverEnd={() => {
                                navLinkNamesRef.current.querySelector(`[data-index="${i}"]`).classList.remove(styles['hover']);
                            }}
                            className={styles['project-nav-button']}
                            aria-label={`View project ${project.title}`}
                            aria-current={viewControls.getIndex() === i ? 'true' : 'false'}
                            layout // Animation the position and size changes
                            transition={{ ...navTransitionValues }}
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