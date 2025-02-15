import styles from './ProjectCard.module.css';
import { motion } from 'motion/react';

const ProjectCard = ({ project, preview }) => {

    const contentVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <div className={`${styles['project-card']} ${preview ? styles[preview] : ''}`}>

            <div className={styles['card-img']}>
                <img src={project.image_url} alt={`Project: ${project.title}`} />
            </div>

            <motion.div
                variants={contentVariants}
                initial="hidden"
                animate={preview === 'current' ? "visible" : "hidden"}
                transition={{ duration: 0.5 }}
            >
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
            </motion.div>
        </div>
    )
}

export default ProjectCard;