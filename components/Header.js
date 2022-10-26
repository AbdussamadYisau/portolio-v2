import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Header() {

    const [date, setCurrentDate] = useState(new Date());

    function refreshClock() {
        setCurrentDate(new Date());
      }
      useEffect(() => {
        const timerId = setInterval(refreshClock, 1000);
        return function cleanup() {
          clearInterval(timerId);
        };
      }, []);

    const headerDetails = [
        {
            label: "portfolio",
            field: "sammie_boy.dev"
        }, 
        {
            label: "email",
            field: "sammieyisau@gmail.com",
            link: "mailto:sammieyisau@gmail.com "
        }, 
        {
            label: "github",
            field: "https://github.com/AbdussamadYisau",
            link: "https://github.com/AbdussamadYisau"
        },
        {
            label: "location",
            field: `Lagos, Nigeria`,
        },
        {
            label: "time",
            field: `${date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
            })}`
        }
    ];
    return (
        <>
            <nav className="flex flex-col gap-4 md:flex md:flex-row md:justify-between border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]">
                {headerDetails.map((item, index) => 
                    <div key={index} className={`${index !== 0 ? "md:border-l pl-4 md:border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]" : "pl-4"} ${index === 1 || index ===2 ? "hidden md:block" : "block"}`}>
                        <p  className={`text-sm text-[#8C8C8C] ${index === 1 || index ===2 ? "hidden md:block" : "block"}`}>//{item.label}</p>
                        {index === 1 || index === 2 ?
                            <div className="md:inline-block w-full text-ellipsis overflow-hidden hidden">
                            <Link key ={index} href={item.link} passHref className="text-base text-[#141414] dark:text-white dark:text-opacity-[.87]">
                                {item.field}
                            </Link>
                            </div>
                            
                            :
                            <p className="text-base text-[#141414] dark:text-white dark:text-opacity-[.87]">{item.field}</p>
                        }
                        
                    </div>
                )}
            </nav>
        </>
    )
}