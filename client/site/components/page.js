import React from 'react'
import { NextAuth } from 'next-auth/client'
import accepts from 'accepts'
const locales = ['en', 'es']

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : ''
    // let locale = 'en' // default
    // if (req) {
    //   locale = await accepts(req).language(locales)
    // }
    // console.log(locale)
    return {
      session: await NextAuth.init({ req }),
      settings: await (await fetch(baseUrl + '/api/v1.0/settings')).json(),
      // locale: locale
    }
  }
}
