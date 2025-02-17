import { useState, useEffect, useCallback } from "react";

import { motion } from "motion/react";

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import useProjectViewControls from "./utilities/useProjectViewControls";

import styles from "./ProjectView.module.css";

const ProjectView = ({ projects, setProjects }) => {
    // Get the controls for the project view from utilities/ProjectViewControls
    const {viewControls, filterProjectsBySkill, skillFilter, scrollY} = useProjectViewControls(projects, setProjects);

    // Determine whether screen is under 768px
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const handleResize = useCallback(() => {
        // Set the isMobile state based on the window width
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        // Event listener for resizing the window
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    const springConfig = {
        type: "spring",
        stiffness: 200, // Lower value for smoother motion
        damping: 30,    // Balanced damping for smooth settling
        mass: 1        // Add mass for more natural physics
    };

    return (
        <div id={styles["project-view"]}>
            <Filter selectedValue={skillFilter} filterProjectsBySkill={filterProjectsBySkill} />
            <ProjectNav viewControls={viewControls} projects={projects} />

            <div id={styles["project-card-container"]}>

                {/* If mobile, only render one project card */}
                {isMobile ? (
                        <ProjectCard project={projects[scrollY]}
                        preview="current"
                        filterProjectsBySkill={filterProjectsBySkill} />
                ) :
                    // Else render all project cards, hides the ones not in view in css
                    (
                        projects.map((project, i) => (
                            <motion.div
                                key={project.id}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                }}
                                animate={{
                                    y: !isMobile && `${(i - scrollY) * 120}%`,
                                    transition: springConfig,
                                }}
                                transition={{ duration: 1 }}
                            >
                                <ProjectCard
                                    project={project}
                                    preview={i !== scrollY ? i === scrollY + 1 ? 'next' : 'prev' : 'current'}
                                    filterProjectsBySkill={filterProjectsBySkill}
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