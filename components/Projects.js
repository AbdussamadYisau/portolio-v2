import { Tooltip } from 'react-tooltip'
export default function Projects() {

    const projectDetails = [
        {
            name: "Tag Africa",
            link: "https://www.tag-africa.org/",
            tags: ["landing page", "professional services", "2023"]
        }, 

        {
            name: "Dictionary App",
            link: "https://dictionary.abdussamadyisau.com",
            tags: ["personal", "frontend mentor", "2023"]
        },

        {
            name: "Advanced Note",
            link: "https://advanced-note-fcpsgw850-abdussamadyisau.vercel.app/",
            tags: ["personal", "dark mode", "2022"]
        },

        { 
            name: "AirBnB Clone",
            link: "https://zst-assessment-livid.vercel.app/",
            tags: ["personal", "implementation", "2023"]
        }
    ]
    return (
        <>
        <div className="flex flex-col gap-6 border-b pb-5 border-[#8C8C8C] dark:border-white dark:border-opacity-[.12] pt-10" >
            <p className="text-[16px] text-[#8C8C8C]">//projects </p>

            {projectDetails.map((project, index) => (
            <>
            <div key={index} className="flex flex-col lg:flex-row justify-between items-start lg:items-center"
            data-tooltip-id={project?.link ? "project-tooltip" : null}
            data-tooltip-content={project?.link}

            onClick={() => {
                project?.link ? window.open(project?.link, "_blank") : null
              }}
            >
                <p>{project?.name}</p>

                <div className="hidden lg:flex lg:flex-row gap-x-[8px] gap-y-[8px] w-2/3">
                    {project?.tags?.map((tag) => (
                        <div className="flex justify-center items-center pt-[8px] pb-[16px] rounded-3xl border-solid border-white border-[1px] w-full">
                        <p className="w-max">
                            {tag}
                        </p>
                        </div>
                    ))}

                    {project?.link ?  <Tooltip id="project-tooltip" /> : <Tooltip id="misplace" /> }
                </div>
            </div>
            
            </>
        ))

        }
        </div>

      
        </>
    )
}