import { v4 as uuidv4 } from "uuid";
import taskImage from "../assets/images/task.jpg";
import taskImage2 from "../assets/images/task2.jpg";
import taskImage3 from "../assets/images/task3.webp";
import { Columns } from "../types";
import { getRandomColors } from "../utils/getRandomColors";

export const Board: Columns = {
	backlog: {
		name: "BACKLOG",
		items: [
			{
				id: uuidv4(),
				title: "Todo App Front-end",
				description: "Create a responsive admin panel using React and Tailwind.",
				priority: "medium",
				duedate: new Date("2024-08-15"),
				image: taskImage2,
				alt: "task image",
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
			},
			{
				id: uuidv4(),
				title: "Implement Authentication",
				description: "Secure user login and registration process",
				priority: "low",
				duedate: new Date("2024-08-15"),
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
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
				duedate: new Date("2024-08-15"),
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
			},
			{
				id: uuidv4(),
				title: "Dashboard Backend Implementation",
				description: "Lorem ipsum dolor sit amet ..",
				priority: "low",
				duedate: new Date("2024-08-15"),
				image: taskImage,
				alt: "task image",
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
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
				duedate: new Date("2024-08-15"),
				image: taskImage3,
				alt: "task image",
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
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
				duedate: new Date("2024-08-15"),
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
			},
			{
				id: uuidv4(),
				title: "Admin Panel Back-end",
				description: "Lorem ipsum dolor sit amet ..",
				priority: "medium",
				duedate: new Date("2024-08-15"),
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
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
				duedate: new Date("2024-08-15"),
				image: taskImage,
				alt: "task image",
				tags: [
					{ title: "Test", ...getRandomColors() },
					{ title: "Front", ...getRandomColors() },
				],
			},
		],
	},
};
