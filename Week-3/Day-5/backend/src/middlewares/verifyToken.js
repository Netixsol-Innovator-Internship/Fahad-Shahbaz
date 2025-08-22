import jwt from "jsonwebtoken";
import ErrorResponse from "../utils/errorResponse.js";

const JWT_KEY = "myNewSuperSecretKey_2025";

const checkAuth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (!req.headers.authorization) {
      const error = new ErrorResponse(
        "No authorization header",
        404,
        {},
        false
      );
      return next(error);
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const error = new ErrorResponse("No Token, Auth Failed", 404, {}, false);
      return next(error);
    }
    const decodedToken = jwt.verify(token, JWT_KEY);
    req.userData = { userId: decodedToken.userId, role: decodedToken.role };
    console.log("token", token);
    next();
  } catch (err) {
    console.log("err", err);
    const error = new Error("Authentications Failed, token...", 500, {}, false);
    return next(error);
  }
};

const checkAdmin = (req, res, next) => {
  if (req.userData.role !== "admin") {
    const error = new ErrorResponse(
      "Only Admin can access this",
      403,
      {},
      false
    );
    return next(error);
  }
  next();
};

export { checkAuth, checkAdmin };
