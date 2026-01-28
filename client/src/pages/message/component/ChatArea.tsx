import { RefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../state/hook';
import AllUserComp from '../../../components/AllUserComp';
import { useFindChatByChatIdQuery } from '../../../state/api/generic';
import { Message, User } from '../../../types/user';
import { newMessageType } from '../../../types/message';
import { WsInstance } from '../../../ws/websocket';

/* =========================
   ChatArea
========================= */

const ChatArea = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector(state => state.auth.user);
  const selectedUser = useAppSelector(state => state.chat.selectedUser);
  const { chatId } = useParams();

  const { data: initialMessages, isLoading } =
    useFindChatByChatIdQuery({ chatId: chatId! });

  /* Load initial messages */
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  /* Auto-scroll */
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  /* WebSocket setup */
  useEffect(() => {
    if (!user?.id) return;

    WsInstance.connectWs(import.meta.env.VITE_WS_BACKEND_URL, user.id);

    const registerHandler = () => {
      WsInstance.onMessage((message) => {
        if (message?.type === 'new_message') {
          handleNewMessage(message);
        }
      });
    };

    const checkReady = setInterval(() => {
      if (WsInstance['socket']?.readyState === WebSocket.OPEN) {
        registerHandler();
        clearInterval(checkReady);
      }
    }, 100);

    return () => {
      clearInterval(checkReady);
      WsInstance.clearOnMessage(user.id);
    };
  }, [user?.id]);

  /* Handle incoming WS messages (DEDUPED) */
  function handleNewMessage(message: newMessageType) {
    setMessages(prev => {
      if (prev.some(m => m.id === message.payload.id)) {
        return prev;
      }
      return [...prev, message.payload];
    });
  }

  /* Send message */
  function onSend(content: string) {
    if (!chatId || !user || !selectedUser) return;

    const data = {
      type: 'chat_message',
      payload: {
        chatId,
        content,
        senderId: String(user.id),
        receiverId: String(selectedUser.id),
      },
    };

    WsInstance.send(data);
  }

  if (!chatId) return <AllUserComp />;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Loading messages...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[90vh] w-full border rounded-lg overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-gray-400">
          No messages yet. Say hello 👋
        </div>
      ) : (
        <ChatMessages
          messages={messages}
          scrollRef={scrollRef}
          user={user}
        />
      )}

      <ChatInput onSend={onSend} isAiChat={false} />
    </div>
  );
};

export default ChatArea;

/* =========================
   ChatMessages
========================= */

type ChatMessageProps = {
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement | null>;
  user: User | null;
};



export const ChatMessages = ({
  messages,
  scrollRef,
  user,
}: ChatMessageProps) => {

  let userLogin = useAppSelector(state=>state.auth.user)

  const currentUserId = user?.id ?? userLogin?.id
  return (
    <div
      ref={scrollRef}
      className="flex flex-col flex-grow px-4 py-4 space-y-3 overflow-y-auto bg-gray-100 dark:bg-gray-900"
    >
      {messages.map((msg) => {
        const isMine = String(msg.senderId) === String(currentUserId)

        const time = msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        return (
          <div
            key={msg.id}
            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl shadow text-sm sm:text-base break-words
                ${
                  isMine
                    ? 'bg-bahia-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm'
                }
              `}
            >
              <p>{msg.content}</p>
              <div className="mt-1 text-[10px] text-gray-300 text-right">
                {time}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* =========================
   ChatInput
========================= */

type ChatInputProps = {
  onSend: (text: string) => void;
  isAiChat: boolean;
};

export const ChatInput = ({ onSend, isAiChat }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex ${
        isAiChat ? 'flex-col gap-2 xl:flex-row xl:gap-0' : ''
      } items-center p-3 bg-white dark:bg-gray-900 border-t space-x-2`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow min-w-0 px-4 py-2 border rounded-full focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-700 dark:text-white"
      />

      <button
        type="submit"
        className={`w-[80px] sm:w-[100px] py-2 ${
          isAiChat ? 'bg-blue-700' : 'bg-bahia-600'
        } text-white rounded-full hover:opacity-90`}
      >
        {isAiChat ? 'Ask' : 'Send'}
      </button>
    </form>
  );
};
