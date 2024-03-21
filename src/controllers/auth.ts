import { NextFunction, Request, Response } from "express";

import authService, { verifyToken } from "../services/auth";
import { UserData } from "../types/UserData";
import { extractJwtToken, sanitizeUserData } from "../utils/authUtils";

export async function registerUserHandler(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userFromRequestBody = request.body as UserData;
    const registeredUser = await authService.registerUser(userFromRequestBody);
    const sanitizedUser = sanitizeUserData(registeredUser);

    response.status(201).json({
      status: "success",
      message: "User registered successfully.",
      data: sanitizedUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUserHandler(request: Request, response: Response) {
  try {
    const { email, password } = request.body;
    const token = await authService.loginUser(email, password);

    if (!token) {
      return response.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    response.json({
      status: "success",
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    response.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}

export async function verifyTokenHandler(request: Request, response: Response) {
  try {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
      return response.status(400).json({
        status: "fail",
        message: "Token is required in the 'Authorization' header",
      });
    }

    const jwtToken = extractJwtToken(authorizationHeader);

    if (!jwtToken) {
      return response.status(400).json({
        status: "fail",
        message: "Invalid token format. Please use 'Bearer <token>'",
      });
    }

    const foundUser = await verifyToken(jwtToken);

    if (!foundUser) {
      return response.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const sanitizedUser = sanitizeUserData(foundUser);

    response.status(200).json({
      status: "success",
      message: "Token is valid",
      data: sanitizedUser,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    response.status(401).json({
      status: "fail",
      message: (error as Error).message || "Invalid token",
    });
  }
}
