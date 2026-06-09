import os
import glob
import re

MASTER_HEADER = """  <header>
    <div class="container nav-wrapper">
      <nav>
        <a href="index.html" class="logo">
          <img src="assets/IMG_4718.JPEG" alt="Safe Haven Dog Ranch Logo" style="height: 50px; border-radius: 50%;">
          Safe Haven <span>Dog Ranch</span>
        </a>
        <ul class="nav-links">
          <li><a href="adopt.html">Adopt</a></li>
          <li><a href="gallery.html">Gallery</a></li>
          <li><a href="volunteer.html">Volunteer</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="donate.html" class="btn btn-accent">Support the Pups!</a></li>
        </ul>
        <button class="mobile-menu-btn">☰</button>
      </nav>
    </div>
  </header>"""

def sync_headers():
    html_files = glob.glob("*.html")
    for filepath in html_files:
        # Don't overwrite admin.html header if it has a specific one, actually wait, admin.html doesn't have a normal header, it has a side nav usually. Let's check admin.html first.
        # Actually admin.html header is: 
        #   <header style="background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; border-radius: 10px; margin-bottom: 2rem;">
        # Let's skip admin.html
        if filepath == "admin.html":
            continue

        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace everything from <header> (with optional attributes) to </header>
        # Ensure we only replace the main header by looking for the first header block
        pattern = re.compile(r'<header.*?>.*?</header>', re.DOTALL)
        
        # Check if a header exists
        if pattern.search(content):
            new_content = pattern.sub(MASTER_HEADER, content, count=1)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
        else:
            print(f"No <header> found in {filepath}")

if __name__ == '__main__':
    sync_headers()
