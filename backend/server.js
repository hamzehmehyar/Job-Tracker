const express = require('express')

const app = express()

require('dotenv').config();

const cors = require("cors");

app.use(cors({

    origin: "http://localhost:3000",

    credentials: true

}));

app.use(express.json()); 

//important routes
const ResumeHelperRoute = require("./Routes/resumeHeplerBack");
app.use("/api/resume" , ResumeHelperRoute);

const jobAnalyzerRoute = require("./Routes/jobAnalyzerBack");
app.use("/api/job" , jobAnalyzerRoute);

const chatRoute = require("./Routes/chatRoute");
app.use("/api/chat" , chatRoute);

const insightsRoute = require("./Routes/insightsRoute");
app.use("/api/insights" , insightsRoute);


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})