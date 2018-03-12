import React from 'react'
import { NextAuth } from 'next-auth-client'

export default class extends React.Component {
  static async getInitialProps ({ req }) {
    const res = await fetch('http://localhost:3000/api/v1.0/settings')
    const settings = await res.json()
    return {
      session: await NextAuth.init({ req }),
      settings: settings
    }
  }
}
