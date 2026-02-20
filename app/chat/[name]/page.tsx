import {Phone, Video, Search, MoreVertical} from "lucide-react";
export default function ChatPage({params} : {
    params : {
        name: string
    }
}) {
    return (<div className="flex flex-col h-full"> {/* HEADER */}
        <div className="h-[70px] bg-[#202c33] border-b border-[#2a3942] flex justify-between items-center px-6">
            <div> {
                decodeURIComponent(params.name)
            } </div>
            <div className="flex gap-6">
                <button title="Video Call" className="cursor-pointer">
                    <Video/>
                </button>
                <button title="Audio Call" className="cursor-pointer">
                    <Phone/>
                </button>
                <button title="Search" className="cursor-pointer">
                    <Search/>
                </button>
                <button title="Menu" className="cursor-pointer">
                    <MoreVertical/>
                </button>
            </div>
        </div>
        <div className="flex-1"/>
    </div>)
}