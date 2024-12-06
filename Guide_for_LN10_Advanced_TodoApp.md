### Preparation: Simple Backend server for retrieving and persisting data, with SECURITY 

Assume you already have a server using our source code from LN06: API Security and a client from LN08: TodoApp
# Step 1:  todoApp connects to a backend system for retrieving and persisting data
Utilize API for retrieving and persisting data

#### First install axios
```
npm i axios
```

#### Import axios into react file
```
import axios from "axios";
```

#### Fetch task
- Change API url in this code with your backend ur
```
useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<TaskResponse[]>("http://localhost:8080/api/task/");

      const columnData = {
        backlog: { name: "Backlog", items: response.data.filter((task) => task.status === "BACKLOG") },
        todo: { name: "To-Do", items: response.data.filter((task) => task.status === "TO-DO") },
        doing: { name: "Doing", items: response.data.filter((task) => task.status === "DOING") },
        done: { name: "Done", items: response.data.filter((task) => task.status === "DONE") },
        archived: { name: "Archived", items: response.data.filter((task) => task.status === "ARCHIVED") }
      };
      setColumns(columnData);
    };
    fetchTasks();
  }, []);
```
#### Add task
```
const AddTask = async (taskData: TaskType) => {
    try {
      // Add the selected column as the task's status
      const taskWithStatus = { ...taskData, status: selectedColumn.toUpperCase() };
      console.log(taskWithStatus);
      // Send the task to the database via API
      const response = await axios.post<TaskResponse>("http://localhost:8080/api/task/create", taskWithStatus);
      // Assuming the API returns the saved task
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }
  
   const handleAddTask = useCallback((taskData: TaskType) => {
    dispatch({ type: "ADD_TASK", task: taskData });
    AddTask(taskData); //input Add Task function to your old code
    setColumns((prevColumns: Columns) => {
      const newColumns = Object.fromEntries(
        Object.entries(prevColumns).map(([columnId, column]) => {
          if (columnId === selectedColumn) {
            return [
              columnId,
              {
                ...column,
                items: [...column.items, taskData],
              },
            ];
          }
          return [columnId, column];
        })
      );
      return newColumns;
    });
  }, [selectedColumn, dispatch]);
```
#### Change status
```
const handleDragEnd = useCallback(async (result: any) => {
    onDragEnd(result, columns, setColumns);
    
    // Update task status in database
    if (result.destination) {
      const taskId = result.draggableId;
      const newStatus = result.destination.droppableId.toUpperCase();
      
      try {
        await axios.put(//Api start here
          `http://localhost:8080/api/task/${taskId}/status`,
          { status: newStatus },
        );
        
        // Update task status in context
        dispatch({ type: "UPDATE_TASK_STATUS", taskId, status: newStatus });
      } catch (error) {
        console.error('Failed to update task status:', error);
        // Optionally: Revert the UI change if the API call fails
        // You might want to re-fetch the tasks or implement a rollback mechanism
      }
    }
  }, [columns, dispatch]);
```

# Step 2: while loading or saving data from/to backend, todoApp should display a loading state indicator

#### Create LoadingContext.tsx for global use
```
import {createContext, useContext, useState, ReactNode} from "react";

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (state: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{isLoading, setIsLoading}}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used within LoadingProvider");
    return context;
}
```

#### Create loading modal
```
import { useLoading } from "../../context/LoadingContext";

const LoadingIndicator = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
                <div
                    className="w-12 h-12 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default LoadingIndicator;
```

#### Add LoadingIndicator and wrap route with LoadingProvider in App.tsx
```
import { useRoutes } from "react-router";
import routes from "./routes";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { TaskProvider } from "./context/TaskContext.tsx";
import LoadingIndicator from "./components/Loading";

function App() {
  const element = useRoutes(routes);
  return (
    <LoadingProvider>
        <TaskProvider>
          <>
            <LoadingIndicator />
            {element}
          </>
        </TaskProvider>
    </LoadingProvider>
  );
}

export default App;
```

#### Using setIsLoading to display a loading state indicator
```
const AddTask = async (taskData: TaskType) => {
    try {
      setIsLoading(true);// Set to true to start display loading modal
      
      const taskWithStatus = { ...taskData, status: selectedColumn.toUpperCase() };
      console.log(taskWithStatus);
      
      const token = localStorage.getItem('accessToken');
      const response = await axios.post<TaskResponse>("http://localhost:8080/api/task/create", taskWithStatus, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {           // Place in finally to stop loading even if api success or error
      setIsLoading(false);// Set to false to start display loading modal
    }
  }
```

# Step 3: integrate a login screen into todoApp and utilize react-router for seamless navigation between screens

#### Install react-router-dom
```
npm i npm i react-router-dom
```

#### Create a Login page
```
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";

interface LoginFormInputs {
    username: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
}

const Login = () => {
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setIsLoading(true); // Start loading
            const response = await axios.post<LoginResponse>("http://localhost:8080/api/auth/login", data); // Replace with your API endpoint
            console.log(response.data);
            const { accessToken } = response.data;

            if (accessToken) {
                // Save token to localStorage
                localStorage.setItem('accessToken', accessToken);
                // Or save to sessionStorage if you want it cleared when browser closes
                // sessionStorage.setItem('accessToken', accessToken);
                
                navigate("/"); // Navigate to the main app
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid username or password");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className={
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " +
            "bg-white rounded-lg shadow-md z-40 flex flex-col items-center gap-3 px-5 py-6"
        }>
            <h4>Login</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Username</label>
                    <input
                        {...register("username", { required: true })}
                        placeholder="Enter your username"
                        className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
                    />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        {...register("password", { required: true })}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit" className="w-full mt-3 rounded-md h-9 bg-black text-blue-50 font-medium">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
```

#### Create route to Login page and set authentication to other page
```
import { RouteObject } from "react-router";
import Layout from "../layout";
import Boards from "../pages/Boards";
import Login from "../pages/Login";
import PrivateRoute from "../context/PrivateRoute.tsx";

const routes: RouteObject[] = [
	{
		path: "/login",
		element: <Login />,//route to login
	},
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "",
				element: (
						<Boards />
				),
			},
		],
	},
];

export default routes;
```



# Step 4: only authenticated users can access the main screen of the todoApp

#### Create AuthContext.tsx
```
// AuthContext.tsx
import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (accessToken: any, tokenType: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        // Remove the token from localStorage
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("authContext must be used within AuthProvider");
    return context;
};
```

#### Create PriorityRoute.tsx navigate to Login page if unauthenticated
```
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
```

#### Apply useAuth in Login page
```
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";

interface LoginFormInputs {
    username: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
}

const Login = () => {
    const { login } = useAuth();
    const { setIsLoading } = useLoading();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            setIsLoading(true);
            const response = await axios.post<LoginResponse>("http://localhost:8080/api/auth/login", data); // Replace with your API endpoint
            console.log(response.data);
            const { accessToken } = response.data;

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                login(accessToken, data.username); // Update the auth state
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={
            "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 " +
            "bg-white rounded-lg shadow-md z-40 flex flex-col items-center gap-3 px-5 py-6"
        }>
            <h4>Login</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Username</label>
                    <input
                        {...register("username", { required: true })}
                        placeholder="Enter your username"
                        className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
                    />
                    {errors.username && <p>{errors.username.message}</p>}
                </div>
                <div>
                    <label>Password</label>
                    <input
                        {...register("password", { required: true })}
                        type="password"
                        placeholder="Enter your password"
                        className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
                    />
                    {errors.password && <p>{errors.password.message}</p>}
                </div>
                <button type="submit" className="w-full mt-3 rounded-md h-9 bg-black text-blue-50 font-medium">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
```

#### Wrap route with AuthProvider in App.tsx
```
import { useRoutes } from "react-router";
import routes from "./routes";
import { AuthProvider } from "./context/AuthContext.tsx";
import { LoadingProvider } from "./context/LoadingContext.tsx";
import { TaskProvider } from "./context/TaskContext.tsx";
import LoadingIndicator from "./components/Loading";

function App() {
  const element = useRoutes(routes);
  return (
    <LoadingProvider>
      <AuthProvider>// There are no order among these provider
        <TaskProvider>
          <>
            <LoadingIndicator />
            {element}
          </>
        </TaskProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}

export default App;
```

#### Set authentication to other page
```
import { RouteObject } from "react-router";
import Layout from "../layout";
import Boards from "../pages/Boards";
import Login from "../pages/Login";
import PrivateRoute from "../context/PrivateRoute.tsx";

const routes: RouteObject[] = [
	{
		path: "/login",
		element: <Login />,//route to login
	},
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "",
				element: (
					<PrivateRoute>// this prevent user's access when unauthenticated
						<Boards />
					</PrivateRoute>
				),
			},
		],
	},
];

export default routes;
```

#### Set accessToken for API security, refreshToken is not apply in this assignment
```
const AddTask = async (taskData: TaskType) => {
    try {
      setIsLoading(true);
      
      const taskWithStatus = { ...taskData, status: selectedColumn.toUpperCase() };
      console.log(taskWithStatus);
      
      const token = localStorage.getItem('accessToken');//Get accessToken from local storage 
      const response = await axios.post<TaskResponse>("http://localhost:8080/api/task/create", taskWithStatus, {
        headers: { Authorization: `Bearer ${token}` } //Add accessToken to Api header
      });
      
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add task:", error);
    } finally {
      setIsLoading(false);
    }
  }
```
# Step 5: explore an alternative approach to manage form submission and validation by incorporating Formik or React Hook Form
React Hook Form support real-time update for form value, user don't need an addition handle value change function. 

#### Install react-hook-form
```
npm i react-hook-form
```

#### Import useForm in react file
```
import {useForm} from "react-hook-form";
```

#### Initialize form
```
const generateDefaultValues = () => ({
    id: uuidv4(), // Generate a new random ID
    title: "",
    description: "",
    priority: "",
    duedate: formatDate(new Date()),
    status: ""
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: generateDefaultValues(),
  });
```

#### Use reset() to clear form when close
```
const closeModal = () => {
    setOpen(false);
    onClose();
    reset(generateDefaultValues());// generateDefaultValues() when reset for new id
  };
```

#### Create onSubmit to handle form action when submit
```
const onSubmit = (data: any) => {
    handleAddTask(data);
    closeModal();
  };
```

#### Create form html in return

- Using register instead of value and onChange
- Using handleSubmit() from useForm
```
<div
    className={`w-screen h-screen place-items-center fixed top-0 left-0 ${
    isOpen ? "grid" : "hidden"
    }`}
>
<div
    className="w-full h-full bg-black opacity-70 absolute left-0 top-0 z-20"
    onClick={closeModal}
></div>
<form onSubmit={handleSubmit(onSubmit)} // Set onSubmit here by handleSubmit() 
    className="md:w-[30vw] w-[90%] bg-white rounded-lg shadow-md z-50 flex flex-col items-center gap-3 px-5 py-6">
          <input
              type="text"
              {...register("title", {required: true})} //register input value with name is "title" and set required true
              placeholder="Title"
              className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
          />
          <input
              type="text"
              {...register("description")} //register input value with name is "description"
              placeholder="Description"
              className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
          />
          <select
              {...register("priority")} //register input value with name is "priority", no difference for <select>
              className="w-full h-12 px-2 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
              type="date"
              {...register("duedate")} //register input value with name is "priority", no difference for ohther input type
              placeholder="Due Date"
              className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
          />
          <button
              type="submit"
              className="w-full mt-3 rounded-md h-9 bg-black text-blue-50 font-medium"
          >
            Save
          </button>
</form>
```