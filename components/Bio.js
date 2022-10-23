import Image from "next/image";
import Typed from "typed.js";
import { useEffect, useRef } from "react";

export default function Bio() {
     // Create Ref element.
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Yisau Abdussamad"], // Strings to display
      // Speed settings, try diffrent values untill you get good results
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      showCursor: false,
      
    });

    // Destropying
    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-start gap-8 border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12] pt-14">
        <div>
          <Image
            src="/profilePic.jpeg"
            width={"169px"}
            height={"169px"}
            className="rounded-full"
          />
        </div>

        <div className="pt-8">
          {/* <h1 className="text-6xl dark:text-white">{`<Yisau Abdussamad>`}</h1> */}
          <h1 className="text-6xl dark:text-white" ref={el}></h1>
          <p className="text-2xl text-[#8C8C8C]">//fullstack developer</p>
        </div>
      </div>

      <div className="border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]">
        <p className="text-[16px] text-[#8C8C8C]">//about</p>
        <p className="text-[16px] pt-[24px] text-[#1F1F1F] dark:text-[#FFFFFF]">
          hi, i’m Abdussamad, my friends call me sammie. i enjoy building <br />{" "}
          dynamic, creative products from start to finish, focused on <br />{" "}
          developing intuitive experiences that constantly grow and improve{" "}
          <br /> based on user metrics.
        </p>
      </div>
    </div>
  );
}
