import { useCallback, useEffect, useRef } from 'react';
import styles from './ProjectCard.module.css';

const ProjectCard = ({ project, preview, filterProjectsBySkill, skillFilter }) => { 

    const imageLoaded = useRef(false);

    const onSkillTagClick = (skill) => {
        // If skill already filtered, remove filter
        if (skillFilter && skillFilter.value === skill.id) {
            filterProjectsBySkill(null);
            return;
        }
        filterProjectsBySkill(skill);
    }

    const loadProjectImage = useCallback(() => {
        let imgEl = document.getElementById(`${project.id}-img`)
        // Uses the preloaded or prefetched image url
        imgEl.src = project.image_url;

        // Stops image url being reset everytime user scrolls
        imageLoaded.current = true;
    }, [imageLoaded, project]);

    useEffect(() => {
        // Project changed -> update image urls (will use cached versions)
        // Only update if there is a loaded image to update
        if(imageLoaded.current) {
            loadProjectImage();
        }
    }, [loadProjectImage, project])

    useEffect(() => {
        // Load the current and next image as user scrolls until all are loaded.
        if (!imageLoaded.current && (preview === 'current' || preview === 'next')){
            loadProjectImage();
        }
    }, [loadProjectImage, preview])

    return (
        <div className={`${styles['project-card']} ${preview ? styles[preview] : ''}`}>

            <div className={styles['card-img']}>
                <img id={`${project.id}-img`} alt={`Project: ${project.title}`} />
            </div>
            <div className={styles['card-content']}>

                <h2>{project.title}</h2>

                <p>{project.description}</p>

                <div className={styles['card-links']}>
                    {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">Live Project</a>}
                    <a href={project.github_url} target="_blank" rel="noreferrer">Github Repo</a>
                </div>

                <div className={styles['skill-tags']}>
                    {project.skills.map(skill => (
                        <span key={skill.id}
                            className={styles['skill']}
                            onClick={() => onSkillTagClick(skill)}
                            data-selected={skillFilter ? skillFilter.value === skill.id ? 'true' : 'false' : 'false'}
                        >
                            {skill.name}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectCard;