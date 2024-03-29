import React from "react";
import { Tooltip } from 'react-tooltip'

export default function Experience() {

  const workExperience = [
    {
      name: "Reliance Health",
      link: "https://www.getreliancehealth.com/",
      role: "Frontend Engineer",
      period: "jan 2022 - present",
      tasks: [
        "collaborated with design teams to implement various complex user interfaces to prioritize features for the product releases, whilst improving user engagement and retention, resulting in a 20% and 15% increase respectively.",
        "migrated endpoints architecture from monolith to microservices, improving scalability and performance",
        "developed and implemented consultations feature for Telemedicine Platform, which allow 16,000 consultations per month across Nigeria and Egypt for patients from the comfort of their homes.",
      ],
      tools: ["react.js", "next.js", "redux", "i18n"],
    },

    {
      name: "Babbangona",
      link: "https://babbangona.com/",
      role: "Software Engineer",
      period: "dec 2021 - may 2022",
      tasks: [
        "developed a multilingual customer support module (3 languages) with auto-sync features, furnishing users with realtime information.",
        " supervised data collection (23,000+ entries) and analysis of products across 5 states.",
      ],
      tools: ["react.js", "python", "node.js", "SQL"],
    },

    {
      name: "YediTech",
      link: "https://play.google.com/store/apps/details?id=com.illminew&pli=1",
      role: "mobile engineer - contract",
      period: "jun 2021 - aug 2021",
      tasks: [
        "built a React Native application, engineered RESTful APIs with React UseQuery for the applications.",
        "deployed the application to Google PlayStore, integrated with Paystack payment gateway",
      ],
      tools: ["react native", "react query", "node.js"],
    },
    {
      name: "Jekalo Systems Solutions LTD",
      role: "fullstack engineer",
      period: "mar 2021 - dec 2021",
      tasks: [
        "refactored company’s landing page to optimize the page’s performance for faster loading and browsing.",
        "refactored 2 React Native codebases whilst picking up the tool for the first time on the job.",
        "deployed 2 web applications and 1 android application, integrated with Paystack payment gateway",
      ],
      tools: ["html", "css", "react", "react native"],
    },
  ];

  const volunteeringExperience = [
    {
        name: "Microsoft Learn Student Ambasadors, UNILAG",
      role: "ambassador",
      period: "feb 2020 - dec 2021",
      tasks: [
        "collaborated with fellow student ambassadors to organize a 3-month Azure Learning Series with Azure MVPs from various countries mentoring participants during the Covid-19 lockdown.",
        "collaborated with PowerPlatform Nigeria to organize the largest PowerPlatform Bootcamp in Africa, with 700+ participants.",
        "founded the Microsoft Student Partner UNILAG YouTube channel with 10 hours+ of educational content.",
        "facilitated 5 events for people to acquire knowledge of various Microsoft technologies such as Azure, Power Platform, etc."
      ],
      tools: ["azure", "power platform"],
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12] pt-10">
        <p className="text-[16px] text-[#8C8C8C]">//work experience</p>

        <div className="pt-[16px]">
          {workExperience.map((experience, index) => (
            <>

            <div
              key={index}
              className={`flex flex-col lg:flex-row justify-start gap-x-[158px] ${
                index !== experience.tools.length - 1
                  ? `pb-[50px]`
                  : `pb-[40px]`
              }`}
              
            >
              <p className="text-[16px] text-[#595959] pt-[12px] pb-[12px] xl:pb-[0px] w-full xl:w-[245px]">
                {experience.period}
              </p>
              <div
             
              >
                <p className="text-[16px] dark:text-white dark:text-opacity-[.87] border border-[#1F1F1F] dark:border-white p-2.5 md:w-max anchor-select "
                
                data-tooltip-id={experience?.link ? "my-tooltip" : null}
                data-tooltip-content={experience?.link}
                onClick={() => {
                  experience?.link ? window.open(experience?.link, "_blank") : null
                }}
                >
                  {`${experience.name} `}{" "}
                  <span className="text-[#8C8C8C]">
                    //{experience.role.toLowerCase()}
                  </span>
                </p>
                <ul className="mt-[24px] list-inside list-disc">
                  {experience.tasks.map((item, index) => (
                    <li
                      key={index}
                      className="pb-2 text-[16px] w-full lg:w-[700px] text-[#26262] dark:text-white dark:text-opacity-[.87] "
                    >
                      {" "}
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex xs:flex-col flex-row gap-x-2">
                  {experience.tools.map((tool, index) => (
                    <span
                      key={index}
                      className={`text-[#8C8C8C] pt-[8px]`}
                    >
                      {tool}{" "}
                      <span
                        className={`invisible ${
                          index !== experience.tools.length - 1
                            ? "sm:visible"
                            : "invisible"
                        }` }
                      >
                        /
                      </span>{" "}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {experience?.link ?  <Tooltip id="my-tooltip" anchorSelect=".anchor-select" /> : <Tooltip id="misplace" /> }
            </>
          ))}

       
        </div>
        
      </div>

      <div className="flex flex-col gap-6 border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12] pt-10">
        <p className="text-[16px] text-[#8C8C8C]">//communities</p>

        <div className="pt-[16px]">
          {volunteeringExperience.map((experience, index) => (
            <div
              key={index}
              className={`flex flex-col gap-y-[20px] lg:flex-row justify-start gap-x-[158px] ${
                index !== experience.tools.length - 1
                  ? `pb-[50px]`
                  : `pb-[40px]`
              }`}
            >
              <p className="text-[16px] text-[#595959] pt-[12px] w-full xl:w-[245px]">
                {experience.period}
              </p>
              <div>
                <p className="text-[16px] dark:text-white dark:text-opacity-[.87] border border-[#1F1F1F] w-full dark:border-white p-2.5 md:w-max"
                
                >
                  {`${experience.name} `}{" "}
                  <span className="text-[#8C8C8C]">
                    //{experience.role.toLowerCase()}
                  </span>
                </p>
                <ul className="mt-[24px] list-inside list-disc">
                  {experience.tasks.map((item, index) => (
                    <li
                      key={index}
                      className="pb-2 text-[16px] w-full lg:w-[700px] text-[#26262] dark:text-white dark:text-opacity-[.87] "
                    >
                      {" "}
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex xs:flex-col flex-row gap-x-2">
                  {experience.tools.map((tool, index) => (
                    <span
                      key={index}
                      className={`text-[#8C8C8C] lg:pt-[8px]`}
                    >
                      {tool}{" "}
                      <span
                        className={`invisible ${
                          index !== experience.tools.length-1
                            ? "sm:visible"
                            : "invisible"
                        }`}
                      >
                        /
                      </span>{" "}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
