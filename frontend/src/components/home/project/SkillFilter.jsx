import { useEffect, useState } from 'react'
import Select from 'react-select'

import styles from './SkillFilter.module.css'
import './SkillFilter.css'

const Filter = ({ ALL_PROJECTS, setProjects }) => {
    const API_URL = process.env.REACT_APP_API_URL

    const [skills, setSkills] = useState();



    useEffect(() => {
        fetch(`${API_URL}/skills`)
            .then(res => res.json())
            .then(data => {
                let options = data.map((skill) => {
                    return { value: skill.id, label: skill.name }
                })

                setSkills(options)
            })
    }, [])


    const handleChange = (option, actionMeta) => {
        switch (actionMeta.action) {
            case 'select-option':
                const filteredProjects = ALL_PROJECTS.filter(project =>
                    project.skills.some(skill => skill.name === option.label)
                );
    
                if (filteredProjects.length === 0) {
                    // If no projects have the selected skill, show all projects
                    setProjects(ALL_PROJECTS);
                    return;
                }
    
                setProjects(filteredProjects);
                break;
            default:
                setProjects(ALL_PROJECTS);
        }
        console.log(actionMeta.action);
    };

    return (
        <div id={styles['skill-filter-container']}>
            <Select
                options={skills}
                onChange={handleChange}
                placeholder="Filter by skill"
                classNamePrefix="skills-filter"
                isClearable={true}
            />
        </div>
    )
}

export default Filter