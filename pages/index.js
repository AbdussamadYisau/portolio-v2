import Head from "next/head";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Bio from "../components/Bio";
import Experience from "../components/Experience";
import Links from "../components/Link";
import Box from "../components/Box";
import Credit from "../components/Credit";

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
    if (currentHour <= 6 || currentHour >= 18) {
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
    <div>
      <Head>
        <title>Sammie Yisau's portfolio</title>
        <meta name="description" content="A portfolio for Sammie Yisau" />
        <link rel="icon" href="/favicon.ico" />
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
