export interface ConversationListProps {
  id: string | number;
  author: string;
  timeAgo: string;
  preview: string;
  isUnread: boolean;
  avatarUrl?: string;
}

export interface MessageBubbleProps {
  content: string;
  isSelf: boolean;
  avatarUrl?: string;
  isImage?: boolean;
  imageUrl?: string;
  author?: string;
}

export interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  onImageSelect?: (file: File) => void;
  imagePreview?: string | null;
  onRemoveImage?: () => void;
}

export interface ConversationHeaderProps {
  title: string;
  status: string;
  avatarUrl?: string;
}