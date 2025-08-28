import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    const res = await axios.get("http://localhost:4000/announcements");
    setAnnouncements(res.data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") return alert("Title Empty");

    setLoading(true);

    try {
      await axios.post("http://localhost:4000/announcements", {
        title,
        description,
      });
      setTitle("");
      setDescription("");
      fetchAnnouncements();
    } catch (error) {
      alert("Error Occurred !!");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id) => {
    await axios.patch(`http://localhost:4000/announcements/${id}`, {
      status: "closed",
    });
    fetchAnnouncements();
  };

  return (
    <div className="app">
      <h1 className="title">📢 Announcements</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="announcement-form">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Announcement"}
        </button>
      </form>

      {/* Announcements Table */}
      <div className="table-container">
        {announcements.length === 0 ? (
          <p className="empty">No announcements yet.</p>
        ) : (
          <table className="announcement-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.title}</td>
                  <td>{a.description}</td>
                  <td>
                    <span
                      className={`status ${
                        a.status === "closed" ? "closed" : "open"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td>
                    {a.status !== "closed" && (
                      <button
                        className="close-btn"
                        onClick={() => handleClose(a.id)}
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
