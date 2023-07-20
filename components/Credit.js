import { useTheme } from "next-themes";
import Link from "next/link";



export default function Credit() {
  const {theme} = useTheme();
    return (
      <div className="flex w-full flex-col text-center items-center md:flex-row justify-center md:gap-x-4 mb-[40px]">
        <p className="text-[#595959]">designed by <span className={`${theme === 'dark' ? 'hover-underline-dark-animation' : 'hover-underline-animation'}`}>
          <Link href={`https://pelumiabimbola.webflow.io/`} passHref target={"_blank"}> 
         oluwapelumi abimbola
           
          </Link>
          </span></p>
        <p className="text-[#595959] hidden md:inline">|</p>
        <p className="text-[#595959]">developed by yisau abdussamad</p>
      </div>
    );
  }
  