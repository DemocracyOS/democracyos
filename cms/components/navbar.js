import React from 'react'
import { connect } from 'react-redux'
import { MenuItemLink, getResources } from 'admin-on-rest'

const Navbar = ({ resources, onMenuTap, logout }) => (
  <nav>
    <MenuItemLink to='/' primaryText='Home' onClick={onMenuTap} />
    <MenuItemLink to='/settings' primaryText='Settings' onClick={onMenuTap} />
    <MenuItemLink to='/posts' primaryText='Posts' onClick={onMenuTap} />
    <MenuItemLink to='/reaction-rule' primaryText='Reaction Rules' onClick={onMenuTap} />
    <MenuItemLink to='/reaction-instance' primaryText='Reaction Instances' onClick={onMenuTap} />
    <MenuItemLink to='/users' primaryText='Users' onClick={onMenuTap} />
  </nav>
)

const mapStateToProps = (state) => ({
  resources: getResources(state)
})
export default connect(mapStateToProps)(Navbar)
