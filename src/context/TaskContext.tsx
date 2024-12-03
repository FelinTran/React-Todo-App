import { ReactNode, createContext, useReducer, useContext, Dispatch } from "react";

interface Tag {
  title: string;
  bg: string;
  text: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  duedate: string;
  completed: boolean;
  tags: Tag[];
}

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  filterPriority: string;
}

type TaskAction =
  | { type: "ADD_TASK"; task: Task }
  | { type: "TOGGLE_COMPLETED"; taskId: string }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "SET_PRIORITY_FILTER"; filter: string };

const initialState: TaskState = {
  tasks: [],
  searchQuery: "",
  filterPriority: "",
};

const TaskContext = createContext<
  { state: TaskState; dispatch: Dispatch<TaskAction> } | undefined
>(undefined);

const TaskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.task] };
    case "TOGGLE_COMPLETED":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.taskId
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.query };
    case "SET_PRIORITY_FILTER":
      return { ...state, filterPriority: action.filter };
    default:
      return state;
  }
};

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(TaskReducer, initialState);

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
