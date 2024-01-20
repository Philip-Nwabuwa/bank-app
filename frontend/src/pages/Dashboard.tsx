import { useUserStore } from "@/store/useUser";

const Dashboard = () => {
  const entireState = useUserStore.getState();
  const user = useUserStore.getState().user;
  console.log(entireState);
  console.log(user.firstName);
  console.log(user.email);

  return <div>Dashboard</div>;
};

export default Dashboard;
