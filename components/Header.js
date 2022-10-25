import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Header() {

    const [country, setCountry] = useState('loading...');
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

    useEffect(() => {
        fetch(`https://geolocation-db.com/json/${process.env.NEXT_PUBLIC_GEOLOCATION_KEY}`)
        .then(response => {
            if(response.ok) {
                return response.json();
            }

            throw response;
        })
        .then(data => {
            setCountry(data.country_name);
        })
        .catch(error => {
            setCountry("undefined");
        })

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
            field: `${country} ${date.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
            })}`,
        }
    ];
    return (
        <>
            <nav className="flex flex-col gap-4 md:flex md:flex-row md:justify-between border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]">
                {headerDetails.map((item, index) => 
                    <div key={index} className={`${index !== 0 ? "md:border-l pl-4 md:border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]" : "pl-4"}`}>
                        <p  className=" text-sm text-[#8C8C8C]">//{item.label}</p>
                        {index === 1 || index === 2 ?
                            <Link key ={index} href={item.link} passHref>
                                <a target="_blank" className="text-base text-[#141414] dark:text-white dark:text-opacity-[.87]">{item.field}</a> 
                                
                            </Link>:
                            <p className="text-base text-[#141414] dark:text-white dark:text-opacity-[.87]">{item.field}</p>
                        }
                        
                    </div>
                )}
            </nav>
        </>
    )
}