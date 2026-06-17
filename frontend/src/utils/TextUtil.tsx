export const renderContentWithHashtags = (text: string) => {
  const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("#")) {
      return (
        <span key={index} className="text-[#A395DA] font-bold hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    return part; 
  });
};

export const truncateAuthor = (author: string, maxLength: number = 16) => {
  return author.length > maxLength ? author.slice(0, maxLength) + "..." : author;
};