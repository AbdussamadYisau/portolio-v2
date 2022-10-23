import Head from "next/head";
import { useEffect, useState } from "react";


export default function Header() {

    const [country, setCountry] = useState(null);
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
            field: "sammieyisau@gmail.com"
        }, 
        {
            label: "github",
            field: "https://github.com/AbdussamadYisau"
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
        <div>
            <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Space+Mono&display=swap" rel="stylesheet"/>
            </Head>

            <nav className="flex flex-row justify-between border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]">
                {headerDetails.map((item, index) => 
                    <div key={index} className={`${index !== 0 ? "border-l pl-4 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]" : ""}`}>
                        <p  className=" text-sm text-[#8C8C8C]">//{item.label}</p>
                        <p className="text-base text-[#141414] dark:text-white dark:opacity-80">{item.field}</p>
                    </div>
                )}
            </nav>
        </div>
    )
}