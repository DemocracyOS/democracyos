import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const Admin = dynamic(import('../cms/components/admin'), {
  ssr: false
})

export default () => (
  <div>
    <Head>
      <meta charset="utf-8" />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <title>Democracy OS</title>
      {// Adds css sheet for rich content editor library
      }
      <link rel='stylesheet' href='/static/draft.css' />
      <link rel='stylesheet' href='/static/global.css' />
    </Head>
    <Admin />
  </div>
)
