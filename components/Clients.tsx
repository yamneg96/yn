"use client";

import React from "react";
import { companies, testimonials } from "@/data";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

const Clients = () => {
  return (
    <section id="testimonials" className="py-20 relative overflow-hidden">
      <h1 className="heading">
        Kind words from
        <span className="text-blue-400"> satisfied clients</span>
      </h1>

      <div className="flex flex-col items-center max-lg:mt-10">
        <div className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden">
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-24 mt-10 md:mt-20">
          {companies.map((company) => (
            <div
              key={company.id}
              className="cursor-pointer flex md:max-w-60 max-w-32 gap-3 group"
            >
              <img
                src={company.img}
                alt={company.name}
                className="md:w-10 w-5 group-hover:grayscale-0 transition-all duration-300"
              />
              <img
                src={company.nameImg}
                alt={company.name}
                width={company.id === 4 || company.id === 5 ? 100 : 150}
                className="text-white md:w-24 w-20 opacity-100 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Clients;
