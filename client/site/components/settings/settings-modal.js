import React from 'react'
import Link from 'next/link'

export default () => (
  <div className='overlay'>
    <div className='settings-modal text-center'>
      <h5>Settings successfully saved.</h5>
      <p>Now, you can start creating content and using your platform.✨</p>
      <Link href='/admin'>
        <button className='btn btn-primary'>
          Continue
        </button>
      </Link>
    </div>
    <style jsx>{`
      .overlay {
        position: fixed; 
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%; 
        height: 100%; 
        top: 0; 
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 2;
      }
      .settings-modal {
        width: 400px;
        height: 200px;
        padding: 35px 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }
    `}</style>
  </div>
)
