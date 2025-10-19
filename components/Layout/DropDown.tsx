import { styles } from "@/utils/styles";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { GrDocumentStore } from "react-icons/gr";
import { AiOutlineLogout } from "react-icons/ai";
import { TbSwitchVertical } from "react-icons/tb";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { config } from "@/lib/config";

type Props = {
  user: any; // Generic user object (works with both Clerk and demo)
  setOpen: (open: boolean) => void;
  handleProfile: () => void;
  isSellerExist?: boolean;
};

const DropDown = ({ user, setOpen, handleProfile, isSellerExist }: Props) => {
  const router = useRouter();
  
  const handleLogOut = async () => {
    if (config.demo) {
      // Demo mode logout
      try {
        await fetch('/api/dev-auth/logout', { method: 'POST' });
        toast.success('Logged out');
        router.push("/");
        router.refresh();
      } catch (error) {
        toast.error('Logout failed');
      }
    } else {
      // Production: would use Clerk
      router.push("/sign-in");
    }
  };
  return (
    <Dropdown placement="bottom-start" className="bg-white z-[150]">
      <DropdownTrigger>
        <Avatar
          src={user?.imageUrl}
          alt=""
          className="w-[40px] h-[40px] cursor-pointer"
          isBordered
          color="success"
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem
          key="profile"
          onClick={() => {
            handleProfile();
            setOpen(false);
          }}
        >
          <div className="flex w-full items-center">
            <Avatar
              src={user?.imageUrl}
              alt=""
              className="w-[30px] h-[30px] cursor-pointer"
              size="sm"
            />
            <span className={`${styles.label} text-black text-[16px] pl-2`}>
              My Profile
            </span>
          </div>
        </DropdownItem>
        <DropdownItem key="orders">
          <Link href={"/my-orders"} className="flex w-full items-center">
            <GrDocumentStore className="text-[22px] ml-2 text-black" />
            <span className={`${styles.label} text-black text-[16px] pl-2`}>
              My Orders
            </span>
          </Link>
        </DropdownItem>
        <DropdownItem key="seller" className={`${!isSellerExist && "hidden"}`}>
          <Link href={"/my-shop"} className="flex w-full items-center">
            <TbSwitchVertical className="text-2xl ml-2 text-black" />
            <span className={`${styles.label} text-black text-[16px] pl-2`}>
              Switching to Seller
            </span>
          </Link>
        </DropdownItem>
        <DropdownItem key="logout" onClick={handleLogOut}>
          <div className="flex items-center w-full">
            <AiOutlineLogout className="text-2xl ml-2 text-black" />
            <span className={`${styles.label} text-black text-[16px] pl-2`}>
              Log out
            </span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDown;
