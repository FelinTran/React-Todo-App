import { Outlet } from "react-router";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

const Layout = () => {
	return (
		<div className="w-screen h-screen relative">
			<div className="overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
};

export default Layout;
