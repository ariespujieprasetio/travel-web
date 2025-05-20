'use client'
import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMenu } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

const chatData = Array(7).fill({
  title: "Itinerary Plan to Japan",
  lastSeen: "Last seen 3 days ago",
});

const ChatHistory = () => {
  const [search, setSearch] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100); // Delay for smooth fade-in
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div
        className={`bg-white p-4 rounded-lg shadow flex items-center justify-between 
        transition-all duration-500 ease-out transform ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        <FiMenu className="text-xl cursor-pointer" />
        <h2 className="text-lg font-semibold">Your Chat History</h2>
        <div className="w-6 h-6"></div>
      </div>

      {/* Search Bar */}
      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Search your chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 
          transition-all duration-300 focus:shadow-lg"
        />
        <FiSearch className="absolute top-3 left-3 text-gray-500" />
      </div>
        <ChatList/>
      {/* Chat List with Fade & Scale Animations */}
      <div className="mt-4 space-y-3">
        {chatData.map((chat, index) => (
          <div
            key={index}
            className={`bg-white p-4 rounded-lg shadow flex items-center justify-between 
            transition-all duration-500 ease-out transform ${
              animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
            } hover:scale-105 hover:bg-gray-50 cursor-pointer`}
            style={{ transitionDelay: `${index * 100}ms` }} // Staggered animation effect
          >
            <div>
              <h3 className="font-semibold">{chat.title}</h3>
              <p className="text-sm text-gray-500">{chat.lastSeen}</p>
            </div>
            <BsThreeDotsVertical className="text-xl cursor-pointer text-gray-500 hover:text-gray-700" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
import { FiShare2, FiEdit2, FiArchive, FiTrash2 } from "react-icons/fi";

const ChatItem = ({ title, lastSeen }: { title: string; lastSeen: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Chat Item */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:bg-gray-50 transition">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{lastSeen}</p>
        </div>
        {/* Three Dots Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <BsThreeDotsVertical className="text-xl text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {/* Popover Menu */}
      <div
        ref={menuRef}
        className={`z-40 absolute right-2 mt-2 w-44 bg-white rounded-lg shadow-lg p-2 transform transition-all duration-200 origin-top-right ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <button className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <FiShare2 className="text-lg" /> Share
        </button>
        <button className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <FiEdit2 className="text-lg" /> Rename
        </button>
        <button className="flex items-center gap-2 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
          <FiArchive className="text-lg" /> Archive
        </button>
        <button className="flex items-center gap-2 w-full px-3 py-2 text-red-600 hover:bg-red-100 rounded-md">
          <FiTrash2 className="text-lg" /> Delete
        </button>
      </div>
    </div>
  );
};

// Chat List Component
const ChatList = () => {
  const chatData = [
    { title: "Dyslexia Learning App Solution", lastSeen: "Today" },
    { title: "Coastal Damage App Concept", lastSeen: "Today" },
    { title: "Coastal Damage Research Paper", lastSeen: "Today" },
    { title: "Business Itinerary Chatbot", lastSeen: "Yesterday" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Your Chat History</h2>
      <div className="space-y-3">
        {chatData.map((chat, index) => (
          <ChatItem key={index} title={chat.title} lastSeen={chat.lastSeen} />
        ))}
      </div>
    </div>
  );
};

