import Link from "next/link";
import React from "react";

type Props = {
  activeItem: number;
  isScrolled?: boolean;
  hasDarkBanner?: boolean;
};

const navItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About Us",
    href: "/about",
  },
  {
    title: "Marketplace",
    href: "/marketplace",
  },
  {
    title: "Contact Us",
    href: "/contact",
  },
  {
    title: "Policy",
    href: "/policy",
  },
];

const Navigation = ({ activeItem, isScrolled = false, hasDarkBanner = false }: Props) => {
  return (
    <div className="block md:flex">
      {navItems.map((item, index) => (
        <Link key={item.title} href={item.href}>
          <h5
            className={`inline-block md:px-4 xl:px-8 py-5 md:py-0 text-[18px] font-[600] font-Inter transition-colors duration-200 ${
              activeItem === index 
                ? "text-[#16c252] dark:text-[#16c252]" 
                : !isScrolled && hasDarkBanner
                  ? "text-white hover:text-[#16c252] drop-shadow-md"
                  : "text-[var(--text-primary)] hover:text-[#16c252]"
            }`}
          >
            {item.title}
          </h5>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
