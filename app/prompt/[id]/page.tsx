import { getUser } from "@/actions/user/getUser";
import PromptDetailsPage from "./_page";
import { stripePublishableKey } from "@/actions/payment/paymentAction";

const Page = async ({ params }: { params: any }) => {
  const resolvedParams = await params;
  const data = await getUser();
  const publishAbleKey = await stripePublishableKey()!;

  return (
    <div>
      <PromptDetailsPage
        user={data?.user}
        isSellerExist={data?.shop ? true : false}
        publishAbleKey={publishAbleKey}
        promptId={resolvedParams.id}
      />
    </div>
  );
};

export default Page;
