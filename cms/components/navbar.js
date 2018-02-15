import React from 'react'
import { connect } from 'react-redux'
import { MenuItemLink, getResources } from 'admin-on-rest'

const Navbar = ({ resources, onMenuTap, logout }) => (
  <nav>
    <MenuItemLink to='/admin' primaryText='Home' onClick={onMenuTap} />
    <MenuItemLink to='/admin/settings' primaryText='Settings' onClick={onMenuTap} />
    <MenuItemLink to='/admin/posts' primaryText='Posts' onClick={onMenuTap} />
    <MenuItemLink to='/admin/reaction-rule' primaryText='Reaction Rules' onClick={onMenuTap} />
    <MenuItemLink to='/admin/users' primaryText='Users' onClick={onMenuTap} />
  </nav>
)

const mapStateToProps = (state) => ({
  resources: getResources(state)
})
export default connect(mapStateToProps)(Navbar)
