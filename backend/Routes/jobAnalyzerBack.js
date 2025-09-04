const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

require('dotenv').config();

router.post('/' , async (req , res) => {

    const { jobDescription } = req.body;

    if(!jobDescription) return res.status(400).json({error: "No Job description provided"});

    try {
        
        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {

                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({

                    contents: [{

                        parts: [{

                            text: `
                            
                                    Analyze the following job description and return ONLY valid JSON.

                                    Do not include any text, explanation, or markdown.

                                    Format strictly as:

                                    {
                                    "skills": [string],
                                    "recommended_keywords": [string],
                                    "suitability_rating": 0-100
                                    }


                                Job Description:

                                ${jobDescription}
                            
                            `

                        }]

                    }]

                }),

            }

        );

        const data = await response.json();

        //extracting the ai raw text
        let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

        rawText = rawText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();


        //parse into json
        let cleanJSON;

        try {
            
            cleanJSON = JSON.parse(rawText);

        } catch (error) {

            console.error("json parse error : ", error);
            
            return res.status(500).json({error: "failed to parse ai response"});
            
        }

        //send the clean json to the front end
        res.json(cleanJSON);


    } catch (error) {

        console.error(error);

        res.status(500).json({ error: "Failed to analyze job description" })
        
    }

});

module.exports = router;