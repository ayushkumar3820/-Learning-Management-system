import Link from "next/link";
import React from "react";

export const navItemData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Course",
    url: "/course",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

interface Props {
  activeItem: number;
  isMobile: boolean;
}

const NavItems: React.FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      <div className="hidden 800px:flex">
        {navItemData && navItemData.map((item, index) => (
          <Link href={`${item.url}`} key={index} passHref>
            <span
              className={`
                ${activeItem === index
                  ? "dark:text-[#37a39a] text-[crimson]"
                  : "dark:text-black text-white"
                } 
                text-[18px] px-6 font-poppins font-[400]
              `}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>
      {isMobile && (
        <div className="800px:hidden mt-5">
          <div className="w-full text-center py-6">
            <Link href="/">
              <span className="text-2xl font-poppins font-medium text-black dark:text-white">
                Learning
              </span>
            </Link>
          </div>
          {navItemData.map((item, index) => (
            <Link href={item.url} key={index}>
              <span
                className={`
                  ${activeItem === index
                    ? "text-crimson dark:text-teal-400"
                    : "text-black dark:text-white"
                  }
                  block text-lg px-6 py-2 font-poppins font-normal
                `}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;