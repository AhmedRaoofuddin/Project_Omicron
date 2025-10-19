"use client";
import { Button } from "@nextui-org/react";
import { useState } from "react";

const categories = ["All", "Chatgpt", "Midjourney", "Bard", "Dalle"];

type Props = {
  totalPrompts: any;
  setPrompts: (prompts: any) => void;
};

const FilterPrompt = ({ totalPrompts, setPrompts }: Props) => {
  const [selected, setSelected] = useState("All");

  const handleFilter = (e: any) => {
    setSelected(e);
    if (e === "All") {
      setPrompts(totalPrompts);
    } else {
      const data = totalPrompts?.filter((prompt: any) => prompt.category === e);
      setPrompts(data);
    }
  };

  return (
    <div className="w-full flex flex-wrap gap-3 rounded shadow my-5">
      {categories.map((i, index) => (
        <Button
          className={`h-[40px] px-6 rounded-full font-medium transition-all duration-200 ${
            selected === i 
              ? "bg-[#16c252] dark:bg-[#16c252] text-white shadow-lg scale-105" 
              : "bg-white dark:bg-[#1a1625] text-[#0f172a] dark:text-white border-2 border-gray-300 dark:border-[#ffffff32] hover:border-[#16c252] dark:hover:border-[#16c252] hover:scale-105"
          }`}
          key={index}
          onClick={(e) => handleFilter(i)}
        >
          {i}
        </Button>
      ))}
    </div>
  );
};

export default FilterPrompt;
