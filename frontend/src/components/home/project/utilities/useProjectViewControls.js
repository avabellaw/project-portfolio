import { useState, useEffect, useContext, useMemo } from 'react';

import rfdc from 'rfdc';

import { ColourSchemeContext } from "../../../layout/ColourSchemeContext";

export default function useProjectViewControls(projects, setProjects) {
    const [skillFilter, setSkillFilter] = useState(null); 
    const [scrollY, setScrollY] = useState(0);
    const { setColours } = useContext(ColourSchemeContext);

    useEffect(() => {
        // Reset the scroll position when projects change
        setScrollY(0);
    }, [projects]);

    useEffect(() => {
        if (projects.length === 0 || scrollY > projects.length-1) return;
        // Set the colours scheme using context API
        setColours(projects[scrollY].colour_scheme);
    }, [scrollY, projects, setColours]);

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

    return { viewControls, filterProjectsBySkill, skillFilter, scrollY };
};