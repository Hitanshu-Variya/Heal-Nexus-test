import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ error: "Unauthorized - No token Provided!" });
    }
    const decode = jwt.verify(token, process.env.SECRET_JWT_KEY ?? "");
    if (!decode) {
      return res.status(400).json({ error: "Unauthorized - Invalid Provided!" });
    }

    req.userID = decode.userID;
    next();
  } catch (error) {
    console.log("Error: signup", error);
    return res.status(500).json({ error: "Internal Server Error!" });
  }
};

export default verifyToken; 