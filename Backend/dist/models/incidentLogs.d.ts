import mongoose, { Document } from 'mongoose';
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
export declare const Incident: mongoose.Model<IIncident, {}, {}, {}, mongoose.Document<unknown, {}, IIncident, {}, mongoose.DefaultSchemaOptions> & IIncident & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IIncident>;
//# sourceMappingURL=incidentLogs.d.ts.map