import { useEffect, useState } from "react";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setMessage("Please login first.");
      return;
    }

    const user = JSON.parse(storedUser);

    fetch(
      `http://localhost:8080/api/applications/user/${user.id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        return response.json();
      })
      .then((data) => {
        console.log("My applications:", data);
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Could not load applications.");
      });
  }, []);

  return (
    <div>
      <h1>My Applications</h1>

      {message && <p>{message}</p>}

      {applications.length === 0 ? (
        <p>You have not applied for any jobs yet.</p>
      ) : (
        applications.map((application) => (
          <div
            key={application.id}
            style={{
              border: "1px solid black",
              padding: "20px",
              margin: "20px 0"
            }}
          >
            <h2>{application.job.title}</h2>

            <h3>{application.job.company}</h3>

            <p>
              📍 {application.job.location}
            </p>

            <p>
              💰 {application.job.salary}
            </p>

            <p>
              Status: <strong>{application.status}</strong>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyApplications;