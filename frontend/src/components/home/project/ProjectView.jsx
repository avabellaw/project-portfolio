import {useEffect, useCallback, useState} from 'react';
import { motion } from "motion/react";
import { useSwipeable } from 'react-swipeable';

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import useProjectViewControls from "./utilities/useProjectViewControls";
import useViewportSize from "./utilities/useViewportSize";

import styles from "./ProjectView.module.css";

const ProjectView = ({ projects, setProjects }) => {
    // Get the controls for the project view from utilities/ProjectViewControls
    const { viewControls, filterProjectsBySkill, skillFilter, scrollY } = useProjectViewControls(projects, setProjects);

    const { isMobile } = useViewportSize();

    const handleTouchscreenSwipe = useSwipeable({
        onSwipedLeft: viewControls.nextProject,
        onSwipedRight: viewControls.prevProject,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const projectCardContainer = document.getElementById(styles['project-card-container']);

    const [scrollTimeout, setScrollTimeout] = useState(null);
    const [disableScroll, setDisableScroll] = useState(false);

    const handleScroll = useCallback((event) => {
        console.log("scroll");
        
    }, [viewControls, disableScroll, setDisableScroll]);

    useEffect(() => {
        projectCardContainer.addEventListener('scroll', handleScroll);
        return () => {
            projectCardContainer.removeEventListener('scroll', handleScroll)
            clearTimeout(scrollTimeout);
        };
    }, [handleScroll, scrollTimeout]);


    return (
        <div id={styles["project-view"]}>
            <Filter selectedValue={skillFilter} filterProjectsBySkill={filterProjectsBySkill} />
            <ProjectNav viewControls={viewControls} projects={projects} />

            <div {...handleTouchscreenSwipe} id={styles["project-card-container"]}>

                {/* If mobile, only render one project card */}
                {isMobile ? (
                    <ProjectCard project={projects[scrollY]}
                        preview="current"
                        filterProjectsBySkill={filterProjectsBySkill}
                        skillFilter={skillFilter}
                    />
                ) :
                    // Else render all project cards, hides the ones not in view in css
                    (
                        projects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                style={{
                                    // position: 'absolute',
                                    width: '100%',
                                }}
                                animate={{
                                    // y: !isMobile && `${(i - scrollY) * 115}%`,
                                }}
                                transition={{
                                    damping: 30,
                                    stiffness: 200,
                                }}
                            >
                                <ProjectCard
                                    project={project}
                                    preview={i !== scrollY ? i === scrollY + 1 ? 'next' : 'prev' : 'current'}
                                    filterProjectsBySkill={filterProjectsBySkill}
                                    skillFilter={skillFilter}
                                />
                            </motion.div>
                        ))
                    )
                }

            </div>
        </div>
    )
}

export default ProjectView;