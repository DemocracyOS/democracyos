import React from 'react'
import Head from '../client/site/components/head'

export default class extends React.Component {
  render () {
    return (
      <div className='container'>
        <Head />
        <div className='limbo-container'>
          <h1>Oops, there is no content available right now!</h1>
          <img src='/static/assets/unicorn.png' alt='Unicorn typing' className='unicorn' />
          <p className='limbo-text'>Our unicorns are working a lot to make it available soon. <br /> Please, try again later. ✨</p>
        </div>
        <style jsx>{`
          .limbo-container {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            padding: 100px;
          }
          .limbo-container h1 {
            color: #00BCD4;
            text-align: center;
          }
          .unicorn {
            display: block;
            max-width: 410px;
            max-height: 273px;
          }
          .limbo-text{
            margin-top: 10px;
            font-size: 18px;
            text-align: center;
          }
          @media (max-width: 768px) {
            .limbo-container {
              padding: 40px;
            }
            .limbo-container h1 {
              font-size: 24px;
            }
            .limbo-text {
              font-size: 16px;
            }
          }
          @media (max-width: 425px) {
            .unicorn {
              max-width: 265px;
            }
          }
        `}</style>
      </div>
    )
  }
}
