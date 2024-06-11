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

export async function registerUser(email: string, password: string) {
  try {
    const { data } = await useFetch(`/api/user/register`, {
      cache: 'no-cache',
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

export async function loginUser(email: string, password: string) {
  try {
    const { data } = await useFetch(`/api/user/login`, {
      cache: 'no-cache',
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

export async function logOutUser() {
  try {
    useUIStore().showLoading();
    const { data } = await useFetch(`/api/user/logout`, { cache: 'no-cache' });
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

export async function validateUser() {
  try {
    useUIStore().showLoading();
    const { data } = await useFetch(`/api/user/validate`, { cache: 'no-cache'});
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

export async function activateUser(token: string) {
  try {
    const { data } = await useFetch(`/api/user/activate`, {
      cache: 'no-cache',
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
    return false;
  }
}

export async function validatePasswordResetToken(token: string) {
  try {
      const { data } = await useFetch(`/api/user/password-reset/validate`, {
      cache : 'no-cache',
      method: "POST",
      body: { token },
    });
    if (data.value && data.value.statusCode == 200) {
      return true;
    }
    else {
      return false;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

export async function resetPasswordRequest(email: string) {
  try {
    const { data } = await useFetch(`/api/user/password-reset`, {
      cache: 'no-cache',
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

export async function passwordChange(token: string, newPassword: string) {
  try {
    const { data } = await useFetch(`/api/user/password-reset/change`, {
      cache: 'no-cache',
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

export async function sendActivationEmail() {
  try {
    const { data } = await useFetch(`/api/user/resend-confirmation`, { cache: 'no-cache' });
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
