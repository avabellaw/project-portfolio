import styles from './ProjectCard.module.css';

const ProjectCard = ({ project }) => {
    return (
        <div className={styles['project-card']}>
            <div className={styles['card-img']}></div>

            <h2>{project.title}</h2>

            <p>{project.description}</p>

            <a href={project.live_url} target="_blank">View Live Project</a>
            <a href={project.github} target="_blank">View Github</a>

            <div className={styles['skill-tags']}></div>
        </div>
    )
}

export default ProjectCard;