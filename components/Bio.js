import Image from "next/image";
import Typed from "typed.js";
import { useEffect, useRef } from "react";


export default function Bio() {
     // Create Ref element.
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["&lt;Yisau Abdussamad&gt;"], // Strings to display
      // Speed settings, try diffrent values untill you get good results
      startDelay: 300,
      typeSpeed: 200,
      backSpeed: 100,
      backDelay: 100,
      showCursor: true,
      autoInsertCss: true
    });

    
    // Destropying
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col justify-items-center gap-6 w-full">
      <div className="flex flex-col justify-center md:flex-row md:justify-start gap-8 border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12] pt-14">
        <div className="flex justify-center">
          <Image
            src="/profilePic.jpeg"
            width={"169px"}
            height={"169px"}
            className="rounded-full text-center"
          />
        </div>

        <div className="pt-8 flex flex-col items-center md:items-start">
          <div className="flex flex-row">
          <span className="text-2xl md:text-6xl dark:text-white dark:text-opacity-[.87]" ref={el}></span>
          </div>
          <p className="text-2xl text-[#8C8C8C]">//fullstack developer</p>
        </div>
      </div>

      <div className="border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]">
        <p className="text-[16px] text-[#8C8C8C]">//about</p>
        <p className="text-[16px] pt-[24px] text-[#1F1F1F] dark:text-[#FFFFFF] dark:text-opacity-[.87] w-full">
          hi, i’m abdussamad, my friends call me sammie. i enjoy building <br />{" "}
          dynamic, creative products from start to finish, focused on <br />{" "}
          developing intuitive experiences that constantly grow and improve{" "}
          <br /> based on user metrics.
        </p>
      </div>
    </div>
  );
}
