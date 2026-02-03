import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function PublicProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get(`user/${id}/`).then((res) => setProfile(res.data));
    api.get(`user/${id}/posts/`).then((res) => setPosts(res.data));
  }, [id]);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-grid">
        
        {/* PROFILE CARD */}
        <div className="profile-card">
          <img
            src={
              profile.profile_pic
                ? `http://127.0.0.1:8000${profile.profile_pic}`
                : "/default_user.png"
            }
            className="profile-pic"
            alt="profile"
          />
          <h3>{profile.full_name}</h3>
          <p>College: {profile.college}</p>
          <p>DOB: {profile.dob}</p>
        </div>

        {/* POSTS */}
        <div className="right-column">
          

          {posts.length === 0 && <p>No posts yet</p>}

          {posts.map((post) => (
            <div className="post-card" key={post.id}>
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
              </div>

              {post.description && (
                <p className="post-text">{post.description}</p>
              )}

              {post.image_url && (
                <img src={post.image_url} alt="post" className="post-image" />
              )}

              {/* Read-only reactions */}
              <div className="post-footer">
                👍Like {post.likes} &nbsp;&nbsp; 👎Dislike {post.dislikes}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default PublicProfile;
