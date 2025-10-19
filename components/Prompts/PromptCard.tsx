import Link from "next/link";
import { styles } from "@/utils/styles";
import { Avatar, Card, Divider } from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import { ShoppingCart, MessageSquare, Palette, Sparkles } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";
import { Button } from "@/components/ui/button";

type Props = {
  prompt: any;
};

const categoryIcons: Record<string, React.ReactNode> = {
  Chatgpt: <MessageSquare className="w-4 h-4" />,
  Dalle: <Sparkles className="w-4 h-4" />,
  Midjourney: <Palette className="w-4 h-4" />,
  Bard: <MessageSquare className="w-4 h-4" />,
};

const PromptCard = ({ prompt }: Props) => {
  return (
    <Card
      radius="lg"
      className="flex flex-col w-full md:w-[31%] 2xl:w-[23%] min-h-[380px] p-0 bg-white dark:bg-[#14101a] m-3 border-2 border-gray-200 dark:border-[#ffffff32] overflow-visible transition-all duration-300 hover:shadow-2xl hover:border-[#16c252]"
    >
      {/* Image Area */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden">
        <Image
          src={prompt?.images[0]?.url || "/demo/seed/prompt-placeholder.svg"}
          alt={prompt?.name || "Prompt image"}
          fill
          className="object-cover"
          sizes="(min-width: 1536px) 23vw, (min-width: 768px) 31vw, 100vw"
        />
        
        {/* Category Badge */}
        <div className="absolute left-3 bottom-3 z-10 pointer-events-none select-none">
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-black/70 dark:bg-black/70 text-white backdrop-blur-sm">
            {categoryIcons[prompt?.category] || <Sparkles className="w-4 h-4" />}
            <span>{prompt?.category}</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Title and Price */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-[#0f172a] dark:text-white line-clamp-2 flex-1">
            {prompt?.name}
          </h3>
          <p className="text-lg font-bold text-[#16c252] dark:text-[#16c252] whitespace-nowrap">
            ${prompt?.price}
          </p>
        </div>

        <Divider className="bg-gray-200 dark:bg-[#ffffff32]" />

        {/* Shop Info and Rating */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Avatar
              src={prompt?.shop?.avatar}
              size="sm"
              className="w-7 h-7 flex-shrink-0"
              isBordered
            />
            <span className="text-sm text-[#475569] dark:text-[#b4b4b4] truncate font-medium">
              @{prompt?.shop?.name}
            </span>
          </div>
          <RatingStars rating={prompt?.rating || 0} size={14} />
        </div>

        {/* CTA Button - Pinned to Bottom */}
        <div className="mt-auto pt-2">
          <Link href={`/prompt/${prompt.id}`} className="block w-full">
            <Button variant="primary" className="w-full" size="md">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Get Prompts
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default PromptCard;
