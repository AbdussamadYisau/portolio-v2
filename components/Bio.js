import Image from "next/image";
import Typed from "typed.js";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";


export default function Bio() {
  const {theme} = useTheme();
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
      autoInsertCss: true,
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
            width={169}
            height={169}
            alt="Profile Image"
            className="rounded-full text-center"
          />
        </div>

        <div className="pt-8 flex flex-col items-center md:items-start">
          <div className="flex flex-row">
            <span
              className="text-xl md:text-6xl dark:text-white dark:text-opacity-[.87]"
              ref={el}
            ></span>
          </div>
          <p className="text-xl md:text-2xl text-[#8C8C8C]">
            //fullstack developer
          </p>
        </div>
      </div>

      <div className="border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]">
        <p className="text-[16px] text-[#8C8C8C]">//about</p>
        <p className="text-[16px] pt-[24px] text-[#1F1F1F] dark:text-[#FFFFFF] dark:text-opacity-[.87] w-full md:w-2/4">
          hi, i’m abdussamad, my friends call me sammie. i enjoy consuming,
          dissecting and creating experiences- that could be anything from {" "}
          <span className={`${theme === 'dark' ? 'hover-underline-dark-animation' : 'hover-underline-animation'} md:inline text-ellipsis overflow-hidden`}>
          <Link href={'https://en.wikipedia.org/wiki/Grey%27s_Anatomy'} passHref target={"_blank"}>
         
            watching Grey’s anatomy,
          
          </Link>
          </span> <span className={`${theme === 'dark' ? 'hover-underline-dark-animation' : 'hover-underline-animation'} md:inline text-ellipsis overflow-hidden`}>
            <Link href={'https://open.spotify.com/track/2lEl1iNGpz9r2B7R5BqXSD?si=2121edee44ea4e79'} passHref legacyBehavior>
           
            listening to Yé, 
            </Link></span> discussing the concept of
          eternity with friends to curating and building visually stunning and performant mobile applications,
          websites etc.
        </p>
      </div>
    </div>
  );
}
