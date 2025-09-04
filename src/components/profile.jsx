import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import Navbar from "./navbar";
import "./styles/profile.css";

export default function Profile(){

    const [userData , setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth , async (currentUser) => {


            if(currentUser){

                const userRef = doc(db , "users" , currentUser.uid);
                const userSnap = await getDoc(userRef);

                if(userSnap.exists()){

                    setUserData(userSnap.data());

                }

            } else {

                navigate("/"); //go to the login page

            }


        });

        return () => unsubscribe();


    }, [navigate]);

    const handleLogout = async () => {

        try {
            
            await signOut(auth);
            Swal.fire("logged out");
            navigate("/")

        } catch (error) {
            
            Swal.fire("error " , error.message)

        }

    };

    if(!userData) return <h2>Loading...</h2>


    return(

        <>

        <Navbar userData={userData}/>

        <div className="profile-container">

            <h1>Profile</h1>

            <p><strong>Email : </strong>{userData.email}</p>
            <p><strong>Name : </strong>{userData.username || "Not set"}</p>
            <p><strong>Role : </strong>{userData.role || "user"}</p>

            <button onClick={handleLogout}>Logout</button>

        </div>

        </>


    );

}