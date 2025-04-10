import { useContext } from 'react';

import { AnimatePresence, motion } from 'motion/react'

import styles from './ProjectNav.module.css';

import { ViewportSizeContext } from '../../../ViewportSizeContext';


const Nav = ({ viewControls, filteredProjects }) => {
    const { isFullLayout } = useContext(ViewportSizeContext);
    const navTransitionValues = { duration: 0.3, type:'tween', ease: 'easeInOut'    }

    // Nav-link names animation
    const navNameAnimation = {
        initial: { x: -200, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -200, opacity: 0 },
    };

    // Nav-link buttons animation
    const navButtonAnimation = {
        initial: { flexGrow: 0 },
        animate: { flexGrow: 1 },
        exit: { marginTop: 0, flexGrow: 0, transition: { delay: isFullLayout ? 0.3 : 0/* Wait for name animation */, ...navTransitionValues } }
    }

    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']}>
                <AnimatePresence>
                    {filteredProjects.map((project, i) => (
                        <motion.span
                            key={project.title}
                            onClick={() => {
                                viewControls.setColours(filteredProjects[i].colour_scheme);
                                viewControls.scrollToProject(i);
                            }}
                            data-current={viewControls.getIndex() === i ? 'true' : 'false'}
                            layout='position' // Animations the position changes
                            {...navNameAnimation}
                            transition={{ ...navTransitionValues }}
                        >
                            {project.title}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </div>

            <div id={styles['nav-indicator']} >
                <AnimatePresence>
                    {filteredProjects.map((project, i) => (
                        <motion.button
                            key={i}
                            onClick={() => {
                                viewControls.setColours(filteredProjects[i].colour_scheme);
                                viewControls.scrollToProject(i);
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