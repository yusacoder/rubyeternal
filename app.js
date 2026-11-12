async function loadProfile() {
  try {
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error('data.json yüklenemedi.');
    }

    const data = await response.json();

    const profile = data.profile;
    const appearance = data.appearance;
    const sections = data.sections;

    const root = document.documentElement;

    // GÜVENLİ CSS DEĞERLERİ
    const setVariable = (name, value) => {
      root.style.setProperty(name, value);
    };

    const number = (value, fallback) =>
      Number.isFinite(Number(value)) ? Number(value) : fallback;

    const imageURL = (value) => {
      try {
        const url = new URL(value, location.href);
        return ['http:', 'https:'].includes(url.protocol)
          ? url.href
          : '';
      } catch {
        return '';
      }
    };

    // APPEARANCE
    const bg = imageURL(appearance.backgroundImage);

    setVariable('--background-image', bg ? `url("${bg}")` : 'none');
    setVariable('--background-blur', number(appearance.backgroundBlur, 0) + 'px');
    setVariable('--background-darkness', Math.min(1, Math.max(0, number(appearance.backgroundDarkness, .25))));
    setVariable('--background-zoom', Math.max(1, number(appearance.backgroundZoom, 1.04)));

    setVariable('--navbar-opacity', Math.min(1, Math.max(0, number(appearance.navbarOpacity, 0))));
    setVariable('--navbar-blur', Math.max(0, number(appearance.navbarBlur, 16)) + 'px');

    setVariable('--card-opacity', Math.min(1, Math.max(0, number(appearance.cardOpacity, 0))));
    setVariable('--card-blur', Math.max(0, number(appearance.cardBlur, 0)) + 'px');

    setVariable('--element-opacity', Math.min(1, Math.max(0, number(appearance.elementOpacity, .08))));
    setVariable('--element-blur', Math.max(0, number(appearance.elementBlur, 12)) + 'px');

    setVariable('--border-opacity', Math.min(1, Math.max(0, number(appearance.borderOpacity, .15))));
    setVariable('--accent', appearance.accentColor || '#2495ff');
    setVariable('--text', appearance.textColor || '#ffffff');
    setVariable('--muted', appearance.mutedColor || 'rgba(255,255,255,.65)');

    // NAVBAR
    const navbarTitle = document.getElementById('navbarTitle');
    navbarTitle.textContent = '';

    const logo = data.navbar;
    const logoFirst = document.createTextNode(
      logo.title.slice(0, -logo.highlight.length)
    );

    const logoHighlight = document.createElement('span');
    logoHighlight.textContent = logo.highlight;

    navbarTitle.append(logoFirst, logoHighlight);

    // PROFILE
    document.title = `${profile.name} | Eternal Production`;

    document.getElementById('name').textContent = profile.name;
    document.getElementById('username').textContent = profile.username || '';

    const avatar = document.getElementById('avatar');
    avatar.src = imageURL(profile.avatar);
    avatar.alt = profile.name + ' profil fotoğrafı';

    document.getElementById('verified').hidden = !profile.verified;

    document.getElementById('description').textContent =
      profile.description;

    // BADGES
    const badges = document.getElementById('badges');
    badges.replaceChildren();

    (profile.badges || []).forEach(item => {
      const badge = document.createElement('span');
      badge.className = 'badge ' + (item.type === 'admin' ? 'admin' : 'staff');

      const icon = document.createElement('i');
      icon.className = item.icon;

      const text = document.createTextNode(' ' + item.text);

      badge.append(icon, text);
      badges.appendChild(badge);
    });

    // ABOUT
    const aboutSection = document.getElementById('aboutSection');
    aboutSection.hidden = !sections.about.enabled;

    document.getElementById('aboutHeading').innerHTML =
      `<i class="${sections.about.icon}"></i>`;

    document.getElementById('aboutHeading').append(
      document.createTextNode(' ' + sections.about.title)
    );

    document.getElementById('aboutText').textContent = profile.about;

    // TASKS
    const taskSection = document.getElementById('tasksSection');
    taskSection.hidden = !sections.tasks.enabled;

    document.getElementById('tasksHeading').innerHTML =
      `<i class="${sections.tasks.icon}"></i>`;

    document.getElementById('tasksHeading').append(
      document.createTextNode(' ' + sections.tasks.title)
    );

    const taskGrid = document.getElementById('tasksGrid');
    taskGrid.replaceChildren();

    (sections.tasks.items || []).forEach(task => {
      const card = document.createElement('div');
      card.className = 'task-card';

      const icon = document.createElement('div');
      icon.className = 'task-icon';

      const iconElement = document.createElement('i');
      iconElement.className = task.icon;
      icon.appendChild(iconElement);

      const title = document.createElement('h3');
      title.textContent = task.title;

      const description = document.createElement('p');
      description.textContent = task.description;

      card.append(icon, title, description);
      taskGrid.appendChild(card);
    });

    // COMPANY
    document.getElementById('companySection').hidden =
      !data.company.enabled;

    document.getElementById('companyLogo').src =
      imageURL(data.company.logo);

    document.getElementById('companyName').textContent =
      data.company.name;

    document.getElementById('companyDescription').textContent =
      data.company.description;

    const companyLink = document.getElementById('companyLink');
    companyLink.href = imageURL(data.company.website);

    // SOCIALS
    document.getElementById('socialSection').hidden =
      !data.socials.enabled;

    document.getElementById('socialHeading').innerHTML =
      `<i class="fa-solid fa-link"></i> `;

    document.getElementById('socialHeading').append(
      document.createTextNode(data.socials.title)
    );

    const socialLinks = document.getElementById('socialLinks');
    socialLinks.replaceChildren();

    (data.socials.items || []).forEach(item => {
      const link = document.createElement('a');
      link.className = 'social-link';
      link.href = imageURL(item.url);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', item.name);

      const icon = document.createElement('i');
      icon.className = item.icon;

      link.appendChild(icon);
      socialLinks.appendChild(link);
    });

    // FOOTER
    document.getElementById('footerBrand').textContent =
      data.footer.brand;

    document.getElementById('footerCopyright').textContent =
      data.footer.copyright;

    document.getElementById('footerCredit').textContent =
      data.footer.credit;

  } catch (error) {
    console.error('Profil yükleme hatası:', error);
    document.getElementById('errorMessage').hidden = false;
  }
}

loadProfile();
