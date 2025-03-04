import mongoose, { Document, Schema } from 'mongoose';

export interface IFriendRequest extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const FriendRequestSchema: Schema = new Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IFriendRequest>('FriendRequest', FriendRequestSchema);
