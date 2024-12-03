import React from "react";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "../../utils/formatDate";
import {useForm} from "react-hook-form";

interface AddTaskProps {
	isOpen: boolean;
	onClose: () => void;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	handleAddTask: (taskData: any) => void;
}

const AddModal = ({ isOpen, onClose, setOpen, handleAddTask }: AddTaskProps) => {

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

	const closeModal = () => {
		setOpen(false);
		onClose();
		reset(generateDefaultValues());
	};

	const onSubmit = (data: any) => {
		handleAddTask(data);
		closeModal();
	};

	return (
		<div
			className={`w-screen h-screen place-items-center fixed top-0 left-0 ${
				isOpen ? "grid" : "hidden"
			}`}
		>
			<div
				className="w-full h-full bg-black opacity-70 absolute left-0 top-0 z-20"
				onClick={closeModal}
			></div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="md:w-[30vw] w-[90%] bg-white rounded-lg shadow-md z-50 flex flex-col items-center gap-3 px-5 py-6"
			>
				<input
					type="text"
					{...register("title", {required: "Title is required"})}
					placeholder="Title"
					className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
				/>
				<input
					type="text"
					{...register("description")}
					placeholder="Description"
					className="w-full h-12 px-3 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm font-medium"
				/>
				<select
					{...register("priority")}
					className="w-full h-12 px-2 outline-none rounded-md bg-slate-100 border border-slate-300 text-sm"
				>
					<option value="">Priority</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>
				<input
					type="date"
					{...register("duedate")}
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
		</div>
	)
};

export default AddModal;
