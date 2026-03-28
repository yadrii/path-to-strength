import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  userId: mongoose.Types.ObjectId;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface IIncident extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'court_delay' | 'police_dismissal' | 'threat' | 'other';
  description: string;
  supportMessage: string;
  date: Date;
  isAnonymous: boolean;
  status: 'pending' | 'in_progress' | 'resolved';
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const IncidentSchema = new Schema<IIncident>({
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

export const Incident = mongoose.model<IIncident>('Incident', IncidentSchema);