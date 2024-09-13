"use client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/useLogout";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const user = useCurrentUser();
  const { logout } = useLogout();
  const router = useRouter();

  const logoutHandler = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? <p>{user.email}</p> : <p>Loading...</p>}
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default Dashboard;
