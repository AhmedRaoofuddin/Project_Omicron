import { styles } from "@/utils/styles";
import Image from "next/image";
import React from "react";

const ShopBanner = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative z-10">
      <div>
        <Image
          src={
            "https://pixner.net/aikeu/assets/images/banner/cmn-thumb-left.png"
          }
          width={180}
          height={180}
          alt=""
          className="absolute top-1 left-10"
        />
      </div>
      <h4
        className="text-4xl xl:text-6xl 2xl:text-7xl font-[700] font-Monserrat text-white drop-shadow-lg"
      >
        {title}
      </h4>
      <div>
        <Image
          src={
            "https://pixner.net/aikeu/assets/images/banner/cmn-thumb-right.png"
          }
          width={180}
          height={180}
          alt=""
          className="absolute right-10"
        />
      </div>
    </div>
  );
};

export default ShopBanner;
