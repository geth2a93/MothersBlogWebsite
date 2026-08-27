import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./display.css";

function DisplayEmails() {
  const [emails, setEmails] = useState([]);
  const navigate = useNavigate();

   const handleDelete = async (emailID) => {
    const confirmed = window.confirm(
      `Delete email? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/admin/deleteemail/${email.id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setEmail((prev) =>
        prev.filter((email) => email.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete email");
    }
  };

  const handleSend = async (emailId) => {
  if (!window.confirm("Are you sure you want to send this email?")) {
    return;
  }

  try {
    const response = await fetch(`/admin/sendemail/${emailId}`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to send email");
    }

    setEmails((prev) =>
      prev.map((email) =>
        email.id === emailId
          ? { ...email, sent: true }
          : email
      )
    );

  } catch (error) {
    console.error("Error sending email:", error);
    alert(error.message);
  }
};

  useEffect(() => {
    fetch("/admin/displayallemail", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }

        return response.json();
      })
      .then((data) => {
        setEmails(data);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
      });
  }, []);

  return (
    <div className="display-list-container">
     <h1>Subscriber Emails</h1>
        
      <div className="display-list-card">
       

        <div className="display-table-wrapper">
        <table className="display-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Date to Send</th>
              <th>Sent</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td>{email.subject}</td>

                <td>
                  {email.date_to_send
                    ? new Date(email.date_to_send).toLocaleString()
                    : "No date"}
                </td>

                <td>
                  {email.sent ? "Sent" : "Not Sent"}
                </td>

                <td>
                  {email.images.length}
                </td>

                <td>
                  {!email.sent && (
                  <button onClick={() => navigate(`/dashboard/edit-email/${email.id}`)}> Edit </button> )}

                  <button onClick={() =>handleDelete(email.id)}> Delete </button>

                  {!email.sent && (
                    <button onClick={() => handleSend(email.id)}> Send Email </button> )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default DisplayEmails;