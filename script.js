document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(el => observer.observe(el));

  // Helper to parse markdown
  const parseMD = (text) => typeof marked !== 'undefined' ? marked.parse(text) : text;

  const path = window.location.pathname;

  if (path.includes('special-needs.html')) {
    fetch('special-needs.json')
      .then(r => r.json())
      .then(data => {
        const h1 = document.querySelector('.page-header h1');
        if(h1) h1.innerText = data.headline || '';
        
        const p = document.querySelector('.page-header p');
        if(p) p.innerText = data.subheadline || '';

        const contentArea = document.querySelector('.mission-text');
        if(contentArea && data.content) contentArea.innerHTML = parseMD(data.content);

        const img = document.querySelector('.mission-image img');
        if(img && data.hero_image) img.src = data.hero_image;
      }).catch(e => console.log("CMS Data not loaded: ", e));
  } 
  else if (path.includes('shop.html')) {
    fetch('shop.json')
      .then(r => r.json())
      .then(data => {
        const h1 = document.querySelector('.page-header h1');
        if(h1) h1.innerText = data.headline || '';
        
        const p = document.querySelector('.page-header p');
        if(p) p.innerText = data.subheadline || '';
      }).catch(e => console.log("CMS Data not loaded: ", e));
  }
  else if (path.includes('adopt.html')) {
    fetch('dogs.json')
      .then(r => r.json())
      .then(data => {
        const container = document.getElementById('dogs-container');
        if (!container) return;
        
        container.innerHTML = '';
        if(data.dogs_list && data.dogs_list.length > 0) {
            data.dogs_list.forEach(dog => {
                container.innerHTML += `
                <div class="dog-card fade-in visible">
                  <img src="${dog.photo}" alt="${dog.name}">
                  <div class="dog-card-content">
                    <h3>${dog.name}</h3>
                    <div class="dog-meta">${dog.breed || ''} | ${dog.age || ''}</div>
                    <div class="dog-story">${parseMD(dog.story || '')}</div>
                    <a href="mailto:admin@safehavendogranch.com?subject=Inquiry about adopting ${dog.name}" class="btn btn-primary" style="width:100%; text-align:center; display:block; box-sizing:border-box; margin-top: auto;">Click to Adopt</a>
                  </div>
                </div>
                `;
            });
        } else {
            container.innerHTML = '<p>No dogs available for adoption at the moment. Please check back later!</p>';
        }
      }).catch(e => console.log("CMS Data not loaded: ", e));
  }
  else {
    // Homepage / index.html
    fetch('site-content.json')
      .then(response => response.json())
      .then(data => {
        if (document.getElementById('hero-headline')) document.getElementById('hero-headline').innerText = data.hero_headline;
        if (document.getElementById('hero-subheadline')) document.getElementById('hero-subheadline').innerText = data.hero_subheadline;
        if (document.getElementById('mission-1-title')) document.getElementById('mission-1-title').innerText = data.mission_1_title;
        
        // Use parseMD since it's now a markdown widget
        const mission1Text = document.getElementById('mission-1-text');
        if (mission1Text && data.mission_1_text) mission1Text.innerHTML = parseMD(data.mission_1_text);
        
        if (document.getElementById('mission-2-title')) document.getElementById('mission-2-title').innerText = data.mission_2_title;
        
        const mission2Text = document.getElementById('mission-2-text');
        if (mission2Text && data.mission_2_text) mission2Text.innerHTML = parseMD(data.mission_2_text);
        
        // Update video source if it exists and changed
        const videoSource = document.getElementById('hero-video-source');
        if (videoSource && data.hero_media) {
          if (videoSource.getAttribute('src') !== data.hero_media) {
            videoSource.src = data.hero_media;
            videoSource.parentElement.load();
          }
        }
      })
      .catch(error => console.log("CMS Data not loaded or found: ", error));
  }
});
