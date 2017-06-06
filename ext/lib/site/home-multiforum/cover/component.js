import React from 'react'
import { Link } from 'react-router'
import videos from './videos.json'

const video = videos[Math.floor(Math.random() * videos.length)]

export default ({ userLoaded, toSteps, toInfo }) => (
  <div className='ext-home-cover' style={{
    backgroundImage: `url("${video.image}")`
  }}>
    {window.innerWidth >= 768 && (
      <div className='banner'>
        <div className='video'>
          <video
            playsInline
            autoPlay
            muted
            loop
            poster={video.image}
            id='bgvid'>
            <source src={video.video} type='video/mp4' />
          </video>
        </div>
      </div>
    )}
    <div className='container'>
      <h1>Queremos que seas parte de las decisiones</h1>
      <h2>Las opiniones y las acciones colectivas<br />mejoran la ciudad.</h2>
      <button onClick={userLoaded ? toInfo : toSteps} className='btn btn-primary btn-lg'>
        Participá
      </button>
      <div className='follow-arrow'>
        <span onClick={toSteps} className='icon-arrow-down' />
      </div>
    </div>
  </div>
)
