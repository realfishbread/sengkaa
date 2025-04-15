import React, { useState } from "react";
import TweetPostBox from "./Post";

const Board = () => {
  const [posts, setPosts] = useState([]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div>
      <TweetPostBox onSubmitPost={handleNewPost} />
      {posts.map((post, idx) => (
        <div key={idx} style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
          <p>{post.text}</p>
          {post.image && <img src={post.image} alt="post" style={{ width: "100%", borderRadius: 8 }} />}
        </div>
      ))}
    </div>
  );
};

export default Board;
