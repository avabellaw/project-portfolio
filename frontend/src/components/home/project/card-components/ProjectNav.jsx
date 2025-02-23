import styles from './ProjectNav.module.css';

const Nav = ({ viewControls, projects }) => {

    return (
        <nav id={styles['nav-container']}>
            <div id={styles['nav-link-names']}>
                {projects.map((project, i) => (
                    <span
                        key={project.title}
                        onClick={() => viewControls.scrollToProject(i)}
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
                        onClick={() => viewControls.scrollToProject(i)}
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