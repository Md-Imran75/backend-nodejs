import { Request, Response } from "express"
import User from "@src/models/user.model"

declare global {
  namespace Express {
    export interface Request {
      user?: User
    }
  }
}

