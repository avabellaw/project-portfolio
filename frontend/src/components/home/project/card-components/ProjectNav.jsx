import { useEffect, useCallback } from 'react'

import styles from './ProjectNav.module.css'

const Nav = ({ setIndex, currentIndex, projects }) => {
    const handleScroll = useCallback((event) => {
        if (event.deltaY > 0) {
            // Scrolling down
            if (currentIndex === projects.length - 1) return;
            setIndex(Math.min(currentIndex + 1));
        } else {
            // Scrolling up
            if (currentIndex === 0) return;
            setIndex(currentIndex - 1);
        }
    }, [currentIndex, projects.length, setIndex]);

    useEffect(() => {
        // Passive event listener to improve scrolling performance, as not calling preventDefault
        window.addEventListener('wheel', handleScroll, { passive: true });
        return () => window.removeEventListener('wheel', handleScroll);
    }, [handleScroll]);

    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']}>
                {projects.map((project, i) => (
                    <span
                        key={project.title}
                        onClick={() => setIndex(i)}
                        data-current={currentIndex === i ? 'true' : 'false'}
                    >
                        {project.title}
                    </span>
                ))}
            </div>

            <div id={styles['nav-indicator']} >
                {projects.map((project, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={styles['project-nav-button']}
                        aria-label={`View project ${project.title}`}
                        aria-current={currentIndex === i ? 'true' : 'false'}
                    >

                    </button>
                ))}
            </div>
        </nav>
    )
}

export default Nav