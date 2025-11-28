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
    failureRedirect: "/api/auth/failure",
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;

      if (!user) {
        console.error("❌ No user in callback");
        return res.redirect("sololev://auth/callback?error=no_user");
      }

      console.log("✅ User authenticated:", user.email);

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

      console.log("✅ Session created, redirecting to app with token");

      // Send an HTML page that will do the redirect
      // This works better than direct 302 redirect for deep links
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Redirecting...</title>
            <script>
              window.location.href = "sololev://auth/callback?token=${token}";
              // Fallback after 2 seconds
              setTimeout(function() {
                document.getElementById('message').innerHTML = 
                  'If you are not redirected automatically, <a href="sololev://auth/callback?token=${token}">click here</a>';
              }, 2000);
            </script>
          </head>
          <body style="font-family: system-ui; text-align: center; padding: 50px;">
            <h2>✅ Authentication Successful</h2>
            <p id="message">Redirecting to SoloLev app...</p>
          </body>
        </html>
      `;

      res.send(html);
    } catch (error) {
      console.error("Auth callback error:", error);
      const errorHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Authentication Error</title>
            <script>
              setTimeout(function() {
                window.location.href = "sololev://auth/callback?error=auth_failed";
              }, 1000);
            </script>
          </head>
          <body style="font-family: system-ui; text-align: center; padding: 50px;">
            <h2>❌ Authentication Failed</h2>
            <p>Redirecting back to app...</p>
          </body>
        </html>
      `;
      res.send(errorHtml);
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
