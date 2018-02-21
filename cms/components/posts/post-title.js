import React from 'react'

export const PostTitle = ({ record }) => (
  <span>Post {record ? `"${record.title}"` : ''}</span>
)
