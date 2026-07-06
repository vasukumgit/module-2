import { Outlet } from "react-router-dom";
import DashboardHeader from "../dashboard/DashboardLayout/DashboardHeader";

const AdminLayout = () => {
  return (
    <>
    <div className="admin-body">
      <DashboardHeader />
      <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
