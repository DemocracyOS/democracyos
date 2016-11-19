import React from 'react'
import config from 'lib/config'

/**
 * Share Utility Functions
 */

/**
 * Opens a facebook share popup modal
 * Available Params:
 *   https://developers.facebook.com/docs/sharing/reference/feed-dialog
 *
 * e.g.:

import {sharerFacebook} from 'ext/lib/site/sharer'
sharerFacebook({
  picture: 'https://sarasa.com/image.jpg',
  link: 'https://google.com'
})

*/
export function sharerFacebook (params) {
  if (!config.ext.facebookClientID) {
    throw new Error('Facebook app configuration missing.')
  }

  params = Object.assign({
    app_id: config.ext.facebookClientID,
    display: 'popup'
  }, params)

  const attrs = []

  Object.keys(params).forEach((k) => {
    if (params[k]) attrs.push(`${k}=${encodeURIComponent(params[k])}`)
  })

  const url = `https://www.facebook.com/dialog/feed?${attrs.join('&')}`

  const w = window.innerWidth > 626 ? 626 : window.innerWidth
  const h = window.innerHeight > 436 ? 436 : window.innerHeight

  const l = (window.outerWidth / 2) - (w / 2)
  const t = (window.outerHeight / 2) - (h / 2)

  const coords = `width=${w},height=${h},left=${l},top=${t}`

  window.open(url, 'facebook share', coords)
}

/**
 * Component with FB logo
 * e.g.:

import {SharerFacebook} from 'ext/lib/site/sharer'
<SharerFacebook
  params={{
    picture: 'https://sarasa.com/image.jpg',
    link: 'https://google.com'
  }} />
*/
export function SharerFacebook (args) {
  if (!config.ext.facebookClientID) return null

  const params = args.params
  const props = Object.assign({}, args)

  if (props.params) delete props.params

  props.className = `sharer sharer-facebook ${props.className || ''}`
  props.style = Object.assign({
    cursor: 'pointer'
  }, props.style)

  return (
    <span {...props} onClick={sharerFacebook.bind(null, params)}>
      <i className='icon-social-facebook' />
    </span>
  )
}
