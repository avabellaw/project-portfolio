import { useEffect, useCallback, useState } from 'react'

import styles from './ProjectNav.module.css';

const Nav = ({ viewControls, projects }) => {
    const [scrollTimeout, setScrollTimeout] = useState(null);
    const [disableScroll, setDisableScroll] = useState(false);

    const handleScroll = useCallback((event) => {
        if (disableScroll) return;

        if (event.deltaY > 0) {
            // Scrolling down
            viewControls.nextProject();
        } else {
            // Scrolling up
            if (viewControls.index === 0) return;
            viewControls.prevProject();
        }

        setDisableScroll(true);

        const timeOut = setTimeout(() => {
            setDisableScroll(false);
            setScrollTimeout(null);
        }, 1000)

        setScrollTimeout(timeOut);
        
    }, [viewControls, disableScroll, setDisableScroll]);

    useEffect(() => {
        // Passive event listener to improve scrolling performance, as not calling preventDefault
        window.addEventListener('wheel', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('wheel', handleScroll)
            clearTimeout(scrollTimeout);
        };
    }, [handleScroll, scrollTimeout]);

    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']}>
                {projects.map((project, i) => (
                    <span
                        key={project.title}
                        onClick={() => viewControls.setIndex(i)}
                        data-current={viewControls.getIndex() === i ? 'true' : 'false'}
                    >
                        {project.title}
                    </span>
                ))}
            </div>

            <div id={styles['nav-indicator']} >
                {projects.map((project, i) => (
                    <button
                        key={i}
                        onClick={() => viewControls.setIndex(i)}
                        className={styles['project-nav-button']}
                        aria-label={`View project ${project.title}`}
                        aria-current={viewControls.getIndex() === i ? 'true' : 'false'}
                    >
                    </button>
                ))}
            </div>
        </nav>
    )
}

export default Nav