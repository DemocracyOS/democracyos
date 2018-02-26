export const PostCard = ({ post }) => (
  <div className='post-card'>
    <div className='post-card-body'>
      <h3>{post.title}</h3>
      <h4>{post.description}</h4>
    </div>
    <div className='post-card-footer'>
      <span>{post.openingDate}</span>
    </div>
    <style jsx>{`
      .post-card {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: space-between;
        margin: 16px 0;
        padding: 16px;
        border: 1px solid rgba(0,0,0,.1);
        height: 258px;
        width: 288px;
      }
      .post-card h3 {
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 2.4rem;
      }
      .post-card h4 {
        font-size: 1.0rem;
        color: rgba(0,0,0,.6);
        max-height: 60px;
        overflow: ellipsis;
      }
    `}</style>
  </div>
)
