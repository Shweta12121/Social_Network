import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [editingDob, setEditingDob] = useState(false);
  const [dob, setDob] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("profile/").then((res) => {
      setProfile(res.data);
      setDob(res.data.dob);
    });
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("profile_pic", file);

    const res = await api.patch("profile/", data);
    setProfile(res.data);
  };

  const saveDob = async () => {
    const res = await api.patch("profile/", { dob });
    setProfile(res.data);
    setEditingDob(false);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <div className="dashboard-grid">

        <div className="profile-card">
          <div className="profile-pic-wrapper">
            <img
              src={
                profile.profile_pic
                  ? `http://127.0.0.1:8000${profile.profile_pic}`
                  : "/default_user.png"
              }
              alt="profile"
              className="profile-pic"
            />

            <span
              className="edit-icon"
              onClick={() => fileInputRef.current.click()}
            >
              ✎
            </span>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </div>

          <h3 className="profile-name">{profile.full_name}</h3>
          <p className="profile-email">{profile.email}</p>
          <p className="profile-college"> College: {profile.college}</p>


          <p className="profile-dob">
            DOB:&nbsp;
            {editingDob ? (
              <>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <button onClick={saveDob}>✔</button>
              </>
            ) : (
              <>
                <span>{profile.dob}</span>
                <span
                  className="edit-icon-inline"
                  onClick={() => setEditingDob(true)}
                >
                  ✎
                </span>
              </>
            )}
          </p>

          <button className="share-btn">Share Profile</button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="right-column">
          <Post profilePic={profile.profile_pic} />
        </div>

      </div>
    </div>
  );
}

export default Profile;
