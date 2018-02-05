import React from 'react'
import dynamic from 'next/dynamic'
const DynamicAdmin = dynamic(import('../../cms/components/Admin'))

export default () => (
  < DynamicAdmin />
)