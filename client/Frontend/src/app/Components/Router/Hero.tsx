import Image from "next/image";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";

type Props = {};

const Hero: FC<Props> = (props) => {
  return (
    <div className="w-full  1000px:flex  items-center">
      <div className="absolute top-[100px]  1000px:top-[unset]  1500px:h-[700px]  1500px:w-[700px]  1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh]  hero-animation router">
        <div className="1000px:w-[40%]  flex  1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10 ">
          <Image
            src={require("../../../../public/assests/Banner.png.jpg")}
            alt="Banner"
            className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%]  h-[auto]  z-[10]"
            priority
          />
        </div>
        <div className="1000px:w-[60%] flex  flex-col  items-center  1000px:mt-[0px]  text-center 1000px:text-left  mt-[150px] ">
          <h2 className="text-[#000000c7] dark:text-white text-[30px] px-3 w-full 1000px:text-[70px] font-[600]  font-Josefin py-2  1000px:leading-[75px]  1500px:w-[600px] h-[600px] ">
            Improve Your Online Learning Experience Better Instantly
          </h2>
          <br />
          <p className="text-[#0000ac] dark:text-[#edfff4] font-josefin  font-[600]  text-[18px]  1500px:!w-[55%] 1100px:!w-[78%] ">
            We Have 40k+ Online courses and & 500k+ Online registered students.
            Find Your desired Course from them.
          </p>
          <br />
          <br />
          <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] h-[50px] bg-transparent relative ">
            <input
              type="search"
              placeholder="Search Courses..."
              className=" bg-transparent border dark:border-none dark:bg-[#575757]  dark:placeholder:text-[#ffffffdd] rounded-[5px] p-2  w-full h-full outline-none  text-[#0000004e]  dark:text-[#ffffffe6] text-[20px] font-[500] font-Josefin"
            />
            <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0  bg-[#39c1f3] rounded-r-[5px] ">
              <BiSearch className="text-white" size={30} />
            </div>
          </div>
          <br />
          <br />
          <div className="1500px:w-[55%] 1100px:w-[78%]  w-[90%]  flex items-center">
            <Image
              src={require("../../../../public/assests/client-1.png.jpg")}
              alt="Client 1"
              className="rounded-full"
            />
            <Image
              src={require("../../../../public/assests/client-2.png.jpg")}
              alt="Client 2"
              className="rounded-full ml-[-20px]"
            />
            <Image
              src={require("../../../../public/assests/client-3.png.jpg")}
              alt="Client 3"
              className="rounded-full ml-[-20px]"
            />
            <p className="font-Josefin dark:text-[#edfff4] text-[#000000b3]  1000px:pl-3 text-[18px] font-[600] ">
              500k+ People already trusted us.{}
              <Link
                href="/cousers"
                className="dark:text-[#46e256]  text-[crimson] "
              >
                View Courses
              </Link>
              {""}
            </p>
          </div>
        </div>
        <br/>
      </div>
    </div>
  );
};

export default Hero;
