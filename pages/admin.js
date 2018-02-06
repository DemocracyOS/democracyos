import React from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
const Admin = dynamic(import('../cms/components/Admin'), {
  ssr: false
})

export default () => (
  <div>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <title>Democracy OS</title>
      <link rel='stylesheet' href='/static/global.css' />
    </Head>
    <Admin />
  </div>
)
