import { useEffect } from 'react'

import styles from './SkillFilter.module.css'

const Filter = ({ ALL_PROJECTS, setProjects }) => {
    const API_URL = process.env.REACT_APP_API_URL

    useEffect(() => {
        fetch(`${API_URL}/skills`)
            .then(res => res.json())
            .then(data => {
                const datalist = document.getElementById('skills')
                data.forEach(skill => {
                    const option = document.createElement('option')
                    option.value = skill.name
                    option.dataset.id = skill.id
                    datalist.appendChild(option)
                })
            })
    }, [])


    const handleChange = (event) => {
        const skillFilter = document.getElementById(styles['skill-filter']);
        skillFilter.classList.remove(styles['no-projects']);
        const selectedSkill = event.target.value;
        if (selectedSkill === '') {
            // If no skill is selected, show all projects
            setProjects(ALL_PROJECTS);
        } else {
            const filteredProjects = ALL_PROJECTS.filter(project =>
                project.skills.some(skill => skill.name === selectedSkill)
            );

            if (filteredProjects.length === 0) {
                // If no projects have the selected skill, show all projects
                skillFilter.classList.add(styles['no-projects']);
                setProjects(ALL_PROJECTS);
                return;
            }

            setProjects(filteredProjects);
        }
    };

    return (
        <div>
            <input list="skills" id={styles['skill-filter']} name="skill-filter"
                onChange={handleChange} />
            <datalist id="skills"></datalist>
        </div>
    )
}

export default Filter