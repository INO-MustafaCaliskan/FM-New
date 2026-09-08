// PanelLink.jsx
import Link from 'next/link'
import styles from './PanelLinks.module.css'

const PanelLink = ({ href, text, className = '', target }) => {
  return (
    <Link
      href={href}
      className={`${styles.link} ${className}`}
      target={target}
      rel={target ? 'noopener noreferrer' : undefined}
    >
      <span>{text}</span>
      <svg
        className={styles.chevron}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </Link>
  )
}

export default PanelLink