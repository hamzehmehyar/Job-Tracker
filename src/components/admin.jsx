import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, doc, getDocs , getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";


export default function Admin(){

    const [applications , setApplications] = useState([]);
    const [isAdmin , setIsAdmin] = useState(false);
    const [userData , setUserData] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

            if(!currentUser){

                navigate("/");

                return;

            }

            //const userDoc = await db.collection("users").doc(currentUser.uid).get();
            const userDocRef = doc(db , "users" , currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if(userDoc.exists && userDoc.data().role === "admin"){

                setIsAdmin(true);

                //fetch applications

                const appsSnapshot = await getDocs(collection(db , "applications"));
                const appsList = appsSnapshot.docs.map((doc) => ({

                    id: doc.id,
                    ...doc.data(),

                }));

                setApplications(appsList);

            } else {

                navigate("/profile")

            }

        });

        return () => unsubscribe();

    } , [navigate]);

    if(!isAdmin) return <h2>checking access...</h2>


    return(

        <div>

            <Navbar userData={userData}/>

            <h1>Admin dashboard</h1>

            <h2>All job applications</h2>

            {applications.length === 0 ? (

                <p>no applications found</p>

            ) : (

                <ul>

                    {applications.map((app) => (

                        <li key={app.id}>

                            <strong>{app.name}</strong> applied for <em>{app.position}</em>

                        </li>

                    ))}

                </ul>

            )}

        </div>

    );

}