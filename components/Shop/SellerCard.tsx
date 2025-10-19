import { styles } from "@/utils/styles";
import { Avatar, Card, Skeleton } from "@nextui-org/react";
import React from "react";
import { RatingStars } from "@/components/ui/rating-stars";
import { Package } from "lucide-react";

type Props = {
  item?: any;
  loading: boolean;
};

const SellerCard = ({ item, loading }: Props) => {
  return (
    <Card className="flex flex-col items-center py-6 px-4 bg-[#14101a] m-3 w-full md:w-[31%] 2xl:w-[23%] min-h-[240px] text-white border border-white/10 rounded-2xl">
      {loading ? (
        <>
          <Skeleton className="w-[80px] h-[80px] rounded-full" />
          <br />
          <Skeleton className="w-[90%] rounded-xl h-[20px]" />
          <br />
          <Skeleton className="w-[90%] rounded-xl h-[20px]" />
        </>
      ) : (
        <>
          <Avatar
            src={item?.avatar}
            className="w-[80px] h-[80px] text-large mb-3"
            isBordered
            color="success"
          />
          <span className="text-xl font-semibold text-white mb-1">
            @{item?.name}
          </span>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-zinc-400">{item?.ratings}/5</span>
            <RatingStars rating={item?.ratings || 0} size={16} />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Package className="w-4 h-4" />
            <span>Total Sales: {item?.allProducts}</span>
          </div>
        </>
      )}
    </Card>
  );
};

export default SellerCard;
