import { Outlet } from "react-router-dom";
import Header from "./Header";

const WithoutLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default WithoutLayout;
