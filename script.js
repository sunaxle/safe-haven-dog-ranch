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

  // Dynamic Content Loading for CMS
  fetch('site-content.json')
    .then(response => response.json())
    .then(data => {
      if (document.getElementById('hero-headline')) document.getElementById('hero-headline').innerText = data.hero_headline;
      if (document.getElementById('hero-subheadline')) document.getElementById('hero-subheadline').innerText = data.hero_subheadline;
      if (document.getElementById('mission-1-title')) document.getElementById('mission-1-title').innerText = data.mission_1_title;
      if (document.getElementById('mission-1-text')) document.getElementById('mission-1-text').innerText = data.mission_1_text;
      if (document.getElementById('mission-2-title')) document.getElementById('mission-2-title').innerText = data.mission_2_title;
      if (document.getElementById('mission-2-text')) document.getElementById('mission-2-text').innerText = data.mission_2_text;
      
      // Update video source if it exists and changed
      const videoSource = document.getElementById('hero-video-source');
      if (videoSource && data.hero_media) {
        // If the client uploaded a new video via the CMS, we update the src
        if (videoSource.getAttribute('src') !== data.hero_media) {
          videoSource.src = data.hero_media;
          videoSource.parentElement.load();
        }
      }
    })
    .catch(error => console.log("CMS Data not loaded or found: ", error));
});
