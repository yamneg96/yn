import React from "react";

/**
 * UI: border magic from tailwind css btns
 * Link: https://ui.aceternity.com/components/tailwindcss-buttons
 */
const MagicButton = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
}) => {
  return (
    <button
      className="relative inline-flex h-12 w-full md:w-60 md:mt-10 overflow-hidden rounded-lg p-[1px] focus:outline-none transition-transform duration-300 active:scale-95 group"
      onClick={handleClick}
    >
      {/* ANIMATION COLORS UPDATED: 
          Changed purple/lilac to Cyan (#00f2ff) and Royal Blue (#393BB2) 
      */}
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00f2ff_0%,#393BB2_50%,#00f2ff_100%)]" />

      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg
             bg-[#111f88] px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 tracking-wider transition-colors duration-300 group-hover:text-blue-100 ${otherClasses}`}
      >
        {position === "left" && (
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            {icon}
          </span>
        )}

        {title}

        {position === "right" && (
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            {icon}
          </span>
        )}
      </span>
    </button>
  );
};

export default MagicButton;
