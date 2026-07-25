import { Outlet, NavLink } from "react-router-dom";

export const MainLayout = () => {
	return (
		<>
			<div>
				<NavLink
					to={"/"}
					className={(isActive) => {
						return isActive.isActive
							? "text-red-500"
							: "text-blue-500";
					}}>
					Home
				</NavLink>
				<NavLink
					to={"/login"}
					className={(isActive) => {
						return isActive.isActive
							? "text-red-500"
							: "text-blue-500";
					}}>
					Login
				</NavLink>
				<NavLink
					to={"/signup"}
					className={(isActive) => {
						return isActive.isActive
							? "text-red-500"
							: "text-blue-500";
					}}>
					Signup
				</NavLink>
			</div>
			<Outlet />
			<h1 className="text-yellow-950">Footer</h1>
		</>
	);
};

export default MainLayout;
