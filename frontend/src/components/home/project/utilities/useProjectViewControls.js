import { useState, useEffect, useContext, useMemo } from 'react';

import rfdc from 'rfdc';

import { ColourSchemeContext } from "../../../layout/ColourSchemeContext";

export default function useProjectViewControls(projects, setProjects) {
    const [skillFilter, setSkillFilter] = useState(null);
    const { setColours } = useContext(ColourSchemeContext);
    const [index, setIndex] = useState(0);

    

    useEffect(() => {
        if (projects.length === 0 || index > projects.length-1) return;
        // Set the colours scheme using context API
        setColours(projects[index].colour_scheme);
    }, [index, projects, setColours]);

    const viewControls = useMemo(() => ({
        setIndex: (i) => {
            setIndex(i);
        },
        getIndex: () => {
            return index;
        }
    }), [index]);

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