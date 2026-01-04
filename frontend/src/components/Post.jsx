import React, { useEffect, useState } from "react";
import api from "../api/axios";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


function Post({ profilePic }) {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const loadPosts = () => {
    api.get("posts/").then((res) => setPosts(res.data));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const addPost = async () => {
    setError("");

    if (!description && !image) {
      setError("Post cannot be empty");
      return;
    }

    const data = new FormData();

    if (image) data.append("image", image);
    if (description) data.append("description", description);

    try {
      await api.post("posts/", data);
      setDescription("");
      setImage(null);
      loadPosts();
    } catch (err) {
      setError("Failed to post. Please try again.");
    }
  };

  return (
    <>
      <div className="add-post-card">
        <div className="add-post-header">
          <h3>Add Post</h3>
        </div>

        <div className="add-post-preview">
          {description && <p>{description}</p>}

          {image && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
              />
              <button
                onClick={() => setImage(null)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
          )}
        </div>

        <textarea
          placeholder="Write something..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="post-actions">
          <button onClick={addPost}>Post</button>

          <label className="upload-btn">
            Add Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {/* POSTS FEED */}
      <div className="posts-feed">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={
                    profilePic
                      ? `http://127.0.0.1:8000${profilePic}`
                      : "/default_user.png"
                  }
                  className="post-user-pic"
                  alt="user"
                />
                <div>
                  <div className="post-author">You</div>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    Posted on - {formatDate(post.created_at)}
                  </div>
                </div>
              </div>

              <button
                className="delete-btn"
                onClick={() =>
                  api.delete(`posts/${post.id}/delete/`).then(loadPosts)
                }
              >
                ✖
              </button>
            </div>

            {post.description && (
              <p className="post-text">{post.description}</p>
            )}

            {post.image && (
              <img
                src={`http://127.0.0.1:8000${post.image}`}
                alt="post"
                className="post-image"
              />
            )}

            <div className="post-footer">
  <button
    onClick={() =>
      api.post(`posts/${post.id}/like/`).then(loadPosts)
    }
  >
    👍 {post.likes}
  </button>

  <button
    onClick={() =>
      api.post(`posts/${post.id}/dislike/`).then(loadPosts)
    }
  >
    👎 {post.dislikes}
  </button>
</div>

          </div>
        ))}
      </div>
    </>
  );
}

export default Post;
