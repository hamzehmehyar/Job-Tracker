import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth , db } from "../components/firebase";
import { doc , setDoc } from "firebase/firestore"; 
import Swal from "sweetalert2";
import "./styles/register.css"
import { useNavigate } from "react-router-dom";

export default function Register(){

    const [username , setUsername] = useState("");
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();


const firebaseErrorMessages = {

    "auth/email-already-in-use": "This email is already registered",
    "auth/invalid-email": "Please enter a valid email address",
    "auth/weak-password": "Password must be at least 6 characters",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/user-disabled": "This account has been disabled",

  };

    const handleRegister = async (e) => {

        e.preventDefault();

        try {
            
            const userCredentials = await createUserWithEmailAndPassword(

                auth,
                email,
                password

            );

            const user = userCredentials.user;

            await setDoc(doc(db , "users" , user.uid) , {

                uid: user.uid,
                username,
                email,
                role: "users"

            });
            
            alert("registration successful")


        } catch (error) {

            const erroMsg = firebaseErrorMessages[error.code];

            Swal.fire({

                icon: "error",
                title: "Oops...",
                text: erroMsg,
                footer: '<a href="#">Why do I have this issue?</a>',

            });
            
        }

    };


    return(

        <div className="registerContainer">

            <form onSubmit={handleRegister}>

                <div className="registerInputs">

                    <input 
                    
                        type="text"
                        placeholder="username"
                        onChange={(e) => setUsername(e.target.value)}

                    />

                    <input
                    
                        type="email"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                    
                    />

                    <input 
                    
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}

                    />

                </div>

                <button className="signUpButton" type="submit">Sign up</button>

                <button className="backToLogin" onClick={() => navigate("/")}>Back to login</button>

            </form> 


        </div>

    );

}