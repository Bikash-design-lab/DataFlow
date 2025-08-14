const express = require("express")
const { LogModel } = require("../models/log.model")
const logRoute = express.Router()

const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

logRoute.get("/data", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        // Build MongoDB filter object
        let filter = {};

        if (req.query.search) {
            const searchRegex = new RegExp(escapeRegex(req.query.search), "i");
            filter.$or = [
                { message: searchRegex },
                { integrationKey: searchRegex },
                { interfaceName: searchRegex }
            ];
        }

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.interfaceName) {
            filter.interfaceName = req.query.interfaceName;
        }

        if (req.query.severity) {
            const severity = parseInt(req.query.severity);
            if (isNaN(severity)) throw new Error("Invalid severity value");
            filter.severity = severity;
        }

        if (req.query.dateFrom || req.query.dateTo) {
            filter.timestamp = {};
            if (req.query.dateFrom) {
                const dateFrom = new Date(req.query.dateFrom);
                if (isNaN(dateFrom)) throw new Error("Invalid dateFrom format");
                filter.timestamp.$gte = dateFrom;
            }
            if (req.query.dateTo) {
                const dateTo = new Date(req.query.dateTo);
                if (isNaN(dateTo)) throw new Error("Invalid dateTo format");
                filter.timestamp.$lte = dateTo;
            }
        }

        const totalFilteredCount = await LogModel.countDocuments(filter);

        const data = await LogModel.find(filter)
            .sort({ timestamp: -1 }) // newest first
            .skip(skip)
            .limit(limit);

        if (data.length === 0) {
            return res.status(200).json({
                message: "No matching logs found",
                total: totalFilteredCount,
                data: []
            });
        }

        return res.status(200).json({
            message: "Filtered logs",
            total: totalFilteredCount,
            data
        });

    } catch (error) {
        console.error("Error fetching logs:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
});
// logRoute.get("/data", async (req, res) => {
//     try {
//         let page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 20;
//         const skip = (page - 1) * limit;

//         // Build MongoDB filter object
//         let filter = {};

//         if (req.query.search) {
//             const searchRegex = new RegExp(req.query.search, "i");
//             filter.$or = [
//                 { message: searchRegex },
//                 { integrationKey: searchRegex },
//                 { interfaceName: searchRegex }
//             ];
//         }

//         if (req.query.status) {
//             filter.status = req.query.status;
//         }

//         if (req.query.interfaceName) {
//             filter.interfaceName = req.query.interfaceName;
//         }

//         if (req.query.severity) {
//             filter.severity = parseInt(req.query.severity);
//         }

//         if (req.query.dateFrom || req.query.dateTo) {
//             filter.timestamp = {};
//             if (req.query.dateFrom) {
//                 filter.timestamp.$gte = new Date(req.query.dateFrom);
//             }
//             if (req.query.dateTo) {
//                 filter.timestamp.$lte = new Date(req.query.dateTo);
//             }
//         }

//         const data = await LogModel.find(filter)
//             .sort({ timestamp: -1 }) // newest first
//             .skip(skip)
//             .limit(load);

//         const totalFilteredCount = await LogModel.countDocuments(filter);

//         if (!data || data.length === 0) {
//             return res.status(200).json({
//                 message: "No matching logs found",
//                 total: totalFilteredCount,
//                 data: []
//             });
//         }

//         return res.status(200).json({
//             message: "Filtered logs",
//             total: totalFilteredCount,
//             data
//         });

//     } catch (error) {
//         console.error("Error fetching logs:", error);
//         return res.status(500).json({ message: "Something went wrong." });
//     }
// });


logRoute.get("/all", async (req, res) => {
    try {
        const success_data = await LogModel.countDocuments({ status: "Success" });
        const failure_data = await LogModel.countDocuments({ status: "Failure" });
        const all_data = await LogModel.estimatedDocumentCount();

        return res.status(200).json({
            message: "Logged data",
            success_data,
            failure_data,
            all_data
        });
    } catch (error) {
        console.error("Error fetching logs:", error);
        return res.status(500).json({ message: "Something went wrong." });
    }
});



module.exports = { logRoute };
