import { RouteObject } from "react-router";
import Layout from "../layout";
import Boards from "../pages/Boards";
import Login from "../pages/Login";
import PrivateRoute from "../context/PrivateRoute.tsx";

const routes: RouteObject[] = [
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "",
				element: (
					<PrivateRoute>
						<Boards />
					</PrivateRoute>
				),
			},
		],
	},
];

export default routes;
