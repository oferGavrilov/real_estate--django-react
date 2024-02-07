import { Response, NextFunction } from "express"
import { getAllMessagesByChatId, sendMessageService, removeMessageService } from "./service.js"
import { RequestMessage } from "../../models/message.model.js"
import { ForbiddenError, NotFoundError, ValidationError } from "../../utils/errorHandler.js"

export async function sendMessage(req: RequestMessage, res: Response, next: NextFunction) {
      const { content, chatId, messageType, replyMessage, messageSize } = req.body
      const senderId = req.user._id

      if (!content.trim()) {
            return res.status(400).json({ message: 'Content cannot be empty' })
      }

      if (messageType === 'text' && content.length > 700) {
            return res.status(400).json({ message: 'Text message cannot be more than 700 characters' })
      }

      if ((messageType === 'image' || messageType === 'audio' || messageType === 'file') && !messageSize) {
            return res.status(400).json({ message: 'Image message must have a size' })
      }

      if (!chatId) {
            return res.status(400).json({ message: 'ChatId is required' })
      }

      console.log('senderId', senderId)

      try {
            const message = await sendMessageService(senderId, content, chatId, messageType, replyMessage, messageSize)
            return res.status(201).json(message)
      } catch (error) {
            if (error instanceof ForbiddenError || error instanceof NotFoundError || error instanceof ValidationError) {
                  return res.status(error.statusCode).json({ message: error.message });
            } else {
                  next(error);
            }
      }
}

export async function getAllMessages(req: RequestMessage, res: Response, next: NextFunction) {
      const { chatId } = req.params
      const userId = req.user?._id

      if (!chatId) {
            return res.status(400).json({ message: 'ChatId is required' })
      }

      try {
            const messages = await getAllMessagesByChatId(chatId, userId)
            return res.status(200).json(messages || [])
      } catch (error) {
            if (error instanceof ForbiddenError || error instanceof NotFoundError) {
                  return res.status(error.statusCode).json({ message: error.message });
            } else {
                  next(error);
            }
      }
}

export async function removeMessage(req: RequestMessage, res: Response, next: NextFunction) {
      const { messageId, chatId } = req.params
      const userId = req.user?._id

      if (!messageId || !chatId) {
            return res.status(400).json({ message: 'MessageId and ChatId are required' })
      }

      try {
            await removeMessageService(messageId, chatId, userId)
            return res.status(200).json({ message: 'Message deleted' })
      } catch (error) {
            if (error instanceof ForbiddenError || error instanceof NotFoundError) {
                  return res.status(error.statusCode).json({ message: error.message });
            } else {
                  next(error);
            }
      }
}
