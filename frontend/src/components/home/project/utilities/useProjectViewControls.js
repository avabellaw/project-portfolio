import { useState, useContext, useMemo, useCallback } from 'react';

import rfdc from 'rfdc';

import { ColourSchemeContext } from "../../../layout/ColourSchemeContext";

import styles from '../ProjectView.module.css';

export default function useProjectViewControls(projects, setProjects, isMobile) {
    const [skillFilter, setSkillFilter] = useState(null);
    const { setColours } = useContext(ColourSchemeContext);
    const [index, setIndex] = useState(0);
    const [autoScroll, setAutoScroll] = useState(false);
    const [targetIndex, setTargetIndex] = useState(0);

    const setProjectColourScheme = useCallback((project) => {
        setColours(project.colour_scheme);
    }, [setColours]);

    const viewControls = useMemo(() => ({
        nextProject: () => {
            if (index === projects.length - 1) {
                return;
            }
            setIndex((prevIndex) => prevIndex + 1);
            setProjectColourScheme(projects[index]);
        },
        prevProject: () => {
            if (index === 0) {
                return;
            }
            setIndex((prevIndex) => prevIndex - 1);
            setProjectColourScheme(projects[index]);
        },
        scrollToProject: (i) => {
            if (isMobile) {
                setIndex(i);
                setProjectColourScheme(projects[i]);
                return;
            }
            setTargetIndex(i);
            setAutoScroll(true);
            // Gets the project card container and sets the scroll position to the selected project card
            const cardContainer = document.getElementById(styles['project-card-container']);
            cardContainer.style.scrollSnapType = 'none';
            cardContainer.addEventListener('scrollend', () => {
                cardContainer.style.scrollSnapType = 'y mandatory';
            }, { once: true });

            const card = cardContainer.children[i];
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        setIndex: (i) => {
            setIndex(i);
            if (!autoScroll) {
                // Set the colour scheme of the project card based on the index
                setProjectColourScheme(projects[i]);
            } else {
                // If autoScroll reached target project index, set colour scheme
                if (i === targetIndex) {
                    setAutoScroll(false);
                    setProjectColourScheme(projects[targetIndex]);
                }
            }
        },
        getIndex: () => {
            return index;
        },
    }), [index, projects, setProjectColourScheme, autoScroll, setAutoScroll, targetIndex, setTargetIndex]);

    const [ALL_PROJECTS] = useState(() => {
        // Clone the projects array for filtering
        const clone = rfdc();
        return clone(projects);
    }, []);

    const filterProjectsBySkill = (skill) => {
        /**
         * Filters the projects based on the selected skill
         * @param {Object} skill - Skill object
         */

        if (!skill) {
            setSkillFilter(null);
            setProjects(ALL_PROJECTS);
            return
        }

        const filteredProjects = ALL_PROJECTS.filter(project =>
            project.skills.some(projectSkill => projectSkill.id === skill.id)
        );

        if (filteredProjects.length === 0) {
            // If no projects have the selected skill, show all projects
            setProjects(ALL_PROJECTS);
            setSkillFilter(null);
            return;
        }

        setSkillFilter({ value: skill.id, label: skill.name });
        setProjects(filteredProjects);
    }

    return { viewControls, filterProjectsBySkill, skillFilter, index };
};