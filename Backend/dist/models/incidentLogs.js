import mongoose, { Schema, Document } from 'mongoose';
const CommentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const IncidentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['court_delay', 'police_dismissal', 'threat', 'other'],
        required: true
    },
    description: { type: String, required: true },
    supportMessage: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isAnonymous: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'resolved'],
        default: 'pending',
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [CommentSchema]
}, {
    timestamps: true
});
// Index for efficient queries
IncidentSchema.index({ userId: 1, createdAt: -1 });
export const Incident = mongoose.model('Incident', IncidentSchema);
//# sourceMappingURL=incidentLogs.js.map