import { authService } from "@/class/AuthService";

export const useLogout = () => {
  const logout = async () => {
    await authService.logout();
  };

  return { logout };
};
