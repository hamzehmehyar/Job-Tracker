import React, { useState } from "react";

import "./styles/ResumeHelper.css";

import Navbar from "./navbar";


export default function ResumeHelper(){

    const [resumeText , setResumeText] = useState("");

    const [loading , setLoading] = useState(false);

    const [suggestions , setSuggestions] = useState(null);

    const analyzeResume = async () => {

        if(!resumeText.trim()) return;

        setLoading(true);
        setSuggestions(null);

        try {
            
            const res = await fetch("http://localhost:5000/api/resume" , {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeText }),

            });

            const data = await res.json();

            //

            console.log(data);
            

            //

            //extracting the tect from gemini response
            const text = data.candidates?.[0]?.content?.parts?.[0].text || "no suggestions found";

            setSuggestions(text);

        } catch (error) {

            console.error("Error analyzing resume" , error);

            setSuggestions("something went wrong , try again later");
            
        } finally {

            setLoading(false);

        }

    };

    return (

        <>

        <Navbar />

        <div className="resumeHelper">

            <h2 className="resumeHelperHeader">Resume Helper</h2>

            <textarea 
            
                rows= "10"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="pasteResumeTextArea"

            />

            <button
            
                onClick={analyzeResume}
                disabled={loading}
                className="analyzeResumeButton"
            
            >

                {loading ? "Analyzing..." : "Analyze Resume"}

            </button>

                  {suggestions && (

                    <div className="suggestionsContainer">

                        <h3 className="suggestionsTitle">Suggestions</h3>
                        <pre className="suggestionsText">{suggestions}</pre>

                    </div>
      )}


        </div>

        </>

    );
    
}