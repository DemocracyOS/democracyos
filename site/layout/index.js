import React from 'react'

export default class Layout extends React.Component {
  title () {
    if (this.props.locals.title) {
      return this.props.locals.title + ' - DemocracyOS'
    } else {
      return 'DemocracyOS'
    }
  }

  render () {
    return (
      <html>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
          <title>{this.title()}</title>
          <link rel='stylesheet' type='text/css' href='/stylesheets/style.css' />
        </head>
        <body>
          <div id='content' dangerouslySetInnerHTML={{__html: this.props.body}} />
          <script type='application/json' dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.locals)}} />
          <script src='https://cdnjs.cloudflare.com/ajax/libs/react/0.14.5/react.js' />
          <script src='https://cdnjs.cloudflare.com/ajax/libs/react/0.14.5/react-dom.js' />
          <script src='/javascripts/bundle.js' />
        </body>
      </html>
    )
  }
}

Layout.propTypes = {
  body: React.PropTypes.string,
  locals: React.PropTypes.shape({
    title: React.PropTypes.string
  })
}
