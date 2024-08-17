'use client'
import React, { FC, useState } from "react";
import Heading from "./utils/Heading";
import { Header } from "./Component/Header";
import Hero from './Component/Router/Hero';
interface Props {}

const Page: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route,SetRoute]=useState("Login");

  return (
    <div>
      <Heading 
        title="Learning" 
        description="Learning is a platform for students to learn and get help from teachers" 
        keywords="Programming, MEAN, Redux, Machine Learning"
      />
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        
      />
      <Hero />
    </div>
  )
};

export default Page;