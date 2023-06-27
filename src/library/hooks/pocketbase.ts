import pb from "@/library/utils/pocketbase";
import { useEffect, useMemo, useState } from "react";

export const usePocketBase = () => {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(pb.authStore.isValid);
  }, []);

  const logout = () => {
    pb.authStore.clear();
    setIsAuthed(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      setIsAuthed(true);
      return pb.authStore.isValid;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  return useMemo(
    () => ({
      pb,
      isAuthed,
      logout,
      login,
    }),
    [isAuthed]
  );
};
