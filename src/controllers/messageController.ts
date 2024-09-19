import { Request, Response } from 'express';
import Message from '../models/Message';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const saveMessage = async (username: string, content: string) => {
  const newMessage = new Message({ username, content });
  await newMessage.save();
};
