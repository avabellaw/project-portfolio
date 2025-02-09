import styles from './ProjectNav.module.css'

const Nav = ({ setIndex, currentIndex, projectCount }) => {
    return (
        <nav id={styles['nav-container']}>
            {[...Array(projectCount)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={styles['project-nav-button']}
                    aria-label={`View project ${i + 1}`}
                    aria-current={currentIndex === i ? 'true' : 'false'}
                >
                    
                </button>
            ))}
        </nav>
    )
}

export default Nav