const featuredRoles = [
  {
    company: 'Reliance Health',
    title: 'Associate Frontend Engineer',
    period: '2022 — 2026',
    context: 'Promoted from Frontend Engineer',
    theme: 'Healthcare, across borders.',
    summary: 'Owned telemedicine delivery from architecture to interface, and helped scale healthcare products across emerging markets.',
    contributions: [
      'Built the end-to-end consultation workflow for virtual care in Egypt, helping reduce in-person visits by 60% within six months.',
      'Built a reusable, accessible design system with code-generation tooling for branded experiences across Reliance products.',
      'Moved the frontend to a micro-frontend architecture and AWS Amplify, enabling independent team deployments.',
      'Introduced Cypress end-to-end testing and shipped EMR features supporting rollouts in Senegal, Egypt, and Côte d’Ivoire.',
    ],
    skills: ['React', 'TypeScript', 'Design systems', 'Cypress', 'AWS Amplify'],
  },
  {
    company: 'GoLemon',
    title: 'Frontend Engineer',
    period: '2024 — 2026',
    theme: 'From the screen to the warehouse.',
    summary: 'Built tools for the people behind fulfillment, employee shopping benefits, and the consumer mobile experience.',
    contributions: [
      'Owned Limelight, a fulfillment management web application, from architecture through launch.',
      'Integrated handheld barcode scanners into a fulfillment workflow to reduce manual processing errors.',
      'Built Lemon Care, a B2B dashboard enabling companies to offer shopping benefits to employees.',
      'Shipped Discovery List and Price Breakdown features in the consumer React Native app.',
    ],
    skills: ['Frontend architecture', 'Hardware integration', 'React Native', 'B2B products'],
  },
];
const earlierRoles = [
  { company: 'BabbanGona Farmer Services', title: 'Software Engineer', period: '2021 — 2022', summary: 'Built multilingual support in Yoruba, Hausa, and English. Automated analysis of 23,000+ entries with Python and VBA, cutting analysis time by 83%.', skills: 'Python / VBA / Multilingual interfaces' },
  { company: 'Jekalo Systems Solutions Ltd', title: 'Full-Stack Engineer', period: '2021', summary: 'Refactored two React Native codebases, built PHP REST APIs, and deployed two web applications and an Android app with Paystack integration.', skills: 'React Native / PHP / Paystack' },
];

export default function ExperienceTimeline() {
  return <section id="roles" className="roles-section experience-section" aria-labelledby="experience-title">
    <div className="section-heading"><h2 id="experience-title"><span>04 /</span> Experience</h2><span>PRODUCTS SHIPPED. LESSONS KEPT.</span></div>
    <div className="experience-intro"><p>Interfaces for care.<br /><em>Tools for everyday life.</em></p><span>From healthtech to commerce, building across web and mobile.</span></div>
    <div className="experience-featured">{featuredRoles.map((role, index) => <article className="experience-entry" key={role.company}>
      <div className="experience-date"><span className="experience-index">0{index + 1}</span><span>{role.period}</span></div>
      <div className="experience-body"><div className="experience-role-heading"><h3>{role.company}</h3><span className="experience-type">{index === 0 ? 'HEALTHTECH' : 'COMMERCE'}</span></div><p className="experience-title">{role.title}</p>{role.context && <p className="experience-context">{role.context}</p>}<h4>{role.theme}</h4><p className="experience-summary">{role.summary}</p>
      <details className="experience-details"><summary><span>Selected contributions</span><span className="experience-expand" aria-hidden="true" /></summary><ul>{role.contributions.map(item => <li key={item}>{item}</li>)}</ul></details>
      <ul className="experience-skills" aria-label={`${role.company} skills`}>{role.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
    </article>)}</div>
    <div className="earlier-heading"><span>BEFORE THAT</span><span>THE FOUNDATIONS</span></div>
    <div className="earlier-roles">{earlierRoles.map(role => <article className="earlier-role" key={role.company}><span className="earlier-date">{role.period}</span><div><h3>{role.company}</h3><p className="experience-title">{role.title}</p><p className="experience-summary">{role.summary}</p><p className="earlier-skills">{role.skills}</p></div></article>)}</div>
  </section>;
}
