import StarIcon from './StarIcon';

export default function ProjectCard({ project, index }) {
  const initials = project.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('');
  return <a className="project" href={project.url} target="_blank" rel="noreferrer">
    <div className={`project-art ${project.image ? 'project-screenshot' : project.art || `project-monogram tone-${index % 3}`}`}>
      {project.image ? <img src={project.image} alt={project.imageAlt || ''} width="800" height="600" loading="lazy" decoding="async" /> : <>
        <span className="art-index" aria-hidden="true">PROJECT_{String(index + 1).padStart(3, '0')}</span>
        <div aria-hidden="true">{project.art === 'practice' ? <div className="practice-art"><span>F</span><span>P<span className="tiny-star"><StarIcon /></span></span></div> : project.art === 'africa' ? <div className="africa-art">tag<span>africa↗</span></div> : project.art === 'dictionary' ? <div className="dictionary-art"><span>Aa<span>↗</span></span><small>THE BEAUTY OF<br />FINDING THE RIGHT WORD.</small></div> : <span className="project-initials">{initials}<StarIcon /></span>}</div>
        <span className="art-caption" aria-hidden="true">{project.caption || project.type}</span>
      </>}
      <span className="project-arrow" aria-hidden="true">↗</span>
    </div>
    <div className="project-title"><h3>{project.name}</h3>{project.year && <span>{project.year}</span>}</div>
    {project.type && <p className="project-type">{project.type}</p>}
    {project.description && <p className="project-description">{project.description}</p>}
  </a>;
}
