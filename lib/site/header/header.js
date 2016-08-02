import Header from './component'
import React from 'react'
import {render} from 'react-dom'
import config from '../../config/config'

render(
  <Header
    headerFontColor={config.headerFontColor || '#fff'}
    homeLink={config.homeLink || '/'}
    logo={config.logo}
    logoMobile={config.logoMobile}
    organizationUrl={config.organizationUrl}
    organizationName={config.organizationName} />,
  document.querySelector('header.app-header')
)
