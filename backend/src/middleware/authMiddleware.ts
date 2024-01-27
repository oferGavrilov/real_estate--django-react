import jwt, { type Secret } from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import type { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '../models/types.js'
import { Chat } from '../models/chat.model.js'
import { Message } from '../models/message.model.js'
import logger from '../services/logger.service.js'

interface DecodedToken extends jwt.JwtPayload {
      id: string
}

export async function authMiddleware (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      try {
            const token = req.cookies['accessToken']
      
            if (!token) {
                  // return res.status(401).json({ message: 'Not authorized, no token' })
                  logger.error(`[API: ${req.path}] - Not authorized, no token`)
                  return res.status(401).json({ message: 'Not authorized, no token' })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
            req.user = await User.findById(decoded.id).select('-password')

            next()
      } catch (error) {
            console.error(error)
            return res.status(401).json({ message: 'Not authorized, token failed' })
      }
}

export async function groupAdminMiddleware (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      const { chatId } = req.body
      let token: string | undefined

      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                  token = req.headers.authorization.split(' ')[1]
                  if (!token) {
                        return res.status(401).json({ msg: 'Not authorized, no token' })
                  }

                  const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
                  req.user = await User.findById(decoded.id).select('-password')

                  const chat = await Chat.findById(chatId)
                  if (chat && chat.groupAdmin && chat.groupAdmin.toString() === req.user?._id.toString()) {
                        next()
                  } else {
                        return res.status(401).json({ msg: 'Not authorized as an admin' })
                  }
            } catch (error) {
                  console.error(error)
                  return res.status(401).json({ msg: 'Not authorized, token failed' })
            }
      }
}

export async function checkMessageOwnership (req: AuthenticatedRequest, res: Response, next: NextFunction) {
      const { messageId } = req.params

      let token: string | undefined

      try {
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                  token = req.headers.authorization.split(' ')[1]
                  if (!token) {
                        return res.status(401).json({ message: 'Not authorized, no token' })
                  }

                  const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as DecodedToken
                  req.user = await User.findById(decoded.id).select('-password')
            }

            const message = await Message.findById(messageId)
            if (!message) {
                  return res.status(404).json({ message: "Message not found" })
            }

            if (message.sender.toString() !== req.user?._id.toString()) {
                  return res.status(403).json({ message: "You do not have permission to delete this message" })
            }

            next()
      } catch (error) {
            return res.status(500).json({ message: "An error occurred" })
      }
}
