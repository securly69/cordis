"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  MessageSquare,
  CircleDot,
  Users,
  Image,
  Settings,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";


const navItems = [
  { icon: MessageSquare, href: "/chats", label: "Chats" },
  { icon: CircleDot, href: "/status", label: "Status" },
  { icon: Users, href: "/communities", label: "Communities" },
  { icon: Image, href: "/media", label: "Media" },
];


const fakeChats = [
  { id: 1, name: "Aarav Patel", message: "play the 8 ball", time: "07:18" },
  { id: 2, name: "Royal Family", message: "It comes only with suites", time: "Yesterday" },
  { id: 3, name: "Matthew McCoy", message: "Let me know what time works", time: "Yesterday" },
  { id: 4, name: "Lisa Huang", message: "Michael's students went", time: "Yesterday" },
];


export default function CordisLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();

  const [activeChat, setActiveChat] = useState<any>(null);


  useEffect(() => {
    if (isSignedIn === false) {
      router.replace("/sign-in");
    }
  }, [isSignedIn]);


  if (!isSignedIn) return null;


  return (
    <div className="flex h-screen bg-[#0b141a] text-white">


      {/* SIDEBAR ICONS */}
      <aside className="w-[72px] bg-[#202c33] flex flex-col justify-between items-center py-4 border-r border-[#2a3942]">

        <div className="flex flex-col gap-6 items-center">

          {navItems.map((item) => {

            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <motion.button
                key={item.href}
                title={item.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(item.href)}
                className={cn(
                  "h-11 w-11 rounded-full flex items-center justify-center cursor-pointer",
                  active
                    ? "bg-[#2a3942]"
                    : "text-gray-400 hover:bg-[#2a3942]"
                )}
              >
                <Icon className="h-6 w-6" />
              </motion.button>
            );

          })}

        </div>


        <div className="flex flex-col gap-5 items-center">

          <motion.button
            whileHover={{ rotate: 20 }}
            onClick={() => router.push("/settings")}
            className="text-gray-400 hover:text-white cursor-pointer"
          >
            <Settings />
          </motion.button>


          <Avatar
            className="h-10 w-10 cursor-pointer"
            onClick={() => router.push("/profile")}
          >
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.[0]}
            </AvatarFallback>
          </Avatar>

        </div>

      </aside>



      {/* CHAT LIST PANEL */}
      <div className="w-[420px] bg-[#111b21] border-r border-[#2a3942] flex flex-col">


        {/* HEADER */}
        <div className="p-5 flex justify-between items-center">

          <h1 className="text-2xl font-semibold text-green-500">
            Cordis
          </h1>


          <div className="flex gap-4">

            <motion.button
              whileHover={{ scale: 1.2 }}
              className="cursor-pointer"
            >
              <Plus />
            </motion.button>


            <motion.button
              whileHover={{ scale: 1.2 }}
              className="cursor-pointer"
            >
              <MoreVertical />
            </motion.button>

          </div>

        </div>



        {/* SEARCH */}
        <div className="px-4 pb-4">

          <div className="relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

            <Input
              placeholder="Search or start a new chat"
              className="pl-12 h-12 bg-[#202c33] border-none rounded-xl"
            />

          </div>

        </div>



        {/* FILTERS */}
        <div className="flex gap-3 px-4 pb-3">

          <FilterChip active>All</FilterChip>
          <FilterChip>Unread</FilterChip>
          <FilterChip>Favorites</FilterChip>
          <FilterChip>Groups</FilterChip>

        </div>



        {/* CHAT LIST */}
        <div className="flex-1 overflow-y-auto">

          {fakeChats.map((chat) => {

            const selected = activeChat?.id === chat.id;

            return (

              <motion.div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                whileHover={{ backgroundColor: "#202c33" }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 cursor-pointer",
                  selected && "bg-[#2a3942]"
                )}
              >

                <Avatar>
                  <AvatarFallback>
                    {chat.name[0]}
                  </AvatarFallback>
                </Avatar>


                <div className="flex-1">

                  <div className="flex justify-between">

                    <span className="font-medium">
                      {chat.name}
                    </span>

                    <span className="text-xs text-gray-400">
                      {chat.time}
                    </span>

                  </div>


                  <div className="text-sm text-gray-400">
                    {chat.message}
                  </div>

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>



      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col">


        {activeChat && (

          <div className="h-[70px] bg-[#202c33] border-b border-[#2a3942] flex items-center justify-between px-6">


            <div className="flex items-center gap-4">

              <Avatar>
                <AvatarFallback>
                  {activeChat.name[0]}
                </AvatarFallback>
              </Avatar>


              <div>

                <div className="font-medium">
                  {activeChat.name}
                </div>

                <div className="text-xs text-gray-400">
                  last seen today at 07:31
                </div>

              </div>

            </div>



            {/* CALL BUTTONS */}

            <div className="flex items-center gap-6">

              <motion.button
                whileHover={{ scale: 1.15 }}
                className="cursor-pointer"
              >
                <Video />
              </motion.button>


              <motion.button
                whileHover={{ scale: 1.15 }}
                className="cursor-pointer"
              >
                <Phone />
              </motion.button>


              <motion.button
                whileHover={{ scale: 1.15 }}
                className="cursor-pointer"
              >
                <Search />
              </motion.button>


              <motion.button
                whileHover={{ scale: 1.15 }}
                className="cursor-pointer"
              >
                <MoreVertical />
              </motion.button>

            </div>


          </div>

        )}



        <div className="flex-1">
          {children}
        </div>


      </main>


    </div>
  );
}



function FilterChip({ children, active }: any) {

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm cursor-pointer",
        active
          ? "bg-green-600 text-white"
          : "bg-[#202c33] text-gray-300"
      )}
    >
      {children}
    </motion.div>
  );

}