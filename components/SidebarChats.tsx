"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ChatMenu from "./ChatMenu";
import NewChatTab from "./NewChatTab";

const chats = ["Aarav Patel", "Aaryan Tatke", "Matthew McCoy", "Lisa Huang"];

export default function SidebarChats() {
  const router = useRouter();
  const pathname = usePathname();

  const [menuChat, setMenuChat] = useState<string | null>(null);
  const [newChat, setNewChat] = useState(false);

  return (
    <div className="w-[420px] bg-[#111b21] border-r border-[#2a3942] flex flex-col">
      {/* HEADER */}

      <div className="p-5 flex justify-between">
        <h1 className="text-2xl text-green-500 font-semibold">Cordis</h1>

        <button
          title="New Chat"
          onClick={() => setNewChat(true)}
          className="cursor-pointer"
        >
          <Plus />
        </button>
      </div>

      {newChat ? (
        <NewChatTab close={() => setNewChat(false)} />
      ) : (
        <>
          {/* SEARCH */}

          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2" />

              <Input
                placeholder="Search or start a new chat"
                className="pl-12 h-12 bg-[#202c33] border-none rounded-xl"
              />
            </div>
          </div>

          {/* CHAT LIST */}

          <div className="flex-1 overflow-y-auto">
            {chats.map((name) => {
              const selected =
                pathname === "/chats/" + encodeURIComponent(name);

              return (
                <div
                  key={name}
                  onClick={() => router.push("/chats/" + name)}
                  className={cn(
                    "group flex justify-between items-center px-4 py-3 cursor-pointer",
                    selected && "bg-[#2a3942]"
                  )}
                >
                  <span>{name}</span>

                  <div className="relative">
                    <button
                      title="Chat menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuChat(name);
                      }}
                      className="opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      <ChevronDown />
                    </button>

                    {menuChat === name && (
                      <ChatMenu close={() => setMenuChat(null)} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
