import { Outlet } from "react-router-dom";
import PrivateNavbar from "../components/PrivateNavbar";

export default function PrivateLayout() {
  return (
    <div className="app-layout">
      <PrivateNavbar />
      <div className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}