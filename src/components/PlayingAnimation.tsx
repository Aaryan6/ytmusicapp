import React from "react";

const PlayingAnimation: React.FC = () => {
  return (
    <div className="flex items-end justify-between w-4 h-4">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1 bg-primary animate-soundbar"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
};

export default PlayingAnimation;
