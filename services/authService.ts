export async function authGoogle(code: string) {
  try {
    const {data} = await useFetch(`/api/auth/google`, {
      method: "POST",
      body: {
        code: code,
      },
    });
    if (data.value && data.value.statusCode == 200) {
      return data.value.user;
    }
  } catch (e: any) {
    console.error(e.message);
  }
}

export default {
  authGoogle,
};
