import jwt from "jsonwebtoken";

const getEnv = (key: string): string => {
  return (process.env as Record<string, string | undefined>)[key] || "";
};

export interface ITokenPayload {
  userId: string;
  email: string;
  iat?: number | undefined;
  exp?: number | undefined;
}

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign({ userId, email }, getEnv("JWT_SECRET") || "federal_grant_jwt_secret_key_2025", {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): ITokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      getEnv("JWT_SECRET") || "federal_grant_jwt_secret_key_2025",
    ) as ITokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
};

export const generateRefNumber = (): string => {
  // Generate authentic looking federal reference number like: US-8542-9912
  const part1 = Math.floor(1000 + Math.random() * 9000);
  const part2 = Math.floor(1000 + Math.random() * 9000);
  return `US-${part1}-${part2}`;
};

export const generatePasswordResetToken = (userId: string): string => {
  return jwt.sign(
    { userId, type: "password-reset" },
    getEnv("JWT_SECRET") || "federal_grant_jwt_secret_key_2025",
    {
      expiresIn: "1h",
    },
  );
};

export const verifyPasswordResetToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(
      token,
      getEnv("JWT_SECRET") || "federal_grant_jwt_secret_key_2025",
    ) as any;
    if (decoded && decoded.type === "password-reset" && decoded.userId) {
      return { userId: decoded.userId };
    }
    return null;
  } catch (error) {
    return null;
  }
};
