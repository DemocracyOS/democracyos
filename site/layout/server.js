import React from 'react'
import Header from '../header'
import title from './title'

const Layout = (props) => {
  return (
    <html>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
        <title>{title(props.title)}</title>
        {/* <link rel='stylesheet' type='text/css' href='/stylesheets/style.css' /> */}
      </head>
      <body>
        <Header />
        <div id='content'>
          <props.content {...props.contentProps} />
        </div>
        <script
          type='application/json'
          data-content-props
          dangerouslySetInnerHTML={{__html: JSON.stringify(props.contentProps)}}
        />
      </body>
    </html>
  )
}

Layout.propTypes = {
  title: React.PropTypes.string,
  content: React.PropTypes.oneOfType([
    React.PropTypes.func,
    React.PropTypes.instanceOf(React.Component)
  ]),
  contentProps: React.PropTypes.object
}

export default Layout
