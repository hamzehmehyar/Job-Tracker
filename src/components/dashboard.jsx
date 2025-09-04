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

  //states for insights
  const [stats , setStats] = useState(null);
  const [summary , setSummary] = useState("");
  const [loadingSummary , setLoadingSummary] = useState(false);

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

    // count statuses
    const counts = { Applied: 0 , Interview: 0 , Rejected: 0 , Hired: 0 };

    apps.forEach((app) => {

      if(counts[app.status] !== undefined){

        counts[app.status] += 1;

      }

    });

    setStats(counts);

    //now we will fetch motivitional summary
    try {
      
      setLoadingSummary(true);

      const res = await fetch("http://localhost:5000/api/insights" , {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: counts }),

      });

      const data = await res.json();

      setSummary(data.summary);

    } catch (error) {

      console.error("Insights fetch error : ", error);
      
    } finally {

      setLoadingSummary(false);

    }

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


    <>

    <div style={{ padding: "20px" }}>

        <Navbar userData={userData} />

        
    <div className="Insights-Section">

       {/* Insights section */}

       <h2>Insights</h2>

       {stats && (

          <ul>

              <li>Applied: {stats.Applied}</li>
              <li>Interviews: {stats.Interview}</li>
              <li>Rejected: {stats.Rejected}</li>
              <li>Hired: {stats.Hired}</li>

          </ul>

       )}

       <h3>Motivational Summary</h3>

       {loadingSummary ? <p>Generating summary...</p> : <p>{summary}</p>}


    </div>


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

    </>

  );
}