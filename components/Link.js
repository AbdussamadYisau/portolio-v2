import Link from "next/link";


export default function Links() {
  const linksInfo = [
    {
        title: "twitter",
        link: "https://twitter.com/SammieYisau"
    },
    {
        title: "linkedin",
        link: "https://www.linkedin.com/in/abdussamad-yisau-915298154/"
    },
    {
        title: "github",
        link: "https://github.com/AbdussamadYisau"
    }

  ]
  return (
    <div className="flex flex-col gap-6 border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12] pt-10">
    <p className="text-[16px] text-[#8C8C8C]">//links</p>

    <div className="pt-[16px]">
      {linksInfo.map((experience, index) => (
        <div
          key={index}
          className={`flex flex-row justify-start gap-x-[158px] pb-[40px]
           `}
        >
          <p className="text-[16px] text-[#595959] w-[245px]">
            {experience.title}
          </p>
          <div>
            <Link key={index} href={experience.link} passHref className="text-[16px] text-[#262626] dark:text-white">
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
