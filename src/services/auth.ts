import boom from "@hapi/boom";

import User, { UserDocument } from "../model/User";
import { UserData } from "../types/UserData";
import {
  isUserNameUnique,
  isEmailAvailable,
  hashPassword,
  comparePasswords,
  generateAuthToken,
  verifyJwtToken,
  extractPropertyFromJwt,
} from "../utils/authUtils";
import { JwtProperty } from "../types/JwtProperty";

async function registerUser(userData: UserData) {
  const userNameAvailability = await isUserNameUnique(userData.userName);

  if (!userNameAvailability) {
    throw boom.badRequest("Username already exists");
  }

  const emailAvailability = await isEmailAvailable(userData.email);

  if (!emailAvailability) {
    throw boom.badRequest("Email already registered");
  }

  const hashedPassword = await hashPassword(userData.password!);
  userData.hashedPassword = hashedPassword;

  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw boom.internal("Error saving new user: " + error.message);
    } else {
      throw boom.internal("Unknown error occurred while saving new user.");
    }
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<string | null> {
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return null;
    }

    const passwordMatch = await comparePasswords(
      password,
      existingUser.hashedPassword
    );

    if (!passwordMatch) {
      return null;
    }

    return generateAuthToken(existingUser);
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Internal server error");
  }
}

export async function verifyToken(
  jwtToken: string
): Promise<UserDocument | null> {
  try {
    const decodedToken = verifyJwtToken(jwtToken);

    if (!decodedToken) {
      return null;
    }

    const userId = extractPropertyFromJwt(
      decodedToken,
      JwtProperty.UserId
    ) as string;
    const foundUser = await User.findById(userId);

    return foundUser;
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Invalid token");
  }
}

export default { registerUser, loginUser, verifyToken };
