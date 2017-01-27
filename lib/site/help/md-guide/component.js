import React, { Component } from 'react'
import Markdown from 'react-remarkable'
import t from 't-component'

export default class MarkdownGuide extends Component {
  constructor () {
    super()
    this.state = {
      playground: ''
    }
    this.updatePlayground = this.updatePlayground.bind(this)
  }

  updatePlayground (e) {
    this.setState({ playground: e.target.value })
  }

  render () {
    return (
      <div className='article-container'>
        <div className='article-content markdown-cheatsheet'>
          <h3>{t('democracyos.markdown.flavored')}</h3>
          <p>{t('markdown.text.1')}</p>
          <section>
            <h4>{t('markdown.title.emphasis')}</h4>
            <div className='example-code'>
              <pre>
                <code>
                  {t('markdown.emphasis.example.1')}<br />
                  {t('markdown.emphasis.example.2')}<br />
                  {t('markdown.emphasis.example.3')}
                </code>
              </pre>
            </div>
            <div className='example'>
              <p>
                <strong>{t('markdown.will.become')}</strong>
              </p>
              <Markdown source={t('markdown.emphasis.example.1')} />
              <Markdown source={t('markdown.emphasis.example.2')} />
              <Markdown source={t('markdown.emphasis.example.3')} />
            </div>
          </section>
          <section>
            <h4>{t('markdown.url-autolinking.title')}</h4>
            <p>{t('markdown.url-autolinking.text.2')}</p>
            <p>{t('markdown.url-autolinking.text.3')}</p>
            <div className='example-code'>
              <pre>
                <code>
                  {t('markdown.url-autolinking.example2')}
                </code>
              </pre>
            </div>
            <div className='example'>
              <p>
                <strong>{t('markdown.will.become')}</strong>
              </p>
              <Markdown source={t('markdown.url-autolinking.example2')} />
            </div>
          </section>
          <section>
            <h4>{t('markdown.linebreaks.title')}</h4>
            <p>{t('markdown.linebreaks.text')}</p>
            <div className='example-code'>
              <pre>
                <code>
                  {t('markdown.linebreaks.example.1')}<br />
                  {t('markdown.linebreaks.example.2')}<br />
                  {t('markdown.linebreaks.example.3')}<br />
                  {t('markdown.linebreaks.example.4')}
                </code>
              </pre>
            </div>
            <div className='example'>
              <p>
                <strong>{t('markdown.will.become')}</strong>
              </p>
              <Markdown source={t('markdown.linebreaks.example.1')} />
              <Markdown source={t('markdown.linebreaks.example.2')} />
              <Markdown source={t('markdown.linebreaks.example.3')} />
              <Markdown source={t('markdown.linebreaks.example.4')} />
            </div>
          </section>
          <section>
            <h4>{t('markdown.playground.title')}</h4>
            <textarea
              id='playground'
              className='playground'
              placeholder={t('markdown.playground.text')}
              onChange={this.updatePlayground} />
            <p>
              <strong>{t('markdown.playground.result')}</strong>
            </p>
            <div className='result'>
              <Markdown source={this.state.playground} />
            </div>
          </section>
        </div>
      </div>
    )
  }
}

/*
    TODO: Using remarkable disable this action

    <p>{t('markdown.url-autolinking.text')}</p>
    <div className='example-code'>
      <pre>
        <code>
          {t('markdown.url-autolinking.example')}
        </code>
      </pre>
    </div>
    <div className='example'>
      <p>
        <strong>{t('markdown.will.become')}</strong>
        <Markdown source={t('markdown.url-autolinking.example')} />
      </p>
    </div>
*/
