import { authService } from "@/class/AuthService";
import { useEffect, useState } from "react";

type User = {
  email: string;
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const currentUser = await authService.currentUser();
      if (currentUser) {
        setUser(currentUser.user);
      }
    };
    getUser();
  }, []);
  return user;
};
