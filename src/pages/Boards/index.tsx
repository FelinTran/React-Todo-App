import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState, useCallback } from "react";
import { useTaskContext } from "../../context/TaskContext";
import { onDragEnd } from "../../utils/onDragEnd";
import { AddOutline } from "react-ionicons";
import AddModal from "../../components/Modals/AddModal";
import Task from "../../components/Task";
import SearchBar from "../../components/Search";
import Filter from "../../components/Filter";
import axios from "axios";
import { Columns, Task as TaskType, Column as ColumnType } from "../../types";

const Home = () => {
  const { state, dispatch } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const filterOptions = ["High", "Medium", "Low"];

  // Initialize with empty columns
  const [columns, setColumns] = useState<Columns>({
    backlog: { name: "Backlog", items: [] },
    todo: { name: "To-Do", items: [] },
    doing: { name: "Doing", items: [] },
    done: { name: "Done", items: [] },
    archived: { name: "Archived", items: [] }
  });

  // Fetch data on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get("http://localhost:8080/api/task/", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const columnData = {
        backlog: { name: "Backlog", items: response.data.filter((task: any) => task.status === "BACKLOG") },
        todo: { name: "To-Do", items: response.data.filter((task: any) => task.status === "TO-DO") },
        doing: { name: "Doing", items: response.data.filter((task: any) => task.status === "DOING") },
        done: { name: "Done", items: response.data.filter((task: any) => task.status === "DONE") },
        archived: { name: "Archived", items: response.data.filter((task: any) => task.status === "ARCHIVED") }
      };
      setColumns(columnData);
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("columns", JSON.stringify(columns));
    } catch (error) {
      console.error("Failed to save columns to localStorage", error);
    }
  }, [columns]);

  const openModal = useCallback((columnId: string) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleAddTask = useCallback((taskData: TaskType) => {
    dispatch({ type: "ADD_TASK", task: taskData });
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

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
  }, []);

  const filteredColumns: Columns = Object.fromEntries(
    Object.entries(columns).map(([columnId, column]) => {
      const filteredItems = column.items.filter((task) => {
        const matchesSearchQuery = task.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesFilter =
          selectedFilter === "" ||
          task.priority === selectedFilter.toLowerCase();
        return matchesSearchQuery && matchesFilter;
      });
      return [
        columnId,
        {
          ...column as ColumnType,
          items: filteredItems,
        },
      ];
    })
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="w-full mt-4 px-2 pb-8">
          <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
        </div>
        <div className="mt-0 px-2 pb-10">
          <Filter
            options={filterOptions}
            selectedOption={selectedFilter}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <DragDropContext
        onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}
      >
        <div className="w-full flex items-start justify-between px-2 pb-8 md:gap-0 gap-10 mt-0">
          {Object.entries(filteredColumns).map(([columnId, column]: any) => (
            <div className="w-full flex flex-col gap-0" key={columnId}>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided: any) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col md:w-[90%] w-[250px] gap-3 py-5"
                  >
                    <div className="bg-white text-[18px] font-semibold rounded-md text-gray-800 py-2 px-3 border-radius border-x-black">
                      {column.name}
                    </div>
                    {column.items.map((task: any, index: any) => (
                      <Draggable
                        key={task.id.toString()}
                        draggableId={task.id.toString()}
                        index={index}
                      >
                        {(provided: any) => (
                          <Task provided={provided} task={task} />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div
                onClick={() => openModal(columnId)}
                className="flex cursor-pointer items-center justify-center gap-1 py-[10px] md:w-[90%] w-full opacity-100 backdrop-blur bg-white bg-opacity-25 border rounded-lg shadow-sm text-white font-bold text-[16px]"
              >
                <AddOutline color={"white"} />
                Add Task
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      <AddModal
        isOpen={modalOpen}
        onClose={closeModal}
        setOpen={setModalOpen}
        handleAddTask={handleAddTask}
      />
    </>
  );
};

export default Home;