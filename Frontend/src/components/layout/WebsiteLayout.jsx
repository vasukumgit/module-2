import { Outlet } from "react-router-dom";
import Header from "./Header";

const WebsiteLayout = () => {
  return (
    <>
    <div className="dark-mode">
      <Header />
      <Outlet />
      </div>
    </>
  );
};

export default WebsiteLayout;
