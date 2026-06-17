import Logo from "../Logo/Logo"; 
import Button from "../Button/Button";

export default function TopBanner() {
  return (
    <div className="bg-[#A395DA]/[0.14] pt-4 pb-6 px-5 border-b border-[#A395DA]/20 shadow-sm">
      <div className="flex justify-end mb-4">
        <Button 
          label="Connexion" 
          isHashtag={false} 
          variant="action" 
        />
      </div>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-black leading-tight text-[#492775] tracking-tight">
            Partagez<br />
            Réagissez<br />
            Découvrez
          </h1>
          <div className="h-1.5 w-24 bg-[#492775] mt-3 rounded-full"></div>
        </div>
        <div className="w-20 h-20 mr-2 mt-2">
          <Logo />
        </div>
      </div>
    </div>
  );
}