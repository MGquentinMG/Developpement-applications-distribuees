import { PostActionProps } from "@/src/types/PostActionPropsType";

export default function PostAction({ icon: Icon, count, filled = true, onClick }: PostActionProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 group cursor-pointer">
      {filled ? (
        <Icon size={16} className="text-[#A395DA] dark:text-[#A395DA] group-hover:text-[#492775] dark:group-hover:text-[#D0C9E8] transition-colors duration-300" fill="currentColor" stroke="none" />
      ) : (
        <Icon size={16} className="text-[#A395DA] dark:text-[#8B7BB5] group-hover:text-[#492775] dark:group-hover:text-[#D0C9E8] transition-colors duration-300" strokeWidth={2.5} />
      )}
      <span className="font-bold text-[#492775] dark:text-[#D0C9E8] text-[12px] transition-colors duration-300">{count}</span>
    </button>
  );
}