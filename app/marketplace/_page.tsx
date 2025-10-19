"use client";

import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import ShopBanner from "@/components/Shop/ShopBanner";
import { User } from "@clerk/nextjs/server";
import { Divider, Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import FilterPrompt from "@/components/Prompts/FilterPrompt";
import { useRouter } from "next/navigation";
import PromptCard from "@/components/Prompts/PromptCard";
import PromptCardLoader from "@/utils/PromptCardLoader";

const MarketPlaceRouter = ({
  user,
  isSellerExist,
}: {
  user: User | undefined;
  isSellerExist: boolean;
}) => {
  const [isMounted, setisMounted] = useState(false);
  const [initialPage, setInitialPage] = useState(1);
  const [prompts, setPrompts] = useState<any>();
  const [totalPrompts, setTotalPrompts] = useState<any>();
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchPromptsData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-prompts?page=${initialPage}`);
      const data = await response.json();
      setPrompts(data.prompts);
      setTotalPrompts(data.totalPrompts);
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) {
      setisMounted(true);
    }
  }, [isMounted]);

  useEffect(() => {
    if (initialPage) {
      router.push(`/marketplace?page=${initialPage}`);
    }
  }, [initialPage, router]);

  useEffect(() => {
    fetchPromptsData();
  }, [initialPage]);

  if (!isMounted) {
    return null;
  }

  const paginationsPages = totalPrompts && Math.ceil(totalPrompts.length / 8);

  return (
    <>
      <div className="shop-banner">
        <Header activeItem={2} user={user} isSellerExist={isSellerExist} hasDarkBanner={true} />
        <ShopBanner title="Our Shop" />
      </div>
      <div className="bg-[var(--bg-primary)] min-h-screen">
        <div className="w-[95%] md:w-[90%] xl:w-[85%] 2xl:w-[80%] m-auto">
          <div>
            <div className="w-full pt-8">
              <FilterPrompt
                setPrompts={setPrompts}
                totalPrompts={totalPrompts}
              />
            </div>
            <div className="w-full flex flex-wrap mt-5">
              {loading ? (
                [...new Array(8)].map((i, index) => (
                  <PromptCardLoader key={index} />
                ))
              ) : (
                <>
                  {prompts &&
                    prompts.map((item: any) => (
                      <PromptCard prompt={item} key={item.id} />
                    ))}
                </>
              )}
            </div>
            <div className="w-full flex items-center justify-center mt-5 mb-8">
              {!loading && (
                <Pagination
                  loop
                  showControls
                  total={paginationsPages}
                  initialPage={initialPage}
                  classNames={{
                    wrapper: "mx-2",
                    item: "mx-2 bg-[var(--card-bg)] dark:bg-gray-800 text-[var(--text-primary)] border border-[var(--border-color)]",
                    cursor: "bg-[var(--accent-primary)] dark:bg-[#16c252] text-white font-semibold",
                    next: "bg-[var(--card-bg)] dark:bg-gray-800 text-[var(--text-primary)] border border-[var(--border-color)]",
                    prev: "bg-[var(--card-bg)] dark:bg-gray-800 text-[var(--text-primary)] border border-[var(--border-color)]",
                  }}
                  onChange={setInitialPage}
                />
              )}
            </div>
            <Divider className="bg-[var(--border-color)] mt-5" />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketPlaceRouter;
