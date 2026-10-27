// Stone Labs — site content. Anything marked placeholder:true is a stand-in to replace.
export const STONE = {
  contact: {
    email: 'hello@your-domain.com', emailPlaceholder: true,
    socials: [
      { label: 'Instagram', href: '#' }, { label: 'Behance', href: '#' },
      { label: 'LinkedIn', href: '#' }, { label: 'Vimeo', href: '#' }
    ]
  },
  services: [
    { id: 'motion', no: '01', name: 'Motion Graphics', short: 'Motion', tags: '2D · 3D · Brand motion', text: 'Title sequences, product animation, brand motion systems and showreels.', lead: 'Story-first animation in 2D and 3D, built from styleframes to final grade.', image: '/images/card-01.jpg', deliverables: ['Title sequences & openers', 'Product and explainer animation', 'Brand motion systems', 'Showreels & social cuts'] },
    { id: 'web', no: '02', name: 'Web Development', short: 'Web', tags: 'Design · Front-end · CMS', text: 'Editorial websites and interactive experiences, designed and built in-house.', lead: 'Designed and built in-house, so the interface you approve is the one that ships.', image: '/images/card-02.jpg', deliverables: ['Editorial & marketing sites', 'Interactive, scroll-driven experiences', 'CMS and content setup', 'Performance & accessibility'] },
    { id: 'app', no: '03', name: 'Mobile App Development', short: 'Apps', tags: 'iOS · Android · Prototyping', text: 'Mobile products from interface design and prototyping through to a shipped build.', lead: 'From first wireframe to a build in the stores, with testable prototypes along the way.', image: '/images/card-03.jpg', deliverables: ['Product & interface design', 'Clickable prototypes', 'iOS and Android builds', 'Store submission & handover'] },
    { id: 'viz', no: '04', name: '3D Visualization', short: '3D Viz', tags: 'Archviz · Animation · 360° tours', text: 'Photoreal architectural renders, animated walkthroughs and interactive 360° tours.', lead: 'Architectural visuals that let clients see, and walk through, a building before it exists.', image: '/images/card-04.jpg', deliverables: ['Photoreal exterior & interior stills', 'Animated walkthroughs', 'Interactive 360° tours', 'Planning & marketing visuals'] }
  ],
  process: [
    { no: '01', name: 'Discover', text: 'We define the brief together — audience, constraints and what success looks like.' },
    { no: '02', name: 'Design', text: 'Concepts, styleframes and prototypes. Ideas are tested in movement, not only in stills.' },
    { no: '03', name: 'Build', text: 'Production in the final medium — render, code or app build — with visible review points.' },
    { no: '04', name: 'Refine', text: 'Detail passes on timing, performance and finish. Then delivery, launch and handover.' }
  ],
  projects: [
    { id: 'motion-reel', serviceLabel: 'Motion Graphics', title: 'Motion Reel', year: '2026', summary: 'Placeholder for your showreel or a title sequence. Set a video URL in data/stone.ts and it plays on the display.', role: ['Art direction', 'Animation', 'Compositing'], url: '' },
    { id: 'website', serviceLabel: 'Web Development', title: 'Website Project', year: '2026', summary: 'Placeholder for a website case study. A full-page screenshot scrolls on the laptop as you scroll.', role: ['UX & UI design', 'Front-end development'], url: '' },
    { id: 'mobile-app', serviceLabel: 'Mobile App Development', title: 'Mobile App Project', year: '2026', summary: 'Placeholder for an app case study — key screens, flows and a store or demo link.', role: ['Product design', 'App development'], url: '' },
    { id: 'archviz', serviceLabel: '3D Visualization', title: 'Architectural Visualization', year: '2026', summary: 'Placeholder for an architectural project — renders, walkthrough and an optional 360° tour.', role: ['3D modelling', 'Lighting & rendering', '360° tour'], url: '' }
  ]
};
