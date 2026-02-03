import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import Post from "./Post";
import { useNavigate } from "react-router-dom";
import "../App.css";
import editIcon from "../assets/icons/edit.png";

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
    })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    window.location.href = "/login";
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
    const selectedDate = new Date(dob);
    const today = new Date();

    if (selectedDate >= today) {
      alert("Date of birth must be in the past");
      return;
    }

    const res = await api.patch("profile/", { dob });
    setProfile(res.data);
    setEditingDob(false);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/user/${profile.id}`;


    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.full_name}'s Profile`,
          text: `Check out ${profile.full_name}'s profile`,
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      alert("Unable to share profile");
    }
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
              <img src={editIcon} alt="edit" />
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
                  <img src={editIcon} alt="edit" />
                </span>
              </>
            )}
          </p>

          <button className="share-btn" onClick={handleShareProfile}>
            Share Profile
          </button>

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
