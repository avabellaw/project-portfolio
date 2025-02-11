import styles from './ProjectNav.module.css'

const Nav = ({ setIndex, currentIndex, projects }) => {
    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']}>
                <ul>
                    {projects.map((project, i) => (
                        <li
                            key={project.title}
                            onClick={() => setIndex(i)}
                            aria-label={`View project ${project.title}`}
                        >
                            {project.title}
                        </li>
                    ))}
                </ul>
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