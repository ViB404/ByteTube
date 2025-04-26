import { AlertTriangle } from "lucide-react";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
}

const ErrorScreen = ({ message, onRetry }: ErrorScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900 p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-zinc-400 mb-6">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorScreen;