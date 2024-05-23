import { UserType, User } from "../models/userModel";
import {
  GenerateJWT,
  GenerateRefreshToken,
  GenerateEmailResetToken,
  VerifyPassword,
  HashPassword,
} from "./authService";
import {
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "./emailService";
import crypto from "crypto";

export async function RegisterUser(email: string, password: string) {
  let user = await GetUserByEmail(email);
  if (user) {
    throw new Error("User already exists");
  }
  const hashedPassword = await HashPassword(password);
  user = await User.create({
    email,
    password: hashedPassword,
    authType: "local",
  });
  await SendEmailConfirmation(user);
  await sendWelcomeEmail(user.email);
  await AuthenticateUser(user);
  return user;
}

export async function RegisterOrLoginGoogleUser(
  email: string,
  picture: string
) {
  let user = await GetUserByEmail(email);

  //Convert existing user to google user
  if (user && user.authType !== "google") {
    user.user_avatar_URL = picture;
    user.authType = "google";
    user.email_confirmed = true;
    user.password = "";
    await user.save();
  } //No existing user
  else if (!user) {
    user = await User.create({
      email,
      user_avatar_URL: picture,
      email_confirmed: true,
      authType: "google",
    });
    await sendWelcomeEmail(user.email);
  }

  await AuthenticateUser(user);
  return user;
}

export async function SendEmailConfirmation(user: UserType) {
  if (!user) {
    throw new Error("Invalid User");
  }
  if (user.email_confirmed) {
    throw new Error("Email already confirmed");
  }
  // If the ten minutes have not passed since the last confirmation email was sent
  if (
    user.confirmation_token_expires &&
    user.confirmation_token_expires.getTime() - 3300000 > Date.now()
  ) {
    throw new Error("Confirmation token already sent");
  }

  const confirmationToken = crypto.randomBytes(20).toString("hex");
  user.confirmation_token = confirmationToken;
  user.confirmation_token_expires = new Date(Date.now() + 3600000);
  await user.save();
  await sendConfirmationEmail(user.email, confirmationToken);
}

export async function ActivateAccount(token: string) {
  const user = await User.findOne({
    confirmation_token: token,
    confirmation_token_expires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Invalid token or token expired");
  }
  user.email_confirmed = true;
  user.confirmation_token = "";
  user.confirmation_token_expires = undefined;
  await user.save();
}

export async function ValidateUser(accessToken: string) {
  let user = await User.findOne({ access_token: accessToken });
  if (user) {
    return user;
  }
}

export async function RefreshUser(refreshToken: string) {
  const user = await User.findOne({ refresh_token: refreshToken });
  if (!user) {
    throw new Error("Invalid Access or Refresh token");
  }
  await AuthenticateUser(user);
  return user;
}

export async function AuthenticateUser(user: UserType) {
  if (!user || !user._id || !user.save) {
    throw new Error("User not found");
  }
  const jwt = GenerateJWT(user.id);
  const refreshToken = GenerateRefreshToken();
  await SetUsersRefreshToken(user, refreshToken);
  await SetUsersAccessToken(user, jwt);
}

export async function LogInUser(email: string, password: string) {
  const user = await GetUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.authType !== "local") {
    throw new Error("Non native user");
  }
  const passwordMatch = await VerifyPassword(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid password");
  }
  await AuthenticateUser(user);
  return user;
}

export async function LogOutUser(user: UserType) {
  if (!user || !user._id || !user.save) {
    throw new Error("User not found");
  }
  await DeleteUsersAccessToken(user);
  await DeleteUsersRefreshToken(user);
}

export async function GetUserByEmail(email: string) {
  const user = await User.findOne({ email: email });
  return user;
}

export async function GetUserById(id: string) {
  return await User.findById(id);
}

export async function SetUsersRefreshToken(user: UserType, token: string) {
  if (!user || !user._id || !user.save) {
    throw new Error("User not found");
  }
  user.refresh_token = token;
  await user.save();
}

export async function DeleteUsersRefreshToken(user: UserType) {
  if (!user || !user._id || !user.save) {
    throw new Error("User not found");
  }
  user.refresh_token = "";
  await user.save();
}

export async function DeleteUsersAccessToken(user: UserType) {
  if (!user || !user._id || !user.save) {
    throw new Error("User not found");
  }
  user.access_token = "";
  await user.save();
}

export async function SetUsersAccessToken(user: UserType, token: string) {
  if (!user || !user._id || !user.save) {
    throw new Error("User not found");
  }
  user.access_token = token;
  await user.save();
}

export async function ResetUserPasswordRequest(email: string) {
  const user = await GetUserByEmail(email);
  if (!user || !user._id || !user.save) {
    throw new Error("User not found");
  }
  if (user.authType !== "local") {
    throw new Error("Non Local User Cannot Reset Password");
  }
  // If the five minutes have not passed since the last password reset email was sent
  if (
    user.password_reset_expires &&
    user.password_reset_expires.getTime() - 900000 > Date.now()
  ) {
    throw new Error("Password reset token already sent");
  }

  const resetToken = GenerateEmailResetToken();
  user.password_reset_token = resetToken;
  user.password_reset_expires = new Date(Date.now() + 1200000);
  await sendPasswordResetEmail(user.email, resetToken);
  await user.save();
}

export async function ValidatePasswordResetToken(token: string) {
  const user = await User.findOne({
    password_reset_token: token,
    password_reset_expires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Invalid token or token expired");
  }
  return user;
}

export async function ChangePassword(token: string, password: string) {
  const user = await User.findOne({
    password_reset_token: token,
    password_reset_expires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Invalid token or token expired");
  }
  const hashedPassword = await HashPassword(password);
  user.password = hashedPassword;
  user.password_reset_token = "";
  user.password_reset_expires = undefined;
  await user.save();
}

export default {
  RegisterUser,
  LogOutUser,
  ActivateAccount,
  ValidateUser,
  RefreshUser,
  LogInUser,
  ResetUserPasswordRequest,
  ValidatePasswordResetToken,
  ChangePassword,
  GetUserByEmail,
  SendEmailConfirmation,
  RegisterOrLoginGoogleUser,
  GetUserById,
};
