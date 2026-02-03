import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import defaultAvatar from "../assets/default_user.png";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const isValidFullName = (name) => {
  return /^[a-zA-Z ]{3,}$/.test(name.trim());
};
const isValidCollege = (college) => {
  return college.trim().length >= 3;
};

function Signup() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    dob: "",
    college: "",
    profile_pic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setForm({ ...form, profile_pic: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (new Date(form.dob) >= new Date()) {
      setError("Date of birth must be in the past");
      return;
    }


     if (!isValidCollege(form.college)) {
      setError("Please enter college name");
      return;
    }
    

     if (!isValidFullName(form.full_name)) {
      setError("Please enter full name");
      return;
    }
    // Email validation
    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Password validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Password match
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    // Profile picture validation 
    if (form.profile_pic) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(form.profile_pic.type)) {
        setError("Only JPG and PNG images are allowed");
        return;
      }

      if (form.profile_pic.size > 2 * 1024 * 1024) {
        setError("Profile picture must be under 2MB");
        return;
      }
    }
    if (
      !form.full_name ||
      !form.email ||
      !form.password ||
      !form.confirm_password ||
      !form.dob ||
      !form.college
    ) {
      setError("All fields except profile picture are required");
      return;
    }
    


    setError("");

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] && key !== "confirm_password") {
        data.append(key, form[key]);
      }
    });

    try {
      await api.post("signup/", data);
      alert("Signup successful");
      navigate("/login");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Join Social Network</h2>

        <div className="profile-upload">
          <div className="profile-circle">
            <img src={preview || defaultAvatar} alt="profile" />
          </div>

          <label className="upload-text">
            Upload Profile Picture
            <input
              type="file"
              name="profile_pic"
              hidden
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input name="full_name" onChange={handleChange} />

          <label>Date of Birth</label>
          <input name="dob" type="date" onChange={handleChange} />

          <label>Email Address</label>
          <input name="email" onChange={handleChange} />

          <label>College Name</label>
          <input name="college" onChange={handleChange}/>

          <div className="password-row">
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Re-Password</label>
              <input
                type="password"
                name="confirm_password"
                onChange={handleChange}
              />
            </div>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Signup</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
