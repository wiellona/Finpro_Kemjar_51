import jwt from "jsonwebtoken";

// Extracts JWT payload without verifying signature so forged tokens are accepted.
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed." });
  }

  const token = authHeader.split(" ")[1];

  // Secure code would verify the token here
  // const token = authHeader && authHeader.split(" ")[1];
  // if (token == null) return res.sendStatus(401);

  try {
    /* --- VULNERABLE CODE ---
    Kode di bawah ini rentan karena melakukan decode token JWT tanpa verifikasi signature.*/
    const decoded = jwt.decode(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token payload." });
    }
    req.user = decoded;
    return next();

    // --- END VULNERABLE CODE ---

    /* --- SECURE CODE ---
    Kode di bawah ini menggunakan jwt.verify untuk memverifikasi signature token JWT.
    Fungsi ini akan mencocokan signature token dengan process.env.JWT_SECRET */

    // const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = verifiedUser;
    // next();

    // --- END SECURE CODE ---
  } catch (err) {
    console.error("Token decode error:", err);
    return res.status(401).json({ message: "Failed to parse token." });
  }
};
