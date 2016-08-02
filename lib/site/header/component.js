import React, {Component} from 'react'
import t from 't-component'

export default class Header extends Component {
  render () {
    return (
      <div id='header-container'>
        <a href='#' id='toggleButton'>
          <span className='bar-icon' style={{backgroundColor: this.props.headerFontColor}}></span>
          <span className='bar-icon' style={{backgroundColor: this.props.headerFontColor}}></span>
          <span className='bar-icon' style={{backgroundColor: this.props.headerFontColor}}></span>
        </a>
        <h1 id='logo'>
          <a href={this.props.homeLink}>
            <img src={this.props.logo} className='logo-image' />
            <img src={this.props.logoMobile} className='logo-image visible-xs-inline-block' />
          </a>
        </h1>
        <div className='user-nav btn-group'>
          <div className='user' style={{color:this.props.headerFontColor}}>
            <a href='/signin' className='login pull-right anonymous-user'>
              <i className='icon-signin'></i>
              <span>{t('header.signin')}</span>
            </a>
            <a href='/signup' className='login pull-right anonymous-user'>
              <i className='icon-user'></i>
              <span>{t('header.signup')}</span>
            </a>
            <a href={this.props.organizationUrl} className='login pull-left' target='_blank'>
              <span>{this.props.organizationName}</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
