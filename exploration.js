(() => {
  const milestones = [
    { id: 'roman', category: 'Space Telescopes', title: 'Roman’s first images', date: 'December 7, 2026 at 20:30 UTC', start: '2026-12-07T20:30:00Z', end: '2026-12-08', status: 'Scheduled', detail: 'NASA will unveil the first images from Roman, showing what its wide-field camera can reveal in a single view.', source: 'https://www.nasa.gov/news-release/nasa-invites-media-public-to-view-roman-telescopes-first-images/', webcast: 'https://www.nasa.gov/live/' },
    { id: 'webb', category: 'Space Telescopes', title: 'Webb Cycle 6 observations begin', date: 'July 1, 2027', start: '2027-07-01', end: '2027-07-02', status: 'Planned', detail: 'A new observing cycle opens time on Webb for research teams around the world.', source: 'https://www.stsci.edu/jwst/science-planning/calls-for-proposals-and-policy.html' },
    { id: 'axiom-5', category: 'Commercial Spaceflight', title: 'Axiom Mission 5 launches to the ISS', date: 'No earlier than January 2027', status: 'Earliest target', detail: 'NASA and Axiom plan a fifth private astronaut mission, with up to 14 days aboard the station.', source: 'https://www.nasa.gov/news-release/nasa-selects-axiom-space-for-fifth-private-mission-to-space-station/' },
    { id: 'blue-ghost', category: 'Moon and Mars', title: 'Blue Ghost Mission 2 heads to the lunar far side', date: '2027 mission target', start: '2027-01-01', end: '2028-01-01', status: 'Target', detail: 'Firefly plans to deliver science instruments to the far side of the Moon.', source: 'https://www.nasa.gov/event/clps-flight-firefly-aerospaces-blue-ghost-mission-2/' },
    { id: 'artemis-iii', category: 'Moon and Mars', title: 'Artemis III orbital docking tests', date: '2027 mission target', start: '2027-01-01', end: '2028-01-01', status: 'Target', detail: 'An Orion crew will practice rendezvous and docking in Earth orbit ahead of a future lunar landing.', source: 'https://www.nasa.gov/mission/artemis-iii/' },
    { id: 'juice', category: 'Deep Space', title: 'Juice makes its final Earth flyby', date: 'January 2029', start: '2029-01-01', end: '2029-02-01', status: 'Planned', detail: 'The gravity assist puts ESA’s spacecraft on course for Jupiter and its icy moons.', source: 'https://www.esa.int/articles/about-us/directorates/science/juice/juice-to-fly-past-earth-for-third-gravity-assist' },
    { id: 'europa-clipper', category: 'Deep Space', title: 'Europa Clipper arrives at Jupiter', date: 'April 2030', start: '2030-04-01', end: '2030-05-01', status: 'Planned', detail: 'Entering Jupiter orbit sets up repeated flybys to investigate whether Europa could support life.', source: 'https://science.nasa.gov/mission/europa-clipper/' },
  ];

  const rovers = [
    {
      id: 'curiosity',
      name: 'Curiosity',
      title: 'Twilight clouds over Gale Crater',
      photo: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia26805/PIA26805.jpg?fit=clip&h=603&w=1536',
      alt: 'Wispy clouds glow above a dark Martian horizon in a black-and-white panorama.',
      camera: 'Navigation cameras',
      captured: '2026-10-31',
      sol: '5,061',
      credit: 'NASA/JPL-Caltech',
      published: '2026-11-20',
      summary: 'Curiosity watched wispy clouds drift over Gale Crater after sunset.',
      research: 'The navigation cameras recorded twilight clouds during the short season when they appear over Gale Crater. Repeat observations can help researchers study how these clouds form and what drives their seasonal appearance.',
      source: 'https://science.nasa.gov/photojournal/curiosity-spots-drifting-twilight-clouds/',
      updates: 'https://science.nasa.gov/mission/msl-curiosity/science-updates/',
      gallery: 'https://mars.nasa.gov/msl/multimedia/raw-images/',
    },
    {
      id: 'perseverance',
      name: 'Perseverance',
      title: 'Ancient rocks west of Jezero Crater',
      photo: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/photojournal/pia/pia26753/PIA26753.png?fit=clip&h=1536&w=1536',
      alt: 'A broad Mars landscape with reddish soil, loose rocks, and ridges near the horizon.',
      camera: 'Mastcam-Z',
      captured: '2026-04-05',
      sol: '1,882',
      credit: 'NASA/JPL-Caltech/ASU/MSSS',
      published: '2026-09-28',
      summary: 'A panorama of Arbot shows the varied terrain Perseverance explored west of Jezero Crater.',
      research: 'At Lac de Charmes, Perseverance ground away small areas of rock to inspect fresh surfaces. The team found clues that some rocks formed from cooled magma or lava and others from impacts. They are investigating how those processes shaped early Mars. The photo is an enhanced-color panorama from the same region.',
      source: 'https://science.nasa.gov/photojournal/nasas-perseverance-captures-panorama-at-arbot/',
      science: 'https://science.nasa.gov/blog/mars-has-its-charmes/',
      updates: 'https://science.nasa.gov/mission/mars-2020-perseverance/science-updates/',
      gallery: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
      statusDate: '2026-11-19',
      status: 'NASA reported a temporary pause in science and image capture while the team investigated radio issues.',
      statusSource: 'https://science.nasa.gov/blogs/mars/2026/11/19/nasas-perseverance-odyssey-teams-investigate-technical-issues/',
    },
  ];

  const formatDate = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });
  const now = Date.now();
  const date = value => `<time datetime="${value}">${formatDate.format(new Date(value))}</time>`;
  const expired = milestone => milestone.end && now >= Date.parse(milestone.end);

  function milestoneCard(milestone, preview = false) {
    const status = expired(milestone) && milestone.status !== 'Completed' ? 'Awaiting update' : milestone.status;
    const heading = preview ? 'h3' : 'h4';
    return `<article class="exploration-item"${preview ? '' : ` id="${milestone.id}"`}>
      <${heading}>${milestone.title}</${heading}>
      <p class="exploration-meta">${milestone.date} · ${status}</p>
      <p>${milestone.detail}</p>
      <div class="exploration-links">
        <a href="${milestone.source}">Official update</a>
        ${milestone.webcast && !expired(milestone) && milestone.status !== 'Completed' ? `<a href="${milestone.webcast}">Watch live</a>` : ''}
        ${preview ? '<a href="/missions/#watchlist">Full watchlist</a>' : ''}
      </div>
    </article>`;
  }

  function roverCard(rover, preview = false) {
    return `<article class="exploration-item"${preview ? '' : ` id="${rover.id}"`}>
      <h3>${rover.name} · ${rover.title}</h3>
      <figure>
        <img src="${rover.photo}" alt="${rover.alt}" loading="lazy">
        <figcaption>${rover.camera} · ${date(rover.captured)} · Sol ${rover.sol} · ${rover.credit}</figcaption>
      </figure>
      <p>${rover.summary}</p>
      ${preview ? '' : `
        <p class="exploration-meta">Science story published ${date(rover.published)}</p>
        <p>${rover.research}</p>
        ${rover.status ? `<p>Mission status on ${date(rover.statusDate)}. ${rover.status} <a href="${rover.statusSource}">NASA status report</a></p>` : ''}`}
      <div class="exploration-links">
        ${preview ? `<a href="/mars-rovers/#${rover.id}">Explore the science</a>` : `
          <a href="${rover.source}">Original image on NASA</a>
          ${rover.science ? `<a href="${rover.science}">Research story</a>` : ''}
          <a href="${rover.gallery}">Raw image gallery</a>
          <a href="${rover.updates}">Mission team updates</a>`}
      </div>
    </article>`;
  }

  const watchlist = document.querySelector('#watchlist-content');
  if (watchlist) {
    const categories = ['Moon and Mars', 'Deep Space', 'Commercial Spaceflight', 'Space Telescopes'];
    watchlist.innerHTML = categories.map(category => `<section>
      <h3>${category}</h3>
      ${milestones.filter(milestone => milestone.category === category).map(milestone => milestoneCard(milestone)).join('')}
    </section>`).join('');
  }

  const roverStories = document.querySelector('#rover-stories');
  if (roverStories) roverStories.innerHTML = rovers.map(rover => roverCard(rover)).join('');

  const spotlight = document.querySelector('#milestone-spotlight');
  if (spotlight) {
    const next = milestones
      .filter(milestone => milestone.start && !expired(milestone) && milestone.status !== 'Completed')
      .sort((a, b) => Date.parse(a.start) - Date.parse(b.start))[0];
    if (next) {
      spotlight.dataset.start = next.start;
      spotlight.dataset.end = next.end;
      spotlight.innerHTML = milestoneCard(next, true);
    }
  }

  const marsPhoto = document.querySelector('#rover-spotlight');
  if (marsPhoto) {
    const featured = [...rovers].sort((a, b) => b.published.localeCompare(a.published))[0];
    if (featured) {
      marsPhoto.dataset.published = featured.published;
      marsPhoto.innerHTML = roverCard(featured, true);
    }
  }
})();
