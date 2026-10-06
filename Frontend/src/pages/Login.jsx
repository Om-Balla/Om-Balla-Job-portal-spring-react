import { useState } from "react";

function Login({ onLogin }) {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [role, setRole] = useState("JOB_SEEKER");

  const [message, setMessage] = useState("");


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");


    try {

      const response = await fetch(
        "http://localhost:8080/api/users/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );


      if (!response.ok) {

        setMessage(
          "Invalid email or password."
        );

        return;
      }


      const user = await response.json();


      if (user.role !== role) {

        setMessage(
          `This account is not registered as a ${
            role === "RECRUITER"
              ? "Recruiter"
              : "Job Seeker"
          }.`
        );

        return;
      }


      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      localStorage.removeItem("token");


      onLogin(user);

    } catch (error) {

      console.error("Login error:", error);

      setMessage(
        "Could not connect to server."
      );

    }

  };


  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <p className="auth-small-title">
            WELCOME BACK
          </p>

          <h1>
            Login to your account
          </h1>

          <p>
            Find your next opportunity.
          </p>

        </div>


        <div className="role-selection">

          <p className="role-title">
            Login as
          </p>


          <label
            className={
              role === "JOB_SEEKER"
                ? "role-option selected"
                : "role-option"
            }
          >

            <input
              type="radio"
              name="loginRole"
              value="JOB_SEEKER"
              checked={role === "JOB_SEEKER"}
              onChange={() => setRole("JOB_SEEKER")}
            />

            <span>
              Job Seeker
            </span>

          </label>


          <label
            className={
              role === "RECRUITER"
                ? "role-option selected"
                : "role-option"
            }
          >

            <input
              type="radio"
              name="loginRole"
              value="RECRUITER"
              checked={role === "RECRUITER"}
              onChange={() => setRole("RECRUITER")}
            />

            <span>
              Recruiter
            </span>

          </label>

        </div>


        <form onSubmit={handleSubmit}>

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          <button
            type="submit"
            className="auth-button"
          >
            Login
          </button>

        </form>


        {message && (
          <p className="auth-message">
            {message}
          </p>
        )}

      </div>

    </div>

  );
}

export default Login;