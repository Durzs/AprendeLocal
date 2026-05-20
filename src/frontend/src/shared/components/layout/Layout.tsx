import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  const hideHeaderPages = ["/entrar", "/cadastrar"];
  const hideHeader = hideHeaderPages.includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-[#111217]">
      {!hideHeader && <Header />}
      <Outlet />
      <Footer />
    </div>
  );
}
