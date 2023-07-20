import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import Head from "next/head";


function MyApp({ Component, pageProps }) {
  return (
      <ThemeProvider enableSystem={false} attribute="class">
      <Head>
      <meta charset="utf-8" />
        <title>Portfolio - Abdussamad Yisau </title>

        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="title" content="Abdussamad Yisau's Portfolio" />
        <meta
          name="description"
          content="I specialize in creating functional and aesthetically pleasing web and mobile experiences with a focus on clean, responsive, and pleasing content."
        />
        <meta name="copyright" content="Abdussamad Yisau" />
        <meta name="keywords" content="Abdussamad, Yisau" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://abdussamadyisau.com" />
        <meta property="og:title" content="Abdussamad Yisau's Portfolio" />
        <meta
          property="og:description"
          content="I specialize in creating functional and aesthetically pleasing web and mobile experiences with a focus on clean, responsive, and pleasing content."
        />
        <meta
          property="og:image"
          content="http://res.cloudinary.com/dpu5ywrox/image/upload/v1668519120/tikakodokf8wdlzssc4c.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://abdussamadyisau.com" />
        <meta property="twitter:title" content="Abdussamad Yisau's Portfolio" />
        <meta
          property="twitter:description"
          content="I specialize in creating functional and aesthetically pleasing web and mobile experiences with a focus on clean, responsive, and pleasing content."
        />
        <meta
          property="twitter:image"
          content="http://res.cloudinary.com/dpu5ywrox/image/upload/v1668519120/tikakodokf8wdlzssc4c.png"
        />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
