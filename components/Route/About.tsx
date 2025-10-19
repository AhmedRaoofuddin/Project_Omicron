"use client";
import { styles } from "@/utils/styles";
import { Button, Chip } from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const About = (props: Props) => {
  const router = useRouter();

  return (
    <div className="w-full relative grid md:grid-cols-2 md:py-8">
      <div className="col-span-1 w-full md:w-[60%] md:mt-5 px-5 md:px-[unset]">
        <Chip className={`mb-[30px] h-[37px] bg-[var(--bg-secondary)] dark:bg-[#12211f] border border-[var(--border-color)] text-[var(--text-primary)] font-[600] font-Inter`}>
          AI Prompts
        </Chip>
        <h5 className={`text-4xl font-[700] font-Inter mb-5 !leading-[50px] text-[var(--text-primary)]`}>
          Sell Prompts for Any AI Platform
        </h5>
        <p className={`text-[18px] font-[400] text-[var(--text-secondary)] font-Inter pb-5`}>
          Our marketplace supports prompts for ChatGPT, Midjourney, DALL-E, Claude, Stable Diffusion, and more. Whether you create prompts for text generation, image creation, code assistance, or creative writing—turn your expertise into income by selling to thousands of AI enthusiasts.
        </p>
        <Button
          className={`bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] dark:bg-[#2551b0] font-[500] h-[45px] text-white dark:text-white transition-colors font-Inter p-5 rounded-[8px]`}
          onClick={() => router.push("/marketplace")}
        >
          Visit Shop
        </Button>
      </div>
      <div className="col-span-1 my-10 md:mt-[unset]">
        <Image
          src={"https://pixner.net/aikeu/assets/images/craft-thumb.png"}
          alt=""
          width={600}
          height={600}
          priority
        />
      </div>
    </div>
  );
};

export default About;
