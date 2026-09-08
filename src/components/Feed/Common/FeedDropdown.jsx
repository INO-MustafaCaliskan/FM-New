import { Dropdown } from 'react-bootstrap'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import styles from './FeedDropdown.module.css'

const FeedDropdown = ({items}) => {
  return (
    <Dropdown className={styles.feed_dropdown}>
        <Dropdown.Toggle variant="link" id="dropdown-basic">
            <BiDotsVerticalRounded size={20} color='var(--feed-main-text-color)' />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end" className={styles.dropdown_menu}>
            {items.map((item, index) => <Dropdown.Item key={index} eventKey={item.key} onClick={item.onClick}>{item.label}</Dropdown.Item>)}
        </Dropdown.Menu>
    </Dropdown>
  )
}

export default FeedDropdown