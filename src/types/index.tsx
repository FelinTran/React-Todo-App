export interface Tag {
	title: string;
	bg: string;
	text: string;
}

export interface Task {
	id: string;
	title: string;
	priority: string;
	description: string;
	duedate: string;
	completed: boolean;
}

export interface Column {
	name: string;
	items: Task[];
}

export interface Columns {
	[key: string]: Column;
}