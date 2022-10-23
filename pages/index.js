import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Bio from '../components/Bio'


export default function Home() {
  const {systemTheme, theme, setTheme} =  useTheme();
  const [mounted, setMounted] = useState(false);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
 

  const renderThemeChanger = () => {
    if (currentHour <= 6 || currentHour >= 18) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }

  useEffect(() => {
    setMounted(true);
    renderThemeChanger();
  }, []);

    if (!mounted) {
      return ;
    }
  return (
    <div>
      <Head>
        <title>Sammie Yisau's portfolio</title>
        <meta name="description" content="A portfolio for Sammie Yisau" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap" rel="stylesheet"/>
      </Head>

      <Header />

      <Bio />

    </div>
  )
}
