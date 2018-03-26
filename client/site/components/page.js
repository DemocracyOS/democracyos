import React from 'react'
import { NextAuth } from 'next-auth-client'
import accepts from 'accepts'
const locales = ['en', 'es']

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    const res = await fetch('http://localhost:3000/api/v1.0/settings')
    const settings = await res.json()
    return {
      session: await NextAuth.init({ req }),
      settings: settings,
      locale: await accepts(req).language(locales)
    }
  }
}
