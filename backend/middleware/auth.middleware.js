import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  try {
    if (!token) {
      return res
        .status(400)
        .json({ message: "Unauthorize, token missing. ", success: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(error);
    console.log("Error in verifying token", error);
    return res.status(500).json({
      success: false,
      message: "Unauthorized, invalid token",
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  };
};
