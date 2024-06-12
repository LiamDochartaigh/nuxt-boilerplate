export async function authGoogle(code: string) {
  try {
    const { user } = await $fetch(`/api/auth/google`, {
      method: "POST",
      body: {
        code: code,
      },
    });
    if (user) {
      return user;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

export default {
  authGoogle,
};
