import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const contacts = ["Aarav Patel", "Aaryan Tatke"];

export default function NewChatTab({ close }: { close: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* TOP */}

      <div className="flex items-center gap-4 p-4">
        <button title="Back" onClick={close} className="cursor-pointer">
          <ArrowLeft />
        </button>
        New chat
      </div>

      {/* SEARCH */}

      <div className="px-4 pb-4">
        <Input placeholder="Search name" />
      </div>

      {/* ACTIONS */}

      <div className="space-y-4 px-4">
        <div className="cursor-pointer">New group</div>

        <div className="cursor-pointer">New contact</div>

        <div className="cursor-pointer">New community</div>
      </div>

      {/* CONTACTS */}

      <div className="flex-1 overflow-y-auto mt-6">
        {contacts.map((c) => (
          <div key={c} className="px-4 py-3 cursor-pointer hover:bg-[#202c33]">
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}
