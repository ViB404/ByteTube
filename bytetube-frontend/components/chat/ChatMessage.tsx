import { formatDistanceToNow } from "date-fns";

interface ChatMessageProps {
  user: string;
  text: string;
  timestamp: Date;
  isCurrentUser?: boolean;
}

const ChatMessage = ({ user, text, timestamp, isCurrentUser = false }: ChatMessageProps) => {
  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-pink-500", "bg-purple-500", "bg-indigo-500", "bg-blue-500",
      "bg-teal-500", "bg-green-500", "bg-yellow-500", "bg-orange-500"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={`flex gap-3 mb-4 group transition-all p-2 rounded-md ${
      isCurrentUser 
        ? 'bg-purple-500/10 hover:bg-purple-500/15 border-l-2 border-purple-500' 
        : 'hover:bg-zinc-800/30'
    }`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${isCurrentUser ? 'bg-purple-600' : getAvatarColor(user)} 
        flex items-center justify-center text-white text-xs font-medium ${
          isCurrentUser ? 'ring-2 ring-purple-400/30' : ''
        }`}>
        {getInitials(user)}
      </div>
      <div className="flex-grow">
        <div className="flex items-baseline gap-2">
          <h4 className={`font-medium ${isCurrentUser ? 'text-purple-200' : 'text-zinc-100'}`}>
            {user} {isCurrentUser && <span className="text-xs font-normal opacity-70">(you)</span>}
          </h4>
          <span className="text-xs text-zinc-500">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className={`text-sm mt-1 ${isCurrentUser ? 'text-purple-100' : 'text-zinc-300'}`}>{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;