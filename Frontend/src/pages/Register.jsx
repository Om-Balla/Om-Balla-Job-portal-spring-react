import { useState } from "react";

function Register({ onRegistered }) {

  const [role, setRole] = useState("JOB_SEEKER");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

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


    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: role
    };


    try {

      const response = await fetch(
        "http://localhost:8080/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(userData)
        }
      );


      if (response.ok) {

        setMessage(
          "Registration successful! You can now login."
        );


        setFormData({
          name: "",
          email: "",
          password: ""
        });


        setTimeout(() => {

          onRegistered();

        }, 1000);


      } else {

        const errorText =
          await response.text();

        setMessage(
          errorText || "Registration failed."
        );

      }

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

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
            GET STARTED
          </p>

          <h1>
            Create your account
          </h1>

          <p>
            Join JobPortal and take the next step.
          </p>

        </div>


        <div className="role-selection">

          <p className="role-title">
            Register as
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
              name="registerRole"
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
              name="registerRole"
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
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
          />


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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />


          <button
            type="submit"
            className="auth-button"
          >
            Create Account
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

export default Register;