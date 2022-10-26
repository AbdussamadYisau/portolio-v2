import Link from "next/link";

export default function Links() {
  const linksInfo = [
    {
      title: "twitter",
      link: "https://twitter.com/SammieYisau",
    },
    {
      title: "linkedin",
      link: "https://www.linkedin.com/in/abdussamad-yisau-915298154/",
    },
    {
      title: "github",
      link: "https://github.com/AbdussamadYisau",
    },
  ];
  return (
    <div className="border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12] pt-10">
      <p className="text-[16px] text-[#8C8C8C]">//links</p>
        <div className="pt-[16px]">
        {linksInfo.map((experience, index) => (
          <div
          key={index}
          className="flex flex-col lg:flex-row lg:gap-[200px] mb-[20px]"
            
          >
            <p className="text-[16px] text-[#595959] xl:pb-[0px] w-[200px]">
              {experience.title}
            </p>

            <div className="inline-block md:inline md:pl-[56px] w-[200px] text-ellipsis overflow-hidden md:w-full">

            <Link key={index} href={experience.link} passHref className="text-[16px] text-[#262626] dark:text-white dark:text-opacity-[.87]">
            <a className="hover:underline hover:underline-offset-8" target="_blank"> 
            {`${experience.link} `}{" "}
            </a>
            </Link>
            </div>
            

          </div>
        ))}
      </div>
      </div>
  );
}
