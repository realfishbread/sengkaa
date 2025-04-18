import React, { useEffect, useState } from 'react';
import './CollabPost.css'; // 스타일링 따로 할 경우

function CollabPost({ category }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`https://eventcafe.site/news?category=${category}`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [category]);

  return (
    <div className="post-list">
      {posts.map(post => (
        <div className="post-card" key={post.id}>
          <div className="post-header">
            <img src={post.profileImage} alt="profile" className="profile-img" />
            <div>
              <div className="author">{post.author}</div>
              <div className="date">{new Date(post.created_at).toLocaleString()}</div>
            </div>
          </div>

          <h3 className="post-title">{post.title}</h3>
          <p className="post-content">{post.content.slice(0, 100)}...</p>

          <img src={post.imageUrl} alt="thumbnail" className="thumbnail" />

          <div className="post-footer">
            ❤️ {post.likes} 💬 {post.comments}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CollabPost;
