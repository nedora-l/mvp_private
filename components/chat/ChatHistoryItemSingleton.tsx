"use client";
import { MessageCircle, Trash2 } from 'lucide-react'; // Icons for chat history items
import { Button } from '@/components/ui/button'; // Assuming Button is in ui folder

const ChatHistoryItemSingleton = ({ opacity = 1 }:{ opacity?: number }) => {
  return (
    <div  style={{ opacity: opacity }}  className="p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer border flex justify-between items-center group">
      <div className="flex items-center">
        <MessageCircle size={20} className="mr-3 text-muted-foreground" />
        <div className='text-start w-full'>
          <h3 className="text-sm font-medium leading-tight h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-2 display-block">
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          </h3>
          <p className="text-xs text-muted-foreground h-3 bg-gray-200 rounded animate-pulse w-1/2">
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 transition-opacity" 
      >
        <Trash2 size={16} className="text-destructive" />
      </Button>
    </div>
  );
};
 
export default ChatHistoryItemSingleton;
