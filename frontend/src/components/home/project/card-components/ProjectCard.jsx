import styles from './ProjectCard.module.css';
import { motion } from 'motion/react';

const ProjectCard = ({ project, preview, filterProjectsBySkill }) => {

    const onSkillTagClick = (skill) => {
        filterProjectsBySkill(skill);
    }

    return (
        <div className={`${styles['project-card']} ${preview ? styles[preview] : ''}`}>

            <div className={styles['card-img']}>
                <img src={project.image_url} alt={`Project: ${project.title}`} />
            </div>
            <div className={styles['card-content']}>

                <h2>{project.title}</h2>

                <p>{project.description}</p>

                <div className={styles['card-links']}>
                    <a href={project.live_url} target="_blank" rel="noreferrer">Live Project</a>
                    <a href={project.github_url} target="_blank" rel="noreferrer">Github Repo</a>
                </div>

                <div className={styles['skill-tags']}>
                    {project.skills.map(skill => (
                        <span key={skill.id} className={styles['skill']} onClick={() => onSkillTagClick(skill)}>{skill.name}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;