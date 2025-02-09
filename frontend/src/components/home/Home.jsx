import Filter from './SkillFilter';
import ProjectView from './project/ProjectView';

function Home(){
    return (
        <>
            <Filter />
            <ProjectView projects={[{title:'Placeholder title', live_url:'http://www.google.com', github:'www.google.com'}, {title:'title 2'}]}/>
        </>
    )
}

export default Home;