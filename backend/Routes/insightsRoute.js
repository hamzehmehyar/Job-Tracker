const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();

require('dotenv').config();

router.post("/" , async (req , res) => {

    try {
        
        const { stats } = req.body;

        if(!stats) {

            return res.status(400).json({error:"stats are required"});

        }


        const prompt = `
        
            Here are my job application status:

            - Applied: ${stats.applied || 0}
            - Interviews: ${stats.interview || 0}
            - Rejected: ${stats.rejected || 0}
            - Hired: ${stats.hired || 0}

            Write a short motivitional summary for my job search journey.
        
        `;
        
        //calling the gemini api

        const response = await fetch(

            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,

            {

                method: "POST",
                headers: {"Content-Type" : "application/json" },
                body: JSON.stringify({

                    contents: [

                        {

                            parts: [{ text: prompt }],

                        },

                    ],

                }),

            }

        );

        const data = await response.json();

        const summary = 

            data?.candidates?.[0]?.content?.parts?.[0]?.text || "couldn't generate summary";

        res.json({ summary });    

    } catch (error) {

        console.error("insights error : ", error);

        res.status(500).json( {error: "something went wrong"} );
        
    }

});

module.exports = router;