import { connect } from 'react-redux'
import { MenuItemLink, getResources } from 'admin-on-rest'

const Navbar = ({ resources, onMenuTap }) => (
  <nav>
    <MenuItemLink to="/settings" primaryText="Settings" onClick={onMenuTap} />
    <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuTap} />
    <MenuItemLink to="/reactions" primaryText="Reactions" onClick={onMenuTap} />
  </nav>
)

export default Navbar
