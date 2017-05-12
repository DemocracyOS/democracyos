import React from 'react'
import t from 't-component'
import urlBuilder from 'lib/url-builder'

export default ({ topic, forum }) => {
  if (!topic.privileges.canEdit) return null

  return (
    <div className='topic-article-content topic-admin-actions'>
      {topic.privileges.canEdit && (
        <a
          href={urlBuilder.for('admin.topics.id', {
            forum: forum.name,
            id: topic.id
          })}
          className='btn btn-default btn-sm'>
          <i className='icon-pencil' />
          &nbsp;
          {t('proposal-article.edit')}
        </a>
      )}
    </div>
  )
}
