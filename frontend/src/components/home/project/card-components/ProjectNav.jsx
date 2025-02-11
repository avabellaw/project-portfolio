import styles from './ProjectNav.module.css'

const Nav = ({ setIndex, currentIndex, projects }) => {
    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']}>
                <ul>
                    {projects.map((project) => (
                        <li
                            key={project.title}
                            onClick={() => setIndex(project.id)}
                            aria-label={`View project ${project.title + 1}`}
                            aria-current={currentIndex === project.id ? 'true' : 'false'}
                        >
                            {project.title}
                        </li>
                    ))}
                </ul>
            </div>

            <div id={styles['nav-indicator']} >
                {projects.map((project) => (
                    <button
                        key={project.id}
                        onClick={() => setIndex(project.id)}
                        className={styles['project-nav-button']}
                        aria-label={`View project ${project.title + 1}`}
                        aria-current={currentIndex === project.id ? 'true' : 'false'}
                    >

                    </button>
                ))}
            </div>
        </nav>
    )
}

export default Nav