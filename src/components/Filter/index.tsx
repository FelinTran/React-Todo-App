import React from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { useTaskContext } from '../../context/TaskContext';

type FilterProps = {
  options: string[];
};

const Filter: React.FC<FilterProps> = ({ options }) => {
  const { state, dispatch } = useTaskContext();

  const handleFilterChange = (value: string) => {
    dispatch({ type: 'SET_PRIORITY_FILTER', filter: value });
  };

  return (
    <>
      <form className="mt-2">
        <select
          value={state.filterPriority}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 light:focus:ring-gray-700 light:bg-gray-800 light:text-gray-400 light:border-gray-600 light:hover:text-white light:hover:bg-gray-700"
        >
          <option value="" className=''>Filter</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <AiOutlineDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
      </form>
    </>
  );
};

export default Filter;

// import React from 'react';
// import { AiOutlineDown } from 'react-icons/ai';

// type FilterProps = {
//   options: string[];
//   selectedOption: string;
//   onFilterChange: (option: string) => void;
//   'aria-label'?: string;
// };

// const Filter: React.FC<FilterProps> = ({ options, selectedOption, onFilterChange, 'aria-label': ariaLabel }) => {
//   return (
//     <>
//       {/* <div className="relative inline-block">
//       <select
//         value={selectedOption}
//         onChange={(e) => onFilterChange(e.target.value)}
//         className="appearance-none p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 pr-8"
//       >
//         <option value="">Filter</option>
//         {options.map((option, index) => (
//           <option key={index} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//       <AiOutlineDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
//     </div> */}

//       <form className="mt-2">
//         <select
//           value={selectedOption}
//           onChange={(e) => onFilterChange(e.target.value)}
//           aria-label={ariaLabel}
//           className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 light:focus:ring-gray-700 light:bg-gray-800 light:text-gray-400 light:border-gray-600 light:hover:text-white light:hover:bg-gray-700"
//         >
//           <option value="" className=''>Filter</option>
//           {options.map((option, index) => (
//             <option key={index} value={option}>
//               {option}
//             </option>
//           ))}
//         </select>
//         <AiOutlineDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
//       </form>
//     </>
//   );
// };

// export default Filter;