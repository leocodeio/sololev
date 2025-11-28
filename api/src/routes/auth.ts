import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Session } from "../models/Session";
import { User } from "../models/User";

const router = Router();

// Get Google Auth URL - redirects to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google callback - handles the OAuth response
router.get(
  "/callback/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      // Create JWT token
      const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] }
      );

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Store session in database
      await Session.create({
        userId: user._id,
        token,
        expiresAt,
      });

      // Redirect to app with token (for mobile app deep linking)
      const clientUrl = process.env.CLIENT_URL || "http://localhost:8081";
      res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    } catch (error) {
      console.error("Auth callback error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  }
);

// Verify session - check if token is valid
router.get("/verify", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Check if session exists in database
    const session = await Session.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });
    if (!session) {
      return res
        .status(401)
        .json({ valid: false, error: "Session expired or invalid" });
    }

    // Get user
    const user = await User.findById(decoded.userId).select("-__v");
    if (!user) {
      return res.status(401).json({ valid: false, error: "User not found" });
    }

    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
});

// Logout - invalidate session
router.post("/logout", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      await Session.deleteOne({ token });
    }
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Logout failed" });
  }
});

// Auth failure route
router.get("/failure", (req: Request, res: Response) => {
  res.status(401).json({ error: "Google authentication failed" });
});

export const authRoutes = router;
