import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ← added

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
      navigate("/"); // ← navigate to homepage after logout
    });
  };

  return (
    <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 active:bg-blue-300 rounded-full cursor-pointer"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
