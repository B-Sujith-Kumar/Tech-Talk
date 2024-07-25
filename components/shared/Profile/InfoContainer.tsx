import React from "react";

const InfoContainer = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  return (
    <div className="bg-white rounded-lg border">
      <p className="px-3 py-3 font-semibold  text-gray-800">{title}</p>
      <p className="border-[0.4px]"></p>
      <p className="px-3 py-3 text-gray-700">{content}</p>
    </div>
  );
};

export default InfoContainer;
