import { useState, useEffect, useContext, useCallback, useMemo, use } from "react";

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import styles from "./ProjectView.module.css";
import { ColourSchemeContext } from "../../layout/ColourSchemeContext";

import rfdc from 'rfdc';

import { motion } from "motion/react";

const ProjectView = ({ projects, setProjects }) => {
    const { setColours } = useContext(ColourSchemeContext);

    const [scrollY, setScrollY] = useState(0);

    const viewControls = useMemo(() => ({
        nextProject: () => {
            setScrollY((prevScroll) => Math.min(prevScroll + 1, projects.length - 1));
        },
        prevProject: () => {
            setScrollY((prevScroll) => Math.max(prevScroll - 1, 0));
        },
        setIndex: (i) => {
            setScrollY(i);
        },
        getIndex: () => {
            return scrollY;
        }
    }), [projects.length, setScrollY, scrollY]);

    const [ALL_PROJECTS] = useState(() => {
        // Clone the projects array for filtering
        const clone = rfdc();
        return clone(projects);
    }, []);

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

    useEffect(() => {
        // Reset the scroll position when projects change
        setScrollY(0);
    }, [projects]);

    useEffect(() => {
        if (projects.length === 0 || scrollY > projects.length-1) return;
        // Set the colours scheme using context API
        setColours(projects[scrollY].colour_scheme);
    }, [scrollY, projects, setColours]);

    const springConfig = {
        type: "spring",
        stiffness: 200, // Lower value for smoother motion
        damping: 30,    // Balanced damping for smooth settling
        mass: 1        // Add mass for more natural physics
    };

    return (
        <div id={styles["project-view"]}>
            <Filter setProjects={setProjects} ALL_PROJECTS={ALL_PROJECTS} />
            <ProjectNav viewControls={viewControls} projects={projects} />

            <div id={styles["project-card-container"]}>

                {/* If mobile, only render one project card */}
                {isMobile ? (
                        <ProjectCard project={projects[scrollY]} preview="current" />
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