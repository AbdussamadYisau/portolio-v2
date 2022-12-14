import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Bio from "../components/Bio";
import Experience from "../components/Experience";
import Links from "../components/Link";
import Box from "../components/Box";
import Credit from "../components/Credit";
import Head from "next/head";
import CustomCursor from "../components/Cursor";


export default function Home() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentHour = currentDate.getHours();

  function refreshClock() {
    setCurrentDate(new Date());
  }
  useEffect(() => {
    const timerId = setInterval(refreshClock, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  const renderThemeChanger = () => {
    if (currentHour <= 7 || currentHour >= 18) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    setMounted(true);
    renderThemeChanger();
  }, [currentDate]);

  if (!mounted) {
    return;
  }
  return (

      
    <div className=" bg-[#D7D7D7] dark:bg-[#121212] pr-[32px] pl-[32px] pt-[35px] md:pr-[60px] pb-[20px] md:pl-[60px]">

      <CustomCursor />
      
      <Head>
        <meta charset="utf-8" />
        <title>Portfolio - Abdussamad Yisau </title>

        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content="https://twitter.com/SammieYisau" key="twhandle" />

        {/* Open Graph */}
        <meta property="og:url" content="https://www.abdussamadyisau.com/" key="ogurl" />
        <meta property="og:image" content="https://www.abdussamadyisau.com/og.png" key="ogimage" />
        <meta property="og:site_name" content="https://www.abdussamadyisau.com/" key="ogsitename" />
        <meta property="og:title" content="Portfolio - Abdussamad Yisau" key="ogtitle" />
        <meta property="og:description" content="Specializing in creating functional and aesthetically pleasing web and mobile experiences with a focus on clean, responsive, and pleasing content." key="ogdesc" />
        <meta
          name="google-site-verification"
          content="b2HLy-GQf8r8A5X04Rq0ZfE-RzOLielb8NSRSKCSrBc"
        />

        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />

      <Bio />

      <Experience />

      <Links />

      <Box />

      <Credit />
    </div>
  );
}
