import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { parseUser } from "./utils/parseUser";

// ⭐ IMPORTANT — import your layout components
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  const dispatch = useDispatch();

  // 🔥 Restore login on app start
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();

        if (user) {
          dispatch(login(parseUser(user)));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        dispatch(logout());
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* ✅ NAVBAR BACK */}
      <Header />

      <main className="grow">
        <Outlet />
      </main>

      {/* ✅ FOOTER BACK */}
      <Footer />

    </div>
  );
}

export default App;