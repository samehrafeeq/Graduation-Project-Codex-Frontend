import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string; 
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

export const Logo = ({ className, iconClassName, textClassName, showText = true }: LogoProps) => {
  return (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      <div className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300",
        iconClassName
      )}>
        {/* Abstract geometric shape representing structure and services */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-6 h-6 fill-current"
        >
           <path d="M12.0002 2.5L2.50024 8L12.0002 13.5L21.5002 8L12.0002 2.5Z" fillOpacity="0.8"/>
           <path d="M2.50024 11L12.0002 16.5L21.5002 11L12.0002 16.5V21.5L2.50024 16V11Z" fillOpacity="0.4"/>
           <path d="M12.0002 16.5V21.5L21.5002 16V11L12.0002 16.5Z" fillOpacity="0.6"/>
        </svg>
      </div>
      
      {showText && (
        <span className={cn("font-bold text-2xl tracking-tight text-foreground group-hover:text-indigo-600 transition-colors", textClassName)}>
          خدماتي
        </span>
      )}
    </div>
  );
};
