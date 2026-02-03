import React, { useEffect, useState } from "react";
import api from "../api/axios";
import likeIcon from "../assets/icons/like.png";
import dislikeIcon from "../assets/icons/dislike.png";

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

  // comments (NEW but isolated)
  const [openComments, setOpenComments] = useState({});
  const [newComments, setNewComments] = useState({});

  const loadPosts = () => {
    api.get("posts/").then((res) => setPosts(res.data));
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const toggleReaction = async (postId, type) => {
    await api.post(`posts/${postId}/${type}/`);
    loadPosts();
  };

  const addPost = async () => {
    setError("");

    if (!description && !image) {
      setError("Post cannot be empty");
      return;
    }

    const data = new FormData();
    if (image) data.append("image", image);
    if (description) data.append("description", description);

    await api.post("posts/", data);
    setDescription("");
    setImage(null);
    loadPosts();
  };

  // COMMENTS
  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const addComment = async (postId) => {
    const text = newComments[postId] ?? "";
    if (!text || !text.trim()) return;

    await api.post(
      `posts/${postId}/comments/`,
      JSON.stringify({ text: text.trim() }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setNewComments((prev) => ({ ...prev, [postId]: "" }));
    loadPosts();
  };

  return (
    <>
      {/* ADD POST */}
      <div className="add-post-card">
        <div className="add-post-header">
          <h3>Add Post</h3>
        </div>

        {/* PREVIEW (RESTORED) */}
        <div className="add-post-preview">
          {description && <p>{description}</p>}

          {image && (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img src={URL.createObjectURL(image)} alt="preview" />
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
            {/* HEADER */}
            <div className="post-header">
              <div style={{ display: "flex", gap: "10px" }}>
                <img
                  src={post.author_profile_pic || "/default_user.png"}
                  className="post-user-pic"
                  alt="user"
                />
                <div>
                  <div className="post-author">{post.author_name}</div>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    Posted on - {formatDate(post.created_at)}
                  </div>
                </div>
              </div>

              {post.is_owner && (
                <button
                  className="delete-btn"
                  onClick={() =>
                    api.delete(`posts/${post.id}/delete/`).then(loadPosts)
                  }
                >
                  ✖
                </button>
              )}
            </div>

            {/* CONTENT */}
            {post.description && (
              <p className="post-text">{post.description}</p>
            )}

            {post.image_url && (
              <img src={post.image_url} alt="post" className="post-image" />
            )}

            {/* FOOTER */}
            <div className="post-footer">
              <button onClick={() => toggleReaction(post.id, "like")} className="icon-btn">
                <img src={likeIcon} alt="like" />
                <span>{post.likes}</span>
              </button>

              <button onClick={() => toggleReaction(post.id, "dislike")} className="icon-btn">
                <img src={dislikeIcon} alt="dislike" />
                <span>{post.dislikes}</span>
              </button>

              <button onClick={() => toggleComments(post.id)}>
                💬 Comment ({post.comments_count})
              </button>
            </div>

            {/* COMMENTS */}
            {openComments[post.id] && (
              <div className="comments-section">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <strong>{comment.user_name}</strong>: {comment.text}

                    {comment.is_owner && (
                      <button
                        onClick={() =>
                          api
                            .delete(`comments/${comment.id}/delete/`)
                            .then(loadPosts)
                        }
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}

                <div className="add-comment">
                  <input
                    placeholder="Write a comment..."
                    value={newComments[post.id] || ""}
                    onChange={(e) =>
                      setNewComments((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <button onClick={() => addComment(post.id)}>Post</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Post;
