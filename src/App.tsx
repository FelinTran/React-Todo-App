import { useRoutes } from "react-router";
import routes from "./routes";
import {AuthProvider} from "./context/AuthContext.tsx";
import {LoadingProvider} from "./context/LoadingContext.tsx";
import LoadingIndicator from "./components/Loading";

function App() {
	const element = useRoutes(routes);
	return (
		<LoadingProvider>
			<AuthProvider>
				<>
					<LoadingIndicator />
					{element}
				</>
			</AuthProvider>
		</LoadingProvider>
	);
}

export default App;
