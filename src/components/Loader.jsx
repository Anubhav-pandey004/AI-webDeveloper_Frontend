import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
