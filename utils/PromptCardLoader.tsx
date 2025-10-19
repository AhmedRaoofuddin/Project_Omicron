import { Card, Skeleton } from "@nextui-org/react";

const PromptCard = () => {
  return (
    <Card
      radius="lg"
      className="w-full md:w-[31%] 2xl:w-[23%] p-4 bg-white dark:bg-[#130f23] m-3 border-2 border-gray-200 dark:border-[#ffffff32]"
      style={{ height: "410px" }}
    >
      <div className="relative">
        <Skeleton className="rounded-xl" style={{ height: "250px" }}>
          <div className="w-full h-[250px]"></div>
        </Skeleton>
        <br />
        <div className="flex justify-between">
          <Skeleton className="flex rounded-full w-12 h-12" />
          <div className="w-[80%]">
            <Skeleton
              className="rounded-xl"
              style={{ height: "40px" }}
            ></Skeleton>
          </div>
        </div>
        <br />
        <Skeleton className="rounded-xl" style={{ height: "30px" }}></Skeleton>
      </div>
    </Card>
  );
};

export default PromptCard;
