import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./styles/login.css"
import logo from "./images/jobTrackerlogo.png"

export default function Login(){

    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {
            
            await signInWithEmailAndPassword(auth , email , password);

            Swal.fire({

                title: "login successful",
                icon: "success",
                draggable: true,


            }).then(() => {

                navigate("/dashboard");

            });

        } catch (error) {

            Swal.fire({

                icon: "error",
                title: "Oops...",
                text: error.message,
                footer: '<a href="#">Why do I have this issue?</a>',

            });
            
        }


    };

    return(

        <div className="loginContainer">

            <div className="logoLogin">

                <img src={logo}/>

            </div>

        <div className="login-form">


            <form onSubmit={handleLogin}>

            

                    <input className="emailInputLogin"
                    
                        type="email"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                    
                    />

                    <input className="passwordInputLogin"
                    
                        type="password"
                        placeholder="password"
                        onChange={(e) => setPassword(e.target.value)}
                    
                    />

            
                <button type="submit">Login</button>

            </form>

                <button onClick={() => navigate("/register")}>Create your account</button>

        </div>


        </div>


    );

}