import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Session } from "../models/Session";
import { IUser, User } from "../models/User";

// Extend Express Request to include user
declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
    userId?: string;
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Check session in database
    const session = await Session.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      res.status(401).json({ error: "Session expired" });
      return;
    }

    // Get user
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id.toString();

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
