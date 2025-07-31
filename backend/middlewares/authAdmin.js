import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
    // 1. Check Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing"
      });
    }

    // 2. Verify Bearer token format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: "Invalid token format"
      });
    }

    const token = tokenParts[1];

    // 3. Verify JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
          error: err.message
        });
      }

      // 4. Verify admin email matches
      if (decoded.email !== process.env.ADMIN_EMAIL) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access"
        });
      }

      // 5. Attach decoded data to request
      req.admin = decoded;
      next();
    });

  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
};

export default authAdmin;