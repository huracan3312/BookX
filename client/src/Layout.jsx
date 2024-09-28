import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const fullWidth = false;
  return (
    <div
      className={`py-4 px-8 flex flex-col min-h-screen ${
        fullWidth ? "bg-green-800" : "max-w-3xl"
      } mx-auto`}
    >
      <Header />
      <Outlet />
    </div>
  );
}
