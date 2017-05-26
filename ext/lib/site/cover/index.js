/**
 * Cover Component for Rosario Participa Homepages
 * Usage Example:

import Cover from '../cover'

export default () => (
  <Cover
    background='/ext/lib/site/boot/bg-home-forum.jpg'
    logo='/ext/lib/site/home-multiforum/consultas-icono.png'
    title='Consultas'
    description={<span>La Municipalidad quiere conocer tu opinión sobre<br />diferentes temáticas de nuestra Ciudad.</span>} />
)

 */

import React from 'react'
import classNames from 'classnames'

export default ({
  className,
  background,
  logo,
  title,
  description,
  children
}) => {
  return (
    <div
      className={classNames('ext-site-cover', className)}
      style={{ backgroundImage: `url('${background}')` }}>
      <div className='container'>
        <div
          className='ext-site-cover-isologo'
          style={{ backgroundImage: `url('${logo}')` }} />
        {(title || description) && (
          <div>
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
