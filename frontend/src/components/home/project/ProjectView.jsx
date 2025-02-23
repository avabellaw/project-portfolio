import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent, whileInView, AnimatePresence, view } from "motion/react";
import { useSwipeable } from 'react-swipeable';

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import useProjectViewControls from "./utilities/useProjectViewControls";
import useViewportSize from "./utilities/useViewportSize";

import styles from "./ProjectView.module.css";

const ProjectView = ({ projects, setProjects }) => {
    // Get the controls for the project view from utilities/ProjectViewControls
    const { viewControls, filterProjectsBySkill, skillFilter, index } = useProjectViewControls(projects, setProjects);

    const { isMobile } = useViewportSize();

    const handleTouchscreenSwipe = useSwipeable({
        onSwipedLeft: viewControls.nextProject,
        onSwipedRight: viewControls.prevProject,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    const cardContainerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        // Sets the scroll container to the card container
        container: cardContainerRef
    });

    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        // Calculate the index of the project card based on the scroll progress
        const one = 1 / (projects.length);

        const nextIndex = Math.floor(progress / one);
        // Set the index of the project card for nav
        viewControls.setIndex(nextIndex);
    });

    const getProjectCardPosition = (i) => {
        switch (i) {
            case index - 1:
                return 'prev';
            case index:
                return 'current';
            case index + 1:
                return 'next';
            default:
                return '';
        }
    }

    const cardVariants = {
        notInView: {
            opacity: 0.5,
        },
        inView: {
            opacity: 1,
        }
    }
    return (
        <div id={styles["project-view"]}>
            <Filter selectedValue={skillFilter} filterProjectsBySkill={filterProjectsBySkill} />
            <ProjectNav viewControls={viewControls} projects={projects} />

            <div ref={cardContainerRef} id={styles["project-card-container"]}>

                {/* If mobile, only render one project card */}
                {isMobile ? (
                    <ProjectCard project={projects[index]}
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
                                variants={cardVariants}
                                initial='notInView'
                                animate={index === i ? 'inView' : 'notInView'}
                                transition={{ duration: 0.5 }}
                            >
                                <ProjectCard
                                    project={project}
                                    filterProjectsBySkill={filterProjectsBySkill}
                                    skillFilter={skillFilter}
                                    preview={getProjectCardPosition(i)}
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