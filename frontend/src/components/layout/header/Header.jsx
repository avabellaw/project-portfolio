import styles from './Header.module.css'
import { Link } from 'react-router-dom'

import { motion } from 'motion/react'

const Header = () => {
    return (
        <Link to="/" id={styles['header-link']}>
            <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20
                }}>
                <div id={styles['header-container']}>
                    <span id={styles['name']}>Ava Williams</span>
                    <span id={styles['secondary']}>Portfolio projects</span>
                </div>
            </motion.div>
        </Link>
    )
}

export default Header