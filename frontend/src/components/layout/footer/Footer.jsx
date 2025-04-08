import styles from './Footer.module.css'

import { ReactComponent as GitHubLogo} from "./github-logo.svg"

const Footer = () => (
    <footer id={styles['footer']}>
        <a href="https://github.com/avabellaw/project-portfolio" target='_blank' rel="noreferrer"><GitHubLogo className={styles['github-logo']}/>View GitHub repo</a>
    </footer>
);

export default Footer