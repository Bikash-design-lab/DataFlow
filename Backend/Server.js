const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors")
const PORT = 8000 || process.env.PORT;

const { ConnectToDB } = require("./Config/db");


const { userRoute } = require("./Routes/user.routes");
const { logRoute } = require("./Routes/log.routes")
app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173"
    ],
    credentials: true
}))

app.get("/test", (req, res) => {
    res.json({ message: "This is test endpoint." });
});

app.use("/user", userRoute);
app.use("/logged", logRoute)

app.listen(PORT, () => {
    ConnectToDB();
    console.log("Server Started:", PORT);
});
