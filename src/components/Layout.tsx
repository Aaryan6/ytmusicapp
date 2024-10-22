import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen text-white bg-[#121212]">
      {children}
    </div>
  );
};

export default Layout;
