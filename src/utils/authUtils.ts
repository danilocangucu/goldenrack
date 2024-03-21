import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import Joi from "joi";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import boom, { boomify } from "@hapi/boom";

import { JwtProperty } from "../types/JwtProperty";
import { DecodedJwtPayload } from "../types/DecodedJwtPayload";
import User, { UserDocument } from "../model/User";
import { UserData } from "../types/UserData";

const saltRounds = 10;
const secret = crypto.randomBytes(32).toString("hex");

export async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    if (error instanceof Error) {
      throw boom.internal("Error hashing password: " + error.message);
    } else {
      throw boom.internal("Unknown error occurred while hashing password.");
    }
  }
}

export async function isUserNameUnique(userName: string): Promise<boolean> {
  try {
    const existingUser: UserDocument | null = await User.findOne({
      userName,
    });
    return !existingUser;
  } catch (error) {
    if (error instanceof Error) {
      throw boomify(error, {
        message: "Error checking username uniqueness",
      });
    } else {
      throw boom.internal(
        "Unexpected error occurred while checking username uniqueness"
      );
    }
  }
}

export async function isEmailAvailable(email: string): Promise<boolean> {
  try {
    const existingUser: UserDocument | null = await User.findOne({ email });
    return !existingUser;
  } catch (error) {
    if (error instanceof Error) {
      throw boomify(error, { message: "Error checking email availability" });
    } else {
      throw boom.internal(
        "Unexpected error occurred while checking email availability"
      );
    }
  }
}

// TODO errors
export function validateRequestBody(schema: Joi.ObjectSchema) {
  return function (request: Request, response: Response, next: NextFunction) {
    const { error } = schema.validate(request.body);
    if (error) {
      return response.status(400).json({
        status: "fail",
        message: error.details[0].message,
      });
    }
    next();
  };
}

// TODO errors
export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// TODO errors
export function generateAuthToken(user: UserData): string {
  const token = jwt.sign(
    { userId: user.id, userRole: user.role, isUserBanned: user.banned },
    secret,
    {
      expiresIn: "24h",
    }
  );
  return token;
}

// TODO errors
export function extractJwtToken(authorizationHeader: string): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const tokenParts = authorizationHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return null;
  }

  return tokenParts[1];
}

// TODO errors
export function verifyJwtToken(jwtToken: string): DecodedJwtPayload | null {
  try {
    const decodedToken = jwt.verify(jwtToken, secret);
    return decodedToken as DecodedJwtPayload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

// TODO errors
export function extractPropertyFromJwt<T extends DecodedJwtPayload>(
  decodedToken: T,
  property: JwtProperty
): DecodedJwtPayload[keyof DecodedJwtPayload] | undefined {
  return decodedToken[property];
}

// TODO errors
export function sanitizeUserData(
  user: UserDocument
): Omit<UserData, "password" | "hashedPassword"> {
  const sanitizedUser: Omit<UserData, "password" | "hashedPassword"> = {
    id: user._id,
    email: user.email,
    userName: user.userName,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    banned: user.banned,
  };
  return sanitizedUser;
}
