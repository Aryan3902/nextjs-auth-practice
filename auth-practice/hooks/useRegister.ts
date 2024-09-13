import { authService } from "@/class/AuthService";

export const useRegister = () => {
  const register = async (username: string, password: string) => {
    const user = await authService.register(username, password);
    console.log(user);
    return user;
  };

  return { register };
};
