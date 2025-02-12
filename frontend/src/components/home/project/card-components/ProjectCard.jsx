import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, preview }) => {

    return (
        <div className={`${styles['project-card']} ${preview ? styles[preview] : ''}`}>
            <div className={styles['card-img']}>
                <img src={project.image_url} alt={`Project: ${project.title}`} />
            </div>

            <div className={styles['card-content']}>

                <h2>{project.title}</h2>

                <p>{project.description}</p>

                <div className={styles['card-links']}>
                    <a href={project.live_url} target="_blank" rel="noreferrer">View Live Project</a>
                    <a href={project.github_url} target="_blank" rel="noreferrer">View Github</a>
                </div>

                <div className={styles['skill-tags']}>
                    {project.skills.map(skill => (
                        <span key={skill.id} className={styles['skill']}>{skill.name}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;