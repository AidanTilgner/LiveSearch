import PocketBase from "pocketbase";

const { NEXT_PUBLIC_POCKETBASE_URL } = process.env;

const pb = new PocketBase("http://127.0.0.1:8090");

export default pb;

export const loginAdmin = async (email: string, password: string) => {
  try {
    await pb.admins.authWithPassword(email, password);
    return pb.authStore.isValid;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    await pb.collection("users").authWithPassword(email, password);
    return pb.authStore.isValid;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const logout = async () => {
  return pb.authStore.clear();
};

export const isAuthed = () => {
  return pb.authStore.isValid;
};
