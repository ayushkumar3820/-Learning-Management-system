import Image from "next/image";
import React, { FC } from "react";
import { BiSearch } from "react-icons/bi";
import Link from "next/link";

type Props = {};

const Hero: FC<Props> = () => {
  return (
    <div className="w-full flex items-center bg-[#0e0e1c] text-white p-8 relative">
      <div className="w-1/2 relative flex justify-center items-center">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-900 rounded-full opacity-50" />
        <div className="relative z-10">
          <Image
            src={require("../../../../public/assets/Banner.jpg")}
            alt="Banner"
            className="object-contain max-w-full h-auto"
          />
        </div>
      </div>
      <div className="w-1/2 pl-8 z-20">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Improve Your Online Learning Experience Better Instantly
        </h1>
        <p className="mb-6 text-gray-300">
          We have 40k+ Online courses & 500K+ Online registered students. Find your desired Courses from them.
        </p>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search Courses..."
            className="w-full py-3 px-4 pr-12 rounded-lg bg-[#1e1e2d] text-white"
          />
          <button className="absolute right-0 top-0 bg-[#39c1f3] p-3 rounded-r-lg">
            <BiSearch size={24} color="white" />
          </button>
        </div>
        <div className="flex items-center">
          <div className="flex -space-x-4 mr-4">
            {[1, 2, 3].map((i) => (
              <Image
                key={i}
                src={`/assets/client-${i}.jpg`}
                alt={`Client ${i}`}
                width={40}
                height={40}
                className="rounded-full border-2 border-white"
              />
            ))}
          </div>
          <p className="text-sm">
            500K+ People already trusted us.{' '}
            <Link href="/courses" className="text-green-400 hover:underline">
              View Courses
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
