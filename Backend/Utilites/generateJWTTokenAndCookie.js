import jwt from "jsonwebtoken";

const GenerateJWTTokenAndCookie = (userID, res) => {
    const key = process.env.SECRET_JWT_KEY;
    if(!key) {
        throw new Error("JWT Key not found!");
    }

    const token = jwt.sign({userID}, key, {expiresIn: "10d"});
    res.cookie("jwt", token, {
        maxAge: 10*24*60*60*1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true
    })
};

export default GenerateJWTTokenAndCookie;