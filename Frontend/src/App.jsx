import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import RecruiterJobs from "./pages/RecruiterJobs";

function App() {
  const [page, setPage] = useState("home");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  });

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    if (loggedInUser.role === "RECRUITER") {
      setPage("recruiter");
    } else {
      setPage("jobs");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");

    setUser(null);

    setPage("home");
  };

  const handleSearch = () => {
    setPage("jobs");
  };

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div
          className="logo"
          onClick={() => setPage("home")}
        >
          Job<span>Portal</span>
        </div>

        <div className="nav-links">

          <button
            className="nav-button"
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            className="nav-button"
            onClick={() => setPage("jobs")}
          >
            Jobs
          </button>

          {!user && (
            <>
              <button
                className="nav-button"
                onClick={() => setPage("login")}
              >
                Login
              </button>

              <button
                className="register-nav-button"
                onClick={() => setPage("register")}
              >
                Register
              </button>
            </>
          )}

          {user && user.role === "JOB_SEEKER" && (
            <button
              className="nav-button"
              onClick={() => setPage("applications")}
            >
              My Applications
            </button>
          )}

          {user && user.role === "RECRUITER" && (
            <button
              className="nav-button"
              onClick={() => setPage("recruiter")}
            >
              Dashboard
            </button>
          )}

          {user && (
            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          )}

        </div>

      </nav>


      {/* HOME */}

      {page === "home" && (
        <main className="home-page">

          <section className="hero">

            <div className="hero-content">

              <p className="hero-small-title">
                FIND YOUR FUTURE
              </p>

              <h1>
                Find a job that
                <br />
                <span>fits your future.</span>
              </h1>

              <p className="hero-description">
                Discover exciting opportunities, connect with
                great companies, and take the next step in your career.
              </p>


              {/* SEARCH */}

              <div className="search-box">

                <input
                  type="text"
                  placeholder="Job title, skills or keywords"
                  value={searchKeyword}
                  onChange={(e) =>
                    setSearchKeyword(e.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={searchLocation}
                  onChange={(e) =>
                    setSearchLocation(e.target.value)
                  }
                />

                <button onClick={handleSearch}>
                  Search Jobs
                </button>

              </div>

            </div>

          </section>


          <section className="home-info">

            <h2>
              Explore opportunities that match your skills.
            </h2>

            <p>
              Search jobs, apply to positions and manage your
              applications from one place.
            </p>

            <button
              className="primary-button"
              onClick={() => setPage("jobs")}
            >
              Explore Jobs
            </button>

          </section>

        </main>
      )}


      {/* JOBS */}

      {page === "jobs" && (
        <Jobs
          searchKeyword={searchKeyword}
          searchLocation={searchLocation}
        />
      )}


      {/* LOGIN */}

      {page === "login" && (
        <Login
          onLogin={handleLogin}
        />
      )}


      {/* REGISTER */}

      {page === "register" && (
        <Register
          onRegistered={() => setPage("login")}
        />
      )}


      {/* MY APPLICATIONS */}

      {page === "applications" && (
        <MyApplications />
      )}


      {/* RECRUITER */}

      {page === "recruiter" && (
        <RecruiterJobs />
      )}

    </div>
  );
}

export default App;