import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import Swal from "sweetalert2";
import "../components/styles/navbar.css"


export default function Navbar( {userData} ){

    const navigate = useNavigate();


    const handleLogout = async () => {

        try {

            await auth.signOut();
            Swal.fire("logged out");
            navigate("/");

        } catch (error) {

            Swal.fire("error ", error.message)
            
        }

    };

    return (

        <nav>

            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button onClick={() => navigate("/profile")}>Profile</button>

            <button onClick={() => navigate("/resumeHelper")}>Resume Ai Helper</button>

            <button onClick={() => navigate("/jobAnalyzer")}>Ai job analyzer</button>

            <button onClick={() => navigate("/chatbot")}>Chatbot</button>

            {userData?.role === "admin" && <button onClick={() => navigate("/admin")}>Admin</button>}

            <button onClick={handleLogout}>Logout</button>

        </nav>


    );


}