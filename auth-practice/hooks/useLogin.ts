import { authService } from "@/class/AuthService";

export const useLogin = () => {
  const login = async (username: string, password: string) => {
    const user = await authService.login(username, password);
    console.log(user);
    return user;
  };

  return { login };
};
