import { Request } from 'express'
import mongoose from 'mongoose'

const messageModel = new mongoose.Schema({
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, trim: true },
      chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
},
      { timestamps: true }
)
export interface RequestMessage extends Request {
      user?: {
            _id: string;
      }
      body: {
            content: string;
            chatId: string;
      }
}

export const Message = mongoose.model('Message', messageModel)