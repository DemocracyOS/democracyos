import React from 'react'
import Head from 'next/head'

export default (props) => (
  <Head>
    <meta name='viewport' content='width=device-width, initial-scale=1'/>
    <title>{props.settings && props.settings.communityName ? props.settings.communityName : 'DemocracyOS'}</title>
    <script src='https://cdn.polyfill.io/v2/polyfill.min.js'/>
    <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css' integrity='sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm' crossOrigin='anonymous'/>
    <link rel='stylesheet' href='/static/global.css' />
  </Head>
)
