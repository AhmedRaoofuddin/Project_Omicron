import Link from "next/link";
import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import { AiOutlineSearch } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaBars } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { UserProfile } from "@clerk/nextjs";
import DropDown from "./DropDown";
import DemoAuthButton from "../Auth/DemoAuthButton";
import ThemeToggle from "./ThemeToggle";

const isDemoMode = typeof window !== 'undefined' 
  ? window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  : true; // Assume demo mode on server

type Props = {
  activeItem: number;
  user: any;
  isSellerExist: boolean | undefined;
  hasDarkBanner?: boolean; // Add this prop to detect dark hero sections
};

const Header = ({ user, activeItem, isSellerExist, hasDarkBanner = false }: Props) => {
  const [active, setactive] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setactive(true);
      } else {
        setactive(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.id === "screen") {
      setOpen(!open);
    }
  };

  const handleProfile = () => {
    setActiveProfile(!activeProfile);
  };

  return (
    <header
      className="site-header fixed top-0 left-0 right-0 w-full z-[100] isolate"
      style={{
        backgroundColor: !active && hasDarkBanner ? 'rgba(10, 10, 15, 0.3)' : 'var(--header-bg)',
        backdropFilter: active || !hasDarkBanner ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: active || !hasDarkBanner ? 'blur(12px)' : 'none',
      }}
    >
      <div className="w-full p-5 border-b border-b-[var(--border-color)] transition-all duration-300">
      <div className="hidden md:w-[90%] mx-auto md:flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <h1 className={`font-Inter text-3xl cursor-pointer transition-all duration-200 ${
              !active && hasDarkBanner ? "drop-shadow-lg" : ""
            }`}>
              <span className="text-[#16c252] dark:text-[#16c252]">Prompt</span>
              <span className={!active && hasDarkBanner ? "text-white" : "text-[var(--text-primary)]"}>Place</span>
            </h1>
          </Link>
        </div>
        <div className="flex">
          <Navigation activeItem={activeItem} isScrolled={active} hasDarkBanner={hasDarkBanner} />
        </div>
        <div className="flex items-center ml-10 gap-4">
          <AiOutlineSearch className={`text-[25px] cursor-pointer transition-colors ${
            !active && hasDarkBanner ? "text-white drop-shadow-md" : "text-[var(--text-primary)]"
          }`} />
          <ThemeToggle />
          {isDemoMode ? (
            <DemoAuthButton />
          ) : (
            <>
              {user ? (
                <div>
                  <DropDown
                    user={user}
                    setOpen={setOpen}
                    handleProfile={handleProfile}
                    isSellerExist={isSellerExist}
                  />
                </div>
              ) : (
                <Link href="/sign-in">
                  <CgProfile className={`text-[25px] cursor-pointer transition-colors ${
                    !active && hasDarkBanner ? "text-white drop-shadow-md" : "text-[var(--text-primary)]"
                  }`} />
                </Link>
              )}
            </>
          )}
        </div>
      </div>
      {activeProfile && (
        <div className="w-full fixed h-screen overflow-hidden flex justify-center items-center top-0 left-0 bg-[#00000068] z-[200]">
          <div className="w-min relative h-[90vh] overflow-y-scroll bg-white rounded-xl shadow">
            <UserProfile />
            <RxCross1
              className="absolute text-black text-2xl top-10 right-10 cursor-pointer"
              onClick={handleProfile}
            />
          </div>
        </div>
      )}

      {/* for mobile screen */}
      <div className="w-full md:hidden flex items-center justify-between">
        <div>
          <Link href="/">
            <h1 className={`font-Inter text-3xl cursor-pointer transition-all duration-200 ${
              !active && hasDarkBanner ? "drop-shadow-lg" : ""
            }`}>
              <span className="text-[#16c252] dark:text-[#16c252]">Prompt</span>
              <span className={!active && hasDarkBanner ? "text-white" : "text-[var(--text-primary)]"}>Place</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <FaBars
            className={`text-2xl cursor-pointer transition-colors ${
              !active && hasDarkBanner ? "text-white drop-shadow-md" : "text-[var(--text-primary)]"
            }`}
            onClick={() => setOpen(!open)}
          />
        </div>

        {open && (
          <div
            className="fixed md:hidden w-full h-screen top-0 left-0 z-[150] bg-[#00000050]"
            onClick={handleClose}
            id="screen"
          >
            <div className="fixed bg-[var(--bg-secondary)] h-screen top-0 right-0 w-[60%] z-[160] border-l border-[var(--border-color)] shadow-2xl">
              <div className="mt-20 p-5">
                <Navigation activeItem={activeItem} isScrolled={true} />
                {user && (
                  <DropDown
                    user={user}
                    setOpen={setOpen}
                    handleProfile={handleProfile}
                    isSellerExist={isSellerExist}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

export default Header;
