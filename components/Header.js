import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  let options = {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hourCycle: "h12",
    },
    formatter = new Intl.DateTimeFormat([], options);

  const [date, setCurrentDate] = useState(new Date());
  const [myDate, setMyCurrentDate] = useState(formatter.format(new Date()));

  function refreshClock() {
    setCurrentDate(new Date());
    setMyCurrentDate(formatter.format(new Date()));
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
      field: ".ay",
      link: "https://abdussamadyisau.com"
    },
    {
      label: "email",
      field: "sammieyisau@gmail.com",
      link: "mailto:sammieyisau@gmail.com ",
    },
    {
      label: "github",
      field: "https://github.com/AbdussamadYisau",
      link: "https://github.com/AbdussamadYisau",
    },
    {
      label: "location",
      field: `Lagos, Nigeria`,
    },
    {
    //   label: "time",
    label: `${ myDate
        .toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hourCycle: "h12",
        })
        .toLocaleUpperCase() === date.toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }) ? 'time': 'my time'}`,
      field: `${myDate
        .toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hourCycle: "h12",
        })
        .toLocaleUpperCase()}`,
    },
    {
      label: "your time",
      field: `${date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      })}`,
    },
  ];
  return (
    <>
      <nav className="flex flex-col gap-4 lg:flex-row lg:justify-between border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]">
        {headerDetails.map((item, index) => (
          <div
            key={index}
            className={`${
              index === 5 && item.field === headerDetails[4].field
                ? "hidden"
                : ""
            } ${index === 1 || index === 2 ? "hidden md:block" : "block"}`}
          >
            <div
              key={index}
              className={`${
                index !== 0
                  ? "md:border-l pl-4 md:border-[#8C8C8C] dark:border-white dark:border-opacity-[.12]"
                  : "pl-4"
              } ${index === 1 || index === 2 ? "hidden md:block" : "block"}`}
            >
            
                <p
                  className={`text-sm text-[#8C8C8C] ${
                    index === 1 || index === 2 ? "hidden md:block" : "block"
                  }`}
                >
                  //{item.label}
                </p>
              

              {index === 0 ||index === 1 || index === 2 ? (
                <div className={` ${index === 0 ? '': 'hidden md:inline-block'}  w-full text-ellipsis overflow-hidden `}>
                  <Link
                    key={index}
                    href={item.link}
                    passHref
                    className="text-base text-[#141414] dark:text-white dark:text-opacity-[.87]"
                  >
                    {item.field}
                  </Link>
                </div>
              ) : (
                <p className="text-base text-[#141414] dark:text-white dark:text-opacity-[.87]">
                  {item.field}
                </p>
              )}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}
