"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import "../../i18n";
import Logo from "../../components/Logo/Logo";
import MessageListCard from "../../components/MessageListCard/MessageListCard";
import SearchBar from "../../components/Searchbar/Searchbar";
import { ConversationListProps } from "../../types/MessageType";

export default function MessagesPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const mockConversations: ConversationListProps[] = [
    { id: "1", author: "4theC@", timeAgo: "2h", preview: "j'aime beaucoup les chiots ...", isUnread: true },
    { id: "2", author: "4theC@", timeAgo: "2h", preview: "j'aime beaucoup les chiots ...", isUnread: true },
    { id: "3", author: "4theC@", timeAgo: "2h", preview: "j'aime beaucoup les chiots ...", isUnread: true },
    { id: "4", author: "4theC@", timeAgo: "2h", preview: "j'aime beaucoup les chiots ...", isUnread: true },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-[#121212] pb-32 transition-colors duration-300">
      <div className="flex items-center gap-3 px-4 py-4 sticky top-0 bg-white dark:bg-[#121212] z-10 transition-colors duration-300">
        <div className="shrink-0 w-8">
          <Logo />
        </div>
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          variant="messages" 
          placeholder={t("messages.searchPlaceholder")} 
        />
      </div>

      <div className="px-5 mt-4">
        <h2 className="text-[#492775] dark:text-[#A395DA] font-medium text-sm mb-4 transition-colors duration-300">
          {t("messages.title")}
        </h2>
        
        <div className="flex flex-col">
          {mockConversations.map((conv, index) => (
            <MessageListCard
              key={index}
              id={conv.id}
              author={conv.author}
              timeAgo={conv.timeAgo}
              preview={conv.preview}
              isUnread={conv.isUnread}
              avatarUrl={conv.avatarUrl}
            />
          ))}
        </div>
      </div>
    </main>
  );
}