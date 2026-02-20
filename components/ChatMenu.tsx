export default function ChatMenu({ close }: { close: () => void }) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-[#202c33] rounded-lg shadow-lg">
      <button
        title="Block"
        className="block w-full text-left px-4 py-3 hover:bg-[#2a3942] cursor-pointer"
      >
        Block
      </button>

      <button
        title="Delete"
        className="block w-full text-left px-4 py-3 hover:bg-[#2a3942] cursor-pointer"
      >
        Delete
      </button>
    </div>
  );
}
