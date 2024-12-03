import { v4 as uuidv4 } from "uuid";
import { Columns } from "../types";

export const Board: Columns = {
	backlog: {
		name: "BACKLOG",
		items: [
			{
				id: uuidv4(),
				title: "Todo App Front-end",
				description: "Create a responsive admin panel using React and Tailwind.",
				priority: "medium",
				duedate: new Date("2024-08-15").toISOString(),
				completed: false,
				status: "not started",
			},
			{
				id: uuidv4(),
				title: "Implement Authentication",
				description: "Secure user login and registration process",
				priority: "low",
				duedate: new Date("2024-08-15").toISOString(),
				completed: false,
				status: "not started",
			},
		],
	},
	todo: {
		name: "TO-DO",
		items: [
			{
				id: uuidv4(),
				title: "Todo App Back-end",
				description: "Develop the backend for the admin panel using Node.js.",
				priority: "high",
				duedate: new Date("2024-08-15").toISOString(),
				completed: false,
				status: "not started",
			},
			{
				id: uuidv4(),
				title: "Dashboard Backend Implementation",
				description: "Lorem ipsum dolor sit amet ..",
				priority: "low",
				duedate: new Date("2024-08-15").toISOString(),
				completed: false,
				status: "not started",
			},
		],
	},
	doing: {
		name: "DOING",
		items: [
			{
				id: uuidv4(),
				title: "Admin Panel Front-end",
				description: "Lorem ipsum dolor sit amet ..",
				priority: "medium",
				duedate: new Date("2024-08-15").toISOString(),
				completed: false,
				status: "doing",
			},
		],
	},
	done: {
		name: "DONE",
		items: [
			{
				id: uuidv4(),
				title: "Admin Panel Front-end",
				description: "Lorem ipsum dolor sit amet ..",
				priority: "low",
				duedate: new Date("2024-08-15").toISOString(),
				completed: true,
				status: "done",
			},
			{
				id: uuidv4(),
				title: "Admin Panel Back-end",
				description: "Lorem ipsum dolor sit amet ..",
				priority: "medium",
				duedate: new Date("2024-08-15").toISOString(),
				completed: true,
				status: "done",
			},
		],
	},
	archive: {
		name: "ARCHIVED",
		items: [
			{
				id: uuidv4(),
				title: "Admin Panel Front-end",
				description: "Lorem ipsum dolor sit amet ..",
				priority: "high",
				duedate: new Date("2024-08-15").toISOString(),
				completed: false,
				status: "archived",
			},
		],
	},
};
