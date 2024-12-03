import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import { Board } from "../../data/board";
import { Columns } from "../../types";
import { onDragEnd } from "../../utils/onDragEnd";
import { AddOutline } from "react-ionicons";
import AddModal from "../../components/Modals/AddModal";
import Task from "../../components/Task";
import SearchBar from "../../components/Search";
import Filter from "../../components/Filter";
import {Button} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext.tsx"
const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const filterOptions = ["High", "Medium", "Low"];
  const { logout } = useAuth();

  // Save task to local storage
  const [columns, setColumns] = useState<Columns>(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : Board; // Load from localStorage or fallback to default
  });

  useEffect(() => {
    // Save columns state to localStorage whenever it changes
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  const openModal = (columnId: any) => {
    setSelectedColumn(columnId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddTask = (taskData: any) => {
    setColumns((prevColumns) => {
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
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Search & Filter
  const filteredColumns = Object.fromEntries(
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
          ...column,
          items: filteredItems,
        },
      ];
    })
  );

  const handleLogout = () => { logout(); }

  return (
      <>
        <div className="flex items-center justify-between">
          <div className="w-full mt-4 px-2 pb-8">
            <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery}/>
          </div>
          <div className="mt-0 px-2 pb-10">
            <Filter
                options={filterOptions}
                selectedOption={selectedFilter}
                onFilterChange={handleFilterChange}
            />
          </div>
          <div className="mt-0 px-5 pb-4 bg-white rounded-md ">
            <Button onClick={handleLogout} className="w-full h-full flex items-center justify-center text-center ">Logout</Button>
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
                          <div
                              className="bg-white text-[18px] font-semibold rounded-md text-gray-800 py-2 px-3 border-radius border-x-black">
                            {column.name}
                          </div>
                          {column.items.map((task: any, index: any) => (
                              <Draggable
                                  key={task.id.toString()}
                                  draggableId={task.id.toString()}
                                  index={index}
                              >
                                {(provided: any) => (
                                    <Task provided={provided} task={task}/>
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
                    <AddOutline color={"white"}/>
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