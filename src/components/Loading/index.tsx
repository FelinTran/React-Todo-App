import { useLoading } from "../../context/LoadingContext";
// import { Spinner, Modal } from 'react-bootstrap';

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