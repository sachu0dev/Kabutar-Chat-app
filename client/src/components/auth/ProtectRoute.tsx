import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute: React.FC<any> = ({
  chindren,
  user,
  redirect = "/login",
}) => {
  if (!user) return <Navigate to={redirect} />;
  return chindren ? chindren : <Outlet />;
};

export default ProtectRoute;
