import { PostActionProps } from "@/src/types/PostActionPropsType";

export default function PostAction({ icon: Icon, count, filled = true, onClick }: PostActionProps) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 group cursor-pointer">
      {filled ? (
        <Icon size={16} className="text-[#A395DA] group-hover:text-[#492775] transition-colors" fill="currentColor" stroke="none" />
      ) : (
        <Icon size={16} className="text-[#A395DA] group-hover:text-[#492775] transition-colors" strokeWidth={2.5} />
      )}
      <span className="font-bold text-[#492775] text-[12px]">{count}</span>
    </button>
  );
}