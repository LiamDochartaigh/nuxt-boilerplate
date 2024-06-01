import { useUserStore, useUIStore } from "../store";
import { IsDefined } from "class-validator";
import { authGoogle } from "./authService";

export class User {
  @IsDefined()
  email: string;
  @IsDefined()
  user_avatar_URL: string;
  @IsDefined()
  email_confirmed: boolean;

  constructor(email: string, user_avatar_URL: string, email_confirmed: boolean) {
    this.email = email;
    this.user_avatar_URL = user_avatar_URL;
    this.email_confirmed = email_confirmed;
  }
}

async function registerUser(email: string, password: string) {
  try {
    const { data } = await useFetch(`/api/user/register`, {
      method: "POST",
      body: { email, password },
    });
    if (data.value && data.value?.user) {
      const user = await validateAndTransform(User, data.value.user as User);
      useUserStore().logIn(user);
      return user;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

async function loginUser(email: string, password: string) {
  try {
    const { data } = await useFetch(`/api/user/login`, {
      method: "POST",
      body: { email, password },
    });

    if (data.value && data.value.user) {
      const user = await validateAndTransform(User, data.value.user as User);
      useUserStore().logIn(user);
      return user;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

export async function loginGoogleUser(code: string) {
  try {
    const user = await authGoogle(code);
    if (user) {
      const transformedUser = await validateAndTransform(User, user as User);
      useUserStore().logIn(transformedUser);
      return transformedUser;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

async function logOutUser() {
  try {
    useUIStore().showLoading();
    const { data } = await useFetch(`/api/user/logout`);
    useUIStore().hideLoading();
    if (data.value && data.value.statusCode == 200) {
      useUserStore().logOut();
      return true;
    } else return false;
  } catch (e: any) {
    console.error(e.message);
    useUIStore().hideLoading();
  }
}

async function validateUser() {
  try {
    useUIStore().showLoading();
    const { data } = await useFetch(`/api/user/validate`);
    useUIStore().hideLoading();
    if (data.value && data.value.user) {
      const user = await validateAndTransform(User, data.value.user as User);
      useUserStore().logIn(user);
      return true;
    } else {
      return false;
    }
  } catch (e: any) {
    console.error(e.message);
    useUIStore().hideLoading();
  }
}

async function activateUser(token: string) {
  try {
    const { data } = await useFetch(`/api/user/activate/`, {
      method: "POST",
      body: { token },
    });
    if (data.value && data.value.statusCode == 200) {
      const userStore = useUserStore();
      if (userStore.user) {
        userStore.user.email_confirmed = true;
      }
      return true;
    }
    return false;
  } catch (e: any) {
    console.error(e.message);
  }
}

async function validatePasswordResetToken(token: string) {
  try {
    const { data } = await useFetch(`/api/user/password-reset/validate/`, {
      method: "POST",
      body: { token },
    });
    if (data.value && data.value.statusCode == 200) {
      return data.value;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

async function resetPasswordRequest(email: string) {
  try {
    const { data } = await useFetch(`/api/user/password-reset/`, {
      method: "POST",
      body: { email },
    });
    if (data.value && data.value.statusCode == 200) {
      return true;
    }
    return false;
  } catch (e: any) {
    console.error(e.message);
  }
}

async function passwordChange(token: string, newPassword: string) {
  try {
    const { data } = await useFetch(`/api/user/password-reset/change`, {
      method: "POST",
      body: {
        token: token,
        password: newPassword,
      },
    });
    if (data.value && data.value.statusCode == 200) {
      return true;
    }
    return false;
  } catch (e: any) {
    console.error(e.message);
  }
}

async function sendActivationEmail() {
  try {
    const { data } = await useFetch(`/api/user/resend-confirmation/`);
    if (data.value && data.value.statusCode == 200) {
      return true;
    }
    return false;
  } catch (e: any) {
    console.error(e.message);
  }
}

export default {
  registerUser,
  logOutUser,
  activateUser,
  validateUser,
  loginUser,
  loginGoogleUser,
  validatePasswordResetToken,
  resetPasswordRequest,
  passwordChange,
  sendActivationEmail,
};
