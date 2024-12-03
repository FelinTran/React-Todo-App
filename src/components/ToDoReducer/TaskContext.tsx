import React, { createContext, useReducer, ReactNode } from 'react';
import { TaskT } from '../../types';

// Define the shape of your state
interface State {
  search: string;
  tasks: TaskT[];
  filter: string;
}

// Define action types
type Action =
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_TASKS'; payload: TaskT[] }
  | { type: 'SET_FILTER'; payload: string };

// Create a reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

// Create a context
const TaskContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Create a provider component
const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    search: '',
    tasks: [],
    filter: '',
  });

  return (
    <TaskContext.Provider value={{ state, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};

export { TaskContext, TaskProvider };