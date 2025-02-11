import styles from './ProjectCard.module.css';

const ProjectCard = ({ project }) => {
    return (
        <div className={styles['project-card']}>
            <div className={styles['card-img']}></div>

            <div className={styles['card-content']}>

                <h2>{project.title}</h2>

                <p>{project.description}</p>

                <a href={project.live_url} target="_blank">View Live Project</a>
                <a href={project.github} target="_blank">View Github</a>

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