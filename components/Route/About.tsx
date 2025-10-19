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
        <Chip className={`${styles.button} mb-[30px] h-[37px] bg-[#12211f]`}>
          AI Prompts
        </Chip>
        <h5 className={`${styles.heading} mb-5 !leading-[50px]`}>
          Sell Prompts for Any AI Platform
        </h5>
        <p className={`${styles.paragraph} pb-5`}>
          Our marketplace supports prompts for ChatGPT, Midjourney, DALL-E, Claude, Stable Diffusion, and more. Whether you create prompts for text generation, image creation, code assistance, or creative writing—turn your expertise into income by selling to thousands of AI enthusiasts.
        </p>
        <Button
          className={`${styles.button} bg-[#2551b0] font-[500] h-[45px]`}
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
