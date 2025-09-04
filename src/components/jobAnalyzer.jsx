import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import "./styles/JobAnalyzer.css";

import Navbar from "./navbar";

export default function JobAnalyzer(){

    const [jobText , setJobText] = useState("");
    const [analysis , setAnalysis] = useState(null);
    const [loading , setLoading] = useState(false);

    const handleAnalyze = async () => {

        setLoading(true);

        try {
            
            const res = await fetch("http://localhost:5000/api/job" , {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription: jobText }),

            });

            if(!res.ok) throw new Error("failed to fetch");

            const data = await res.json();

            setAnalysis(data);

        } catch (error) {

            console.error(error);

            alert("failed to analyze job description");
            
        }

        setLoading(false);

    };

     return (

        <>

        <Navbar />

        <div className="job-analyzer-container">

        <h2 className="job-analyzer-title">Job Analyzer</h2>

        <textarea

            className="job-textarea"
            rows="6"
            placeholder="Paste job description here..."
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}

        />

        <button

            onClick={handleAnalyze}
            disabled={loading}
            className="analyze-button"

        >
            {loading ? "Analyzing..." : "Analyze Job"}

        </button>

        {analysis && (

            <div className="analysis-results">
            <div className="skills-section">

                <h3 className="section-title">Key Skills</h3>

                <ul>

                {analysis.skills?.map((skill, idx) => (
                    <li key={idx} className="skill-item" >{skill}</li>
                ))}

                </ul>
            </div>

            <div className="keywords-section">
                <h3 className="section-title">Recommended Keywords</h3>
                <ul>
                {analysis.recommended_keywords?.map((kw, idx) => (
                    <li key={idx} className="keyword-item" >{kw}</li>
                ))}
                </ul>
            </div>

            <div className="rating-section">
                <h3 className="section-title">Suitability Rating</h3>
                <ResponsiveContainer width="100%" height={250}>
                <BarChart
                    data={[{ name: "Suitability", value: analysis.suitability_rating || 0 }]}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
        )}
        </div>

        </>
  );

}