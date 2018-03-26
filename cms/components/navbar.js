import React from 'react'
import { connect } from 'react-redux'
import { MenuItemLink, getResources } from 'admin-on-rest'
import { t } from '../../client/i18n'

const Navbar = ({ resources, onMenuTap, logout }) => (
  <nav>
    <MenuItemLink to='/' primaryText={t('admin/home')} onClick={onMenuTap} />
    <MenuItemLink to='/settings' primaryText={t('admin/settings')} onClick={onMenuTap} />
    <MenuItemLink to='/posts' primaryText={t('admin/posts')} onClick={onMenuTap} />
    <MenuItemLink to='/reaction-rule' primaryText={t('admin/reaction-rules')} onClick={onMenuTap} />
    <MenuItemLink to='/reaction-instance' primaryText={t('admin/reaction-instances')} onClick={onMenuTap} />
    <MenuItemLink to='/users' primaryText={t('admin/users')} onClick={onMenuTap} />
  </nav>
)

const mapStateToProps = (state) => ({
  resources: getResources(state)
})
export default connect(mapStateToProps)(Navbar)
