import { FaLocationArrow } from "react-icons/fa6";
import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";
import Image from "next/image";
// import * as Sentry from "@sentry/nextjs";

const Footer = () => {
  return (
    <footer
      className="w-full pt-20 pb-10 relative overflow-hidden"
      id="contact"
    >
      {/* background grid - reduced opacity for a more subtle midnight look */}
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

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center relative z-10 gap-6">
        <p className="md:text-base text-sm md:font-normal font-light text-blue-100/70">
          Copyright © 2025{" "}
          <span className="text-blue-400 font-medium">Yamlak Negash</span>
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <a
              key={info.id}
              href={info.link}
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <div className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-[#0c0e23] rounded-lg border border-white/[0.1] transition-all duration-300 group-hover:border-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <Image
                  src={info.img}
                  alt="social icon"
                  width={20}
                  height={20}
                  className="group-hover:brightness-125 transition-all"
                />
              </div>
            </a>
          ))}

          {/* Sentry Bug Report Button - Commented out as requested */}
          {/* <button
            className="ml-4 cursor-pointer px-4 py-2 rounded-lg bg-white text-black hover:bg-blue-600 hover:text-white transition-all font-medium text-sm"
            onClick={() => Sentry.showReportDialog()}
            type="button"
          >
            Report a Bug
          </button> 
          */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;