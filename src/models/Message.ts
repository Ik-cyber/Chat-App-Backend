import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  username: string;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  username: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
