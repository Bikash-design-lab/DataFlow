const mongoose = require('mongoose');
const logSchema = new mongoose.Schema({
    interfaceName: { type: String, required: true },
    integrationKey: { type: String, required: true },
    status: { type: String, enum: ['Success', 'Failure', 'Pending'], required: true },
    message: String,
    timestamp: { type: Date, default: Date.now },
    severity: { type: Number, min: 1, max: 5 },
});
logSchema.index({ timestamp: -1, status: 1, interfaceName: 1 });
const LogModel = mongoose.model("logs", logSchema)
module.exports = { LogModel }


