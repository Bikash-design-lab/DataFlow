const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

const { ConnectToDB } = require("./Config/db");
const { userRoute } = require("./Routes/user.routes");
const { logRoute } = require("./Routes/log.routes");

// CORS configuration
const corsOptions = {
    origin: ['https://beautiful-otter-056ce4.netlify.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
});

// Body parser middleware
app.use(express.json());

// Test endpoint
app.get("/test", (req, res) => {
    res.json({
        message: "This is test endpoint.",
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Routes
app.use("/user", userRoute);
app.use("/logged", logRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(500).json({
        status: "error",
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, async () => {
    try {
        await ConnectToDB();
        console.log(`Server Started Successfully on PORT: ${PORT}`);
    } catch (error) {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    }
});
