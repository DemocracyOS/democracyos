import React, {Component} from 'react'
import Markdown from 'react-remarkable'
import t from 't-component'

export default class MarkdownGuide extends Component {
  render () {
    return (
      <div className='article-container'>
        <div className='article-content'>
          <h3>{t('democracyos.markdown.flavored')}</h3>
          <p>{t('markdown.text.1')}</p>
          <section>
            <h4>{t('markdown.title.emphasis')}</h4>
            <div className='example-code'>
              <Markdown>
                ```\n
                {t('markdown.emphasis.example.1') + '\n\n'}
                {t('markdown.emphasis.example.2') + '\n\n'}
                {t('markdown.emphasis.example.3')}
                \n```
              </Markdown>
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
            <p>{t('markdown.url-autolinking.text')}</p>
            <div className='example-code'>
              <Markdown>
                ```\n
                {t('markdown.url-autolinking.example')}
                \n```
              </Markdown>
            </div>
            <div className='example'>
              <p>
                <strong>{t('markdown.will.become')}</strong>
                <Markdown source={t('markdown.url-autolinking.example')} />
              </p>
            </div>
            <p>{t('markdown.url-autolinking.text.2')}</p>
            <p>{t('markdown.url-autolinking.text.3')}</p>
            <div className='example-code'>
              <Markdown>
                ```\n
                {t('markdown.url-autolinking.example2')}
                \n```
              </Markdown>
            </div>
            <div className='example'>
              <p>
                <strong>{t('markdown.will.become')}</strong>
                <Markdown source={t('markdown.url-autolinking.example2')} />
              </p>
            </div>
          </section>
          <section>
            <h4>{t('markdown.linebreaks.title')}</h4>
            <p>{t('markdown.linebreaks.text')}</p>
            <div className='example-code'>
              <Markdown>
                ```\n
                {t('markdown.linebreaks.example.1') + '\n\n'}
                {t('markdown.linebreaks.example.2') + '\n\n'}
                {t('markdown.linebreaks.example.3')}
                {t('markdown.linebreaks.example.4')}
                \n```
              </Markdown>
            </div>
            <div className='example'>
              <p>
                <strong>{t('markdown.will.become')}</strong>
                <Markdown>
                  {t('markdown.linebreaks.example.1') + '\n\n'}
                  {t('markdown.linebreaks.example.2') + '\n\n'}
                  {t('markdown.linebreaks.example.3')}
                  {t('markdown.linebreaks.example.4')}
                </Markdown>
              </p>
            </div>
          </section>
          <section>
            <h4>{t('markdown.playground.title')}</h4>
            <textarea
              id='playground'
              className='playground'
              placeholder={t('markdown.playground.text')}>
            </textarea>
            <p>
              <strong>{t('markdown.playground.result')}</strong>
            </p>
            <div className='result'>
              t('markdown.playground.text')
            </div>
          </section>
        </div>
      </div>
    )
  }
}
