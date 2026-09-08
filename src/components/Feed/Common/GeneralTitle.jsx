import styles from './GeneralTitle.module.css'

const GeneralTitle = ({title, className, style, id}) => {
  return (
    <h5 className={`${styles.title} ${className || ''}`} style={style} id={id}>{title}</h5>
  )
}

export default GeneralTitle