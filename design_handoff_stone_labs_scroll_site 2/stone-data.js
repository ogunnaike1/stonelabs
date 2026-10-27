// Stone Labs — site content. Edit this file to add or change work; the homepage reads from it.
// Anything marked placeholder:true is a stand-in and should be replaced with real content.
//
// Real work in the 3D showcase:
//   projects[0].video  → plays on the motion display (mp4/webm URL)   or .screen for a still
//   projects[1].screen → website screenshot (tall full-page captures scroll on the laptop)
//   projects[2].screen → app screenshot (tall captures scroll on the phone)
//   projects[3]        → shown as the architectural model; set .url to link the 360° tour
//   projects[n].url    → adds a "View project" link
window.STONE = {
  studio: { name: 'Stone Labs', tagline: 'Creative Digital Studio', statement: 'Digital experiences. Designed to move.' },
  contact: {
    email: 'hello@your-domain.com', emailPlaceholder: true,
    socials: [
      { label: 'Instagram', href: '#' }, { label: 'Behance', href: '#' },
      { label: 'LinkedIn', href: '#' }, { label: 'Vimeo', href: '#' }
    ]
  },
  services: [
    { id: 'motion', no: '01', name: 'Motion Graphics', short: 'Motion', tags: '2D · 3D · Brand motion',
      text: 'Title sequences, product animation, brand motion systems and showreels.' },
    { id: 'web', no: '02', name: 'Web Development', short: 'Web', tags: 'Design · Front-end · CMS',
      text: 'Editorial websites and interactive experiences, designed and built in-house.' },
    { id: 'app', no: '03', name: 'Mobile App Development', short: 'Apps', tags: 'iOS · Android · Prototyping',
      text: 'Mobile products from interface design and prototyping through to a shipped build.' },
    { id: 'viz', no: '04', name: '3D Visualization', short: '3D Viz', tags: 'Archviz · Animation · 360° tours',
      text: 'Photoreal architectural renders, animated walkthroughs and interactive 360° tours.' }
  ],
  process: [
    { no: '01', name: 'Discover', text: 'We define the brief together — audience, constraints and what success looks like.' },
    { no: '02', name: 'Design', text: 'Concepts, styleframes and prototypes. Ideas are tested in movement, not only in stills.' },
    { no: '03', name: 'Build', text: 'Production in the final medium — render, code or app build — with visible review points.' },
    { no: '04', name: 'Refine', text: 'Detail passes on timing, performance and finish. Then delivery, launch and handover.' }
  ],
  projects: [
    { id: 'motion-reel', placeholder: true, serviceLabel: 'Motion Graphics', title: 'Motion Reel', year: '2026',
      summary: 'Placeholder for your showreel or a title sequence. Set a video URL in stone-data.js and it plays on the display.',
      role: ['Art direction', 'Animation', 'Compositing'], video: '', screen: '', url: '' },
    { id: 'website', placeholder: true, serviceLabel: 'Web Development', title: 'Website Project', year: '2026',
      summary: 'Placeholder for a website case study. A full-page screenshot scrolls on the laptop as you scroll.',
      role: ['UX & UI design', 'Front-end development'], screen: '', url: '' },
    { id: 'mobile-app', placeholder: true, serviceLabel: 'Mobile App Development', title: 'Mobile App Project', year: '2026',
      summary: 'Placeholder for an app case study — key screens, flows and a store or demo link.',
      role: ['Product design', 'App development'], screen: '', url: '' },
    { id: 'archviz', placeholder: true, serviceLabel: '3D Visualization', title: 'Architectural Visualization', year: '2026',
      summary: 'Placeholder for an architectural project — renders, walkthrough and an optional 360° tour.',
      role: ['3D modelling', 'Lighting & rendering', '360° tour'], screen: '', url: '' }
  ]
};
