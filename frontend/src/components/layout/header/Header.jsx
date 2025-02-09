import styles from './Header.module.css'
import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <Link to="/">
            <div id={styles['header-container']}>
                <span id={styles['name']}>Ava Williams</span>
                <span id={styles['secondary']}>Portfolio projects</span>
            </div>
        </Link>
    )
}

export default Header