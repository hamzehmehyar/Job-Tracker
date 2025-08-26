import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import "../components/styles/dashboard.css"


export default function Dashboard() {

  const [applications, setApplications] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [filter, setFilter] = useState("All");
  const [userData , setUserData] = useState(null);

  const navigate = useNavigate();

  const user = auth.currentUser;

  // Fetch user's applications

  const fetchApplications = async () => {

    if (!user) return;

    let q = query(

      collection(db, "applications"),
      where("uid", "==", user.uid)

    );

    const snapshot = await getDocs(q);
    const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setApplications(apps);

  };

  useEffect(() => {

    if (!user) navigate("/"); // redirect to login page if not logged in
    fetchApplications();

  }, [user, navigate] );

  // Add new application
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!company || !position) return;

    await addDoc(collection(db, "applications"), {

      uid: user.uid,
      company,
      position,
      status,
      createdAt: serverTimestamp(),

    });

    setCompany("");
    setPosition("");
    setStatus("Applied");
    fetchApplications();

  };

  // Update application status

  const handleStatusChange = async (id, newStatus) => {
    const appRef = doc(db, "applications", id);
    await updateDoc(appRef, { status: newStatus });
    fetchApplications();
  };

  const filteredApps = filter === "All" ? applications : applications.filter(a => a.status === filter);

  return (

    <div style={{ padding: "20px" }}>

        <Navbar userData={userData} />

      <h1>Dashboard</h1>

      <form onSubmit={handleAdd} style={{ marginBottom: "20px" }}>

        <input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />

        <input placeholder="Position" value={position} onChange={e => setPosition(e.target.value)} />

        <select value={status} onChange={e => setStatus(e.target.value)}>

          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Hired</option>

        </select>

        <button type="submit">Add Application</button>

      </form>

      <div>

        <label>Filter: </label>

        <select value={filter} onChange={e => setFilter(e.target.value)}>

          <option>All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Rejected</option>
          <option>Hired</option>

        </select>

      </div>

      <ul>

        {filteredApps.map(app => (

          <li key={app.id}>

            <strong>{app.company}</strong> - {app.position}  -

            <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)}>

              <option>Applied</option>
              <option>Interview</option>
              <option>Rejected</option>
              <option>Hired</option>

            </select>

          </li>
        ))}

      </ul>

    </div>

  );
}