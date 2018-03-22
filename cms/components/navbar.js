import React from 'react'
import { t } from '../../client/i18n'
import { connect } from 'react-redux'
import { messageFormatter as t } from 'globalize'
import { MenuItemLink, getResources } from 'admin-on-rest'

const Navbar = ({ resources, onMenuTap, logout }) => (
  <nav>
    <MenuItemLink to='/' primaryText={t('admin/home')} onClick={onMenuTap} />
    <MenuItemLink to='/settings' primaryText={t('admin/settings')} onClick={onMenuTap} />
    <MenuItemLink to='/posts' primaryText={t('admin/posts')} onClick={onMenuTap} />
    <MenuItemLink to='/reaction-rule' primaryText={t('admin/reaction-rules')} onClick={onMenuTap} />
    <MenuItemLink to='/reaction-instance' primaryText={t('admin/reaction-instances')} onClick={onMenuTap} />
    <MenuItemLink to='/users' primaryText={t('admin/users')} onClick={onMenuTap} />
    {console.log(t('admin/home'))}
  </nav>
)

const mapStateToProps = (state) => ({
  resources: getResources(state)
})
export default connect(mapStateToProps)(Navbar)
