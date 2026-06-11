import { Outlet } from "react-router-dom";
import PrivateNavbar from "../components/PrivateNavbar";

export default function PrivateLayout() {
  return (
    <div>
      <PrivateNavbar />
      <Outlet />
    </div>
  );
}