import { useRef, useContext, useState } from 'react';
import { useScroll, useMotionValueEvent } from "motion/react";
import { useSwipeable } from 'react-swipeable';

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import useProjectViewControls from "./utilities/useProjectViewControls";
import { ViewportSizeContext } from '../../layout/ViewportSizeContext';

import styles from "./ProjectView.module.css";

const ProjectView = ({ projects }) => {
    const [skillFilter, setSkillFilter] = useState(null);

    /**
     * @param {*} filterBySkill - Optional, skill to filter by instead of using current filter.
     * @returns An array of projects filtered by skill.
     */
    const filteredProjects = (filterBySkill = skillFilter) => filterBySkill ? 
        projects.filter(
            (p) => p.skills.some((skill) => skill.id === filterBySkill.value)
        )
        : projects;
    
    const { isMobile } = useContext(ViewportSizeContext);

    // Get the controls for the project view from utilities/ProjectViewControls
    const { viewControls, filterProjectsBySkill, index } = useProjectViewControls(filteredProjects, skillFilter, setSkillFilter, isMobile);

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
        // If mobile, this handler is only called on load
        if (isMobile) {
            // Set the index of the project card for nav
            viewControls.setIndex(0);
            return;
        }

        // Calculate the index of the project card based on the scroll progress
        const one = 1 / (filteredProjects().length);

        const nextIndex = Math.min(Math.floor(progress / one), filteredProjects().length - 1);
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

    return (
        <div
            id={styles["project-view"]}
            {...(isMobile ? handleTouchscreenSwipe : {})}
        >
            <div id={styles['nav-filter-container']}>
                <Filter selectedValue={skillFilter} filterProjectsBySkill={filterProjectsBySkill} />
                <ProjectNav viewControls={viewControls} filteredProjects={filteredProjects()} />
            </div>

            <div
                ref={cardContainerRef}
                id={styles["project-card-container"]}>

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
                        filteredProjects().map((project, i) => (
                            <ProjectCard
                                key={i}
                                project={project}
                                filterProjectsBySkill={filterProjectsBySkill}
                                skillFilter={skillFilter}
                                preview={getProjectCardPosition(i)}
                            />
                        ))
                    )
                }

            </div>
        </div>
    )
}

export default ProjectView;