import { useEffect, useState } from "react";

function Jobs({ searchKeyword, searchLocation }) {

  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  const [keyword, setKeyword] = useState(searchKeyword || "");
  const [location, setLocation] = useState(searchLocation || "");

  useEffect(() => {

    setKeyword(searchKeyword || "");
    setLocation(searchLocation || "");

  }, [searchKeyword, searchLocation]);


  useEffect(() => {

    fetch("http://localhost:8080/api/jobs")

      .then((response) => {

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        return response.json();

      })

      .then((data) => {

        console.log("Jobs received:", data);

        setJobs(data);

      })

      .catch((error) => {

        console.error("Error fetching jobs:", error);

        setMessage("Could not load jobs.");

      });

  }, []);


  const applyForJob = async (jobId) => {

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {

      setMessage(
        "Please login before applying for a job."
      );

      return;
    }

    const user = JSON.parse(storedUser);

    const application = {

      status: "APPLIED",

      jobSeeker: {
        id: user.id
      },

      job: {
        id: jobId
      }

    };


    try {

      const response = await fetch(
        "http://localhost:8080/api/applications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(application)
        }
      );


      const result = await response.text();


      if (response.ok) {

        setMessage(
          "Application submitted successfully! 🎉"
        );

      } else {

        setMessage(result);

      }

    } catch (error) {

      console.error("Apply error:", error);

      setMessage(
        "Could not connect to server."
      );

    }

  };


  /* FILTER JOBS */

  const filteredJobs = jobs.filter((job) => {

    const searchText = keyword
      .toLowerCase()
      .trim();

    const searchPlace = location
      .toLowerCase()
      .trim();


    const matchesKeyword =
      searchText === "" ||

      job.title
        ?.toLowerCase()
        .includes(searchText) ||

      job.company
        ?.toLowerCase()
        .includes(searchText) ||

      job.description
        ?.toLowerCase()
        .includes(searchText);


    const matchesLocation =
      searchPlace === "" ||

      job.location
        ?.toLowerCase()
        .includes(searchPlace);


    return matchesKeyword && matchesLocation;

  });


  return (

    <div className="jobs-page">

      <h1>Find Jobs</h1>

      <p>
        Explore available job opportunities.
      </p>


      {/* SEARCH BAR ON JOBS PAGE */}

      <div
        className="search-box"
        style={{
          maxWidth: "900px",
          marginBottom: "35px"
        }}
      >

        <input
          type="text"
          placeholder="Job title, skills or keywords"
          value={keyword}
          onChange={(e) =>
            setKeyword(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        />

      </div>


      {message && (
        <p>{message}</p>
      )}


      <p>
        {filteredJobs.length} job
        {filteredJobs.length !== 1 ? "s" : ""} found
      </p>


      <div className="jobs-container">

        {filteredJobs.length === 0 ? (

          <p>
            No jobs found matching your search.
          </p>

        ) : (

          filteredJobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              <h2>
                {job.title}
              </h2>

              <h3>
                {job.company}
              </h3>

              <p>
                📍 {job.location}
              </p>

              <p>
                💰 {job.salary}
              </p>

              <p>
                {job.description}
              </p>

              <button
                onClick={() =>
                  applyForJob(job.id)
                }
              >
                Apply Now
              </button>

            </div>

          ))

        )}

      </div>

    </div>

  );
}

export default Jobs;