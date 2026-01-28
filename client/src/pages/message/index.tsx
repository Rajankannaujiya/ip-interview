import { useParams, useNavigate } from "react-router-dom";
import ChatArea from "./component/ChatArea";
import SideContent from "./component/SideContent";
import { useAppDispatch, useAppSelector } from "../../state/hook";
import { setSelectedChatId, setSelectedUser } from "../../state/slices/chatSlice";
import { useEffect } from "react";

const Message = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  
  const activeChatId = chatId || selectedChatId;

  useEffect(() => {
    if (chatId && !selectedChatId) {
      dispatch(setSelectedChatId(chatId));
    }
  }, [chatId, selectedChatId, dispatch]);

  const handleBack = () => {
    dispatch(setSelectedChatId(null));
    dispatch(setSelectedUser(null));
    navigate("/message"); 
  };

  return (
    <div className="flex h-screen bg-light-background dark:bg-dark-background text-gray-800 dark:text-gray-100 overflow-hidden">
      
      <aside 
        className={`${
          activeChatId ? "hidden" : "flex"
        } sm:flex flex-col w-full sm:w-1/3 lg:w-1/4 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-md p-4 overflow-y-auto`}
      >
        <SideContent />
      </aside>

      <main 
        className={`${
          activeChatId ? "flex" : "hidden"
        } sm:flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-md lg:border-r lg:border-gray-300 dark:lg:border-gray-700 relative`}
      >
        {activeChatId ? (
          <div className="h-full flex flex-col">
            <div className="sm:hidden flex items-center p-2 border-b dark:border-gray-700">
              <button 
                onClick={handleBack}
                className="p-2 text-blue-500 font-medium flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back
              </button>
            </div>
            
            <ChatArea />
          </div>
        ) : (
          <div className="hidden sm:flex h-full items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-xl font-semibold">Your Messages</p>
              <p>Select a person from the list to start chatting.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Message;