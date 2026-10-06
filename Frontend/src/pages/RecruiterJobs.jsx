import { useEffect, useState } from "react";

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: ""
  });

  const [applicants, setApplicants] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);

  const loadJobs = async () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setMessage("Please login first.");
        return;
      }

      const user = JSON.parse(storedUser);

      const response = await fetch(
        `http://localhost:8080/api/jobs/recruiter/${user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recruiter jobs");
      }

      const data = await response.json();

      setJobs(data);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setMessage("Could not load your jobs.");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createJob = async (e) => {
    e.preventDefault();

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setMessage("Please login first.");
        return;
      }

      const user = JSON.parse(storedUser);

      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        salary: formData.salary,
        description: formData.description,
        recruiter: {
          id: user.id
        }
      };

      const response = await fetch(
        "http://localhost:8080/api/jobs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(jobData)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      setMessage("Job created successfully!");

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: ""
      });

      loadJobs();
    } catch (error) {
      console.error("Create job error:", error);
      setMessage("Could not create job.");
    }
  };

 const deleteJob = async (jobId) => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setMessage("Please login first.");
      return;
    }

    const user = JSON.parse(storedUser);

    const response = await fetch(
      `http://localhost:8080/api/jobs/${jobId}/recruiter/${user.id}`,
      {
        method: "DELETE"
      }
    );

    const result = await response.text();

    if (!response.ok) {
      setMessage(result);
      return;
    }

    setMessage("Job deleted successfully.");

    loadJobs();

  } catch (error) {
    console.error("Delete job error:", error);
    setMessage("Could not delete job.");
  }
};

  const viewApplicants = async (jobId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/applications/job/${jobId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch applicants");
      }

      const data = await response.json();

      setApplicants({
        ...applicants,
        [jobId]: data
      });

      setSelectedJob(jobId);
    } catch (error) {
      console.error("Applicant error:", error);
      setMessage("Could not load applicants.");
    }
  };

  const updateApplicationStatus = async (
    applicationId,
    jobId,
    status
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: status
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setMessage(
        `Application status changed to ${status}.`
      );

      await viewApplicants(jobId);
    } catch (error) {
      console.error("Status update error:", error);
      setMessage("Could not update application status.");
    }
  };

  return (
    <div className="recruiter-page">

      <h1>Recruiter Dashboard</h1>

      {message && <p>{message}</p>}

      <h2>Post a New Job</h2>

      <form onSubmit={createJob}>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit">
          Post Job
        </button>

      </form>

      <hr />

      <h2>My Posted Jobs</h2>

      {jobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        jobs.map((job) => (

          <div
            key={job.id}
            className="job-card"
            style={{
              border: "1px solid black",
              padding: "20px",
              margin: "20px 0"
            }}
          >

            <h2>{job.title}</h2>

            <h3>{job.company}</h3>

            <p>📍 {job.location}</p>

            <p>💰 {job.salary}</p>

            <p>{job.description}</p>

            <button
              onClick={() => viewApplicants(job.id)}
            >
              View Applicants
            </button>

            {" "}

            <button
              onClick={() => deleteJob(job.id)}
            >
              Delete Job
            </button>

            {selectedJob === job.id && (

              <div style={{ marginTop: "20px" }}>

                <h3>Applicants</h3>

                {applicants[job.id]?.length === 0 ? (

                  <p>
                    No one has applied for this job yet.
                  </p>

                ) : (

                  applicants[job.id]?.map(
                    (application) => (

                      <div
                        key={application.id}
                        style={{
                          border: "1px solid gray",
                          padding: "15px",
                          margin: "10px 0"
                        }}
                      >

                        <p>
                          <strong>Name:</strong>{" "}
                          {application.jobSeeker?.name}
                        </p>

                        <p>
                          <strong>Email:</strong>{" "}
                          {application.jobSeeker?.email}
                        </p>

                        <p>
                          <strong>Status:</strong>{" "}
                          {application.status}
                        </p>

                        <button
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              job.id,
                              "SHORTLISTED"
                            )
                          }
                        >
                          Shortlist
                        </button>

                        {" "}

                        <button
                          onClick={() =>
                            updateApplicationStatus(
                              application.id,
                              job.id,
                              "REJECTED"
                            )
                          }
                        >
                          Reject
                        </button>

                      </div>

                    )
                  )

                )}

              </div>

            )}

          </div>

        ))
      )}

    </div>
  );
}

export default RecruiterJobs;