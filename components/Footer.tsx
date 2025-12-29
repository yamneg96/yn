"use client";

import { useState, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";
import Image from "next/image";

const Footer = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const currentItem = socialMedia[activeIndex];

    const timer = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % socialMedia.length);
    }, currentItem.duration);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <footer
      className="w-full pt-20 pb-10 relative overflow-hidden"
      id="contact"
    >
      {/* Background Grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-60 dark:opacity-30"
        />
      </div>

      <div className="flex flex-col items-center relative z-10">
        <h1 className="heading lg:max-w-[45vw] text-center">
          Ready to take <span className="text-blue-400">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-blue-100/80 md:mt-10 my-5 text-center max-w-xl leading-relaxed">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals through modern web solutions and AI integration.
        </p>
        <a href="mailto:yamlaknegash96@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
            otherClasses="!bg-[#000319]"
          />
        </a>
      </div>

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center relative z-10 gap-8">
        <p className="md:text-base text-sm md:font-normal font-light text-blue-100/70">
          Copyright © 2025{" "}
          <span className="text-blue-400 font-medium">Yamlak Negash</span>
        </p>

        {/* Social Media Container */}
        <div className="flex flex-col items-center md:items-end gap-3 min-w-[300px]">
          {/* Icons Row */}
          <div className="flex items-center md:gap-3 gap-6">
            {socialMedia.map((info, idx) => (
              <a
                key={info.id}
                href={info.link}
                target="_blank"
                rel="noreferrer"
                className="relative group"
              >
                <div
                  className={`w-10 h-10 flex justify-center items-center backdrop-filter backdrop-blur-lg rounded-lg border transition-all duration-500 ${
                    activeIndex === idx
                      ? "border-blue-400 bg-blue-400/20 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "border-white/[0.1] bg-[#0c0e23] opacity-60 group-hover:opacity-100"
                  }`}
                >
                  <Image
                    src={info.img}
                    alt={info.name}
                    width={20}
                    height={20}
                    className={`${activeIndex === idx ? "brightness-125" : ""}`}
                  />
                </div>

                {/* Visual Connector: Pulsing dot under active icon */}
                {activeIndex === idx && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                  </div>
                )}
              </a>
            ))}
          </div>

          {/* Rotating Text Area: Spans width of icons */}
          <div className="h-6 overflow-hidden w-full flex justify-center md:justify-end">
            <p
              key={activeIndex}
              className="text-blue-400 text-xs md:text-sm font-medium animate-slide-up-fade tracking-wide"
              style={{
                animationDuration: `${socialMedia[activeIndex].duration}ms`,
              }}
            >
              {socialMedia[activeIndex].label}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
