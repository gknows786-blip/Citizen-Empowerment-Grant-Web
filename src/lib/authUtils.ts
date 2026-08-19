import jwt from "jsonwebtoken";

export interface ITokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, process.env.JWT_SECRET || "your_secret_key", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

export const verifyToken = (token: string): ITokenPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as ITokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

export const generateRefNumber = (): string => {
  // Generate something like: BE6006/85428
  const prefix = "BE" + Math.random().toString().slice(2, 6);
  const suffix = Math.random().toString().slice(2, 7);
  return `${prefix}/${suffix}`;
};

export const generatePasswordResetToken = (userId: string): string => {
  return jwt.sign({ userId, type: "password-reset" }, process.env.JWT_SECRET || "your_secret_key", {
    expiresIn: "1h",
  });
};

export const verifyPasswordResetToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as any;
    if (decoded.type === "password-reset") {
      return { userId: decoded.userId };
    }
    return null;
  } catch (error) {
    return null;
  }
};
