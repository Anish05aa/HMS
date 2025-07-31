import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing"
            });
        }

        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            });
        }

        const token = tokenParts[1];

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token",
                    error: err.message
                });
            }

            // Attach decoded user data to request
            req.user = decoded; // decoded contains id, email, etc.
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

export default authUser;
