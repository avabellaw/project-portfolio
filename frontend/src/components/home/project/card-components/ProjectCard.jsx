import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ProjectCard.module.css';
import ImageLoadingIcon from "react-spinners/BeatLoader";

const ProjectCard = ({ project, preview, filterProjectsBySkill, skillFilter }) => { 

    const isImageUrlSet = useRef(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const onSkillTagClick = (skill) => {
        // If skill already filtered, remove filter
        if (skillFilter && skillFilter.value === skill.id) {
            filterProjectsBySkill(null);
            return;
        }
        filterProjectsBySkill(skill);
    }

    const setImageUrl = useCallback(() => {
        let imgEl = document.getElementById(`${project.id}-img`)

        imgEl.onload = function () {
            setIsImageLoaded(true);
        }
        // Uses the preloaded or prefetched image url
        imgEl.src = project.image_url;

        // Stops image url being reset everytime user scrolls
        isImageUrlSet.current = true;
    }, [isImageUrlSet, project]);

    useEffect(() => {
        // Load the current and next image as user scrolls until all are loaded.
        // Includes the previous incase user navigates using the nav.
        let cardsInView = ['prev', 'current', 'next']
        if (!isImageUrlSet.current && (cardsInView.includes(preview))){
            setImageUrl();
        }
    }, [setImageUrl, preview])

    return (
        <div className={`${styles['project-card']} ${preview ? styles[preview] : ''}`}>

            <div className={styles['card-img']}>
                <img width={300} height={300} id={`${project.id}-img`} aria-label={`Project: ${project.title}`} /> 
                <ImageLoadingIcon className={styles['loading-spinner']} size={13} aria-label="Loading Spinner" data-testid="loader" loading={!isImageLoaded}/>
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