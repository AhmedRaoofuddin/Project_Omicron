import MarketPlaceRouter from "./_page";
import { getUser } from "@/actions/user/getUser";

const Page = async () => {
  const data = await getUser();

  return (
    <div>
      <MarketPlaceRouter
        user={data?.user as any}
        isSellerExist={data?.shop ? true : false}
      />
    </div>
  );
};

export default Page;
