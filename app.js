const storageKeys = {
  theme: 'buildspace.theme',
  profile: 'buildspace.profile',
  projects: 'buildspace.projects',
  opportunities: 'buildspace.opportunities'
};

const state = {
  profile: JSON.parse(localStorage.getItem(storageKeys.profile) || 'null'),
  projects: JSON.parse(localStorage.getItem(storageKeys.projects) || '[]'),
  opportunities: JSON.parse(localStorage.getItem(storageKeys.opportunities) || '[]')
};

const nodes = {
  profileForm: document.querySelector('#profileForm'),
  profileCard: document.querySelector('#profileCard'),
  projectForm: document.querySelector('#projectForm'),
  projectList: document.querySelector('#projectList'),
  opportunityForm: document.querySelector('#opportunityForm'),
  opportunityList: document.querySelector('#opportunityList'),
  feedList: document.querySelector('#feedList'),
  searchInput: document.querySelector('#searchInput'),
  template: document.querySelector('#itemTemplate'),
  themeToggle: document.querySelector('#themeToggle')
};

function saveState() {
  localStorage.setItem(storageKeys.profile, JSON.stringify(state.profile));
  localStorage.setItem(storageKeys.projects, JSON.stringify(state.projects));
  localStorage.setItem(storageKeys.opportunities, JSON.stringify(state.opportunities));
}

function nowStamp() {
  return new Date().toLocaleString();
}

function renderProfile() {
  if (!state.profile) {
    nodes.profileCard.className = 'card empty';
    nodes.profileCard.textContent = 'Fill your profile to get discovered by teammates.';
    return;
  }

  const { name, headline, skills, interests, featuredProject } = state.profile;
  nodes.profileCard.className = 'card';
  nodes.profileCard.innerHTML = `
    <h3>${name}</h3>
    <p class="item-meta">${headline || 'Student Developer'}</p>
    <p class="item-body"><strong>Skills:</strong> ${skills || 'N/A'}</p>
    <p class="item-body"><strong>Interests:</strong> ${interests || 'N/A'}</p>
    <p class="item-body"><strong>Featured Project:</strong> ${featuredProject || 'N/A'}</p>
  `;
}

function renderList(target, items, kindLabelBuilder) {
  target.innerHTML = '';
  if (!items.length) {
    target.innerHTML = `<article class="card empty">No entries yet.</article>`;
    return;
  }

  items.slice().reverse().forEach((item) => {
    const card = nodes.template.content.firstElementChild.cloneNode(true);
    card.querySelector('.item-title').textContent = item.title;
    card.querySelector('.item-meta').textContent = kindLabelBuilder(item);
    card.querySelector('.item-body').textContent = item.description;
    card.querySelector('.item-time').textContent = `Posted: ${item.createdAt}`;
    target.appendChild(card);
  });
}

function feedItems() {
  const merged = [
    ...state.projects.map((p) => ({
      source: 'Project',
      title: p.title,
      description: `${p.description} • Need: ${p.teamNeed || 'Collaborators welcome'}`,
      meta: `Stack: ${p.techStack || 'Not specified'}`,
      createdAt: p.createdAt
    })),
    ...state.opportunities.map((o) => ({
      source: 'Opportunity',
      title: o.title,
      description: o.description,
      meta: o.type,
      createdAt: o.createdAt
    })),
    ...(state.profile
      ? [{
          source: 'Profile Update',
          title: `${state.profile.name} updated profile`,
          description: `Skills: ${state.profile.skills || 'N/A'} | Interests: ${state.profile.interests || 'N/A'}`,
          meta: state.profile.headline || 'Student Developer',
          createdAt: state.profile.updatedAt || nowStamp()
        }]
      : [])
  ];

  return merged.reverse();
}

function renderFeed() {
  const query = nodes.searchInput.value.trim().toLowerCase();
  const items = feedItems().filter((item) => {
    if (!query) return true;
    const text = `${item.source} ${item.title} ${item.description} ${item.meta}`.toLowerCase();
    return text.includes(query);
  });

  nodes.feedList.innerHTML = '';

  if (!items.length) {
    nodes.feedList.innerHTML = '<article class="card empty">No feed items match your search.</article>';
    return;
  }

  items.forEach((item) => {
    const card = nodes.template.content.firstElementChild.cloneNode(true);
    card.querySelector('.item-title').textContent = item.title;
    card.querySelector('.item-meta').textContent = `${item.source} • ${item.meta}`;
    card.querySelector('.item-body').textContent = item.description;
    card.querySelector('.item-time').textContent = item.createdAt;
    nodes.feedList.appendChild(card);
  });
}

nodes.profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(nodes.profileForm);
  state.profile = {
    name: formData.get('name')?.toString().trim(),
    headline: formData.get('headline')?.toString().trim(),
    skills: formData.get('skills')?.toString().trim(),
    interests: formData.get('interests')?.toString().trim(),
    featuredProject: formData.get('featuredProject')?.toString().trim(),
    updatedAt: nowStamp()
  };
  saveState();
  renderProfile();
  renderFeed();
  nodes.profileForm.reset();
});

nodes.projectForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(nodes.projectForm);
  state.projects.push({
    title: formData.get('title')?.toString().trim(),
    description: formData.get('description')?.toString().trim(),
    techStack: formData.get('techStack')?.toString().trim(),
    teamNeed: formData.get('teamNeed')?.toString().trim(),
    createdAt: nowStamp()
  });
  saveState();
  renderList(nodes.projectList, state.projects, (item) => `Stack: ${item.techStack || 'Not specified'}`);
  renderFeed();
  nodes.projectForm.reset();
});

nodes.opportunityForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(nodes.opportunityForm);
  state.opportunities.push({
    title: formData.get('title')?.toString().trim(),
    type: formData.get('type')?.toString().trim(),
    description: formData.get('description')?.toString().trim(),
    createdAt: nowStamp()
  });
  saveState();
  renderList(nodes.opportunityList, state.opportunities, (item) => item.type);
  renderFeed();
  nodes.opportunityForm.reset();
});

nodes.searchInput.addEventListener('input', renderFeed);

function initTheme() {
  const saved = localStorage.getItem(storageKeys.theme);
  if (saved === 'dark') {
    document.body.classList.add('dark');
  }
}

nodes.themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem(storageKeys.theme, document.body.classList.contains('dark') ? 'dark' : 'light');
});

initTheme();
renderProfile();
renderList(nodes.projectList, state.projects, (item) => `Stack: ${item.techStack || 'Not specified'}`);
renderList(nodes.opportunityList, state.opportunities, (item) => item.type);
renderFeed();
