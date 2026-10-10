/**
 * Mold Recovery Plus — Master JavaScript
 * Handles navigation, mobile drawer, accordions, gallery filters, lightbox, and interactive forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    });
  }

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.drawer-overlay');
  const drawerClose = document.querySelector('.mobile-drawer-close');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Mobile submenu toggles
  const mobileSubmenuToggles = document.querySelectorAll('.mobile-submenu-toggle');
  mobileSubmenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = toggle.closest('.has-mobile-submenu');
      if (parent) {
        const submenu = parent.querySelector('.mobile-submenu');
        if (submenu) {
          submenu.classList.toggle('open');
          const icon = toggle.querySelector('.toggle-icon');
          if (icon) {
            icon.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        }
      }
    });
  });

  // 3. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close other items if desired or keep multi-open. Let's toggle smoothly:
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        if (!isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });

  // 4. Interactive Before & After Slider
  const baSliders = document.querySelectorAll('.ba-slider-container');
  baSliders.forEach(slider => {
    const beforeWrap = slider.querySelector('.ba-image-before');
    const handle = slider.querySelector('.ba-handle');
    let isDown = false;

    if (!beforeWrap || !handle) return;

    function setPosition(pos) {
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      beforeWrap.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
      beforeWrap.style.webkitClipPath = `inset(0 ${100 - pos}% 0 0)`;
      handle.style.left = `${pos}%`;
    }

    function move(e) {
      if (!isDown) return;
      const rect = slider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      if (clientX === undefined) return;
      let pos = ((clientX - rect.left) / rect.width) * 100;
      setPosition(pos);
    }

    // Mouse events - allow clicking or dragging anywhere on container
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      move(e);
    });
    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', move);

    // Touch events - smooth dragging on mobile
    slider.addEventListener('touchstart', (e) => {
      isDown = true;
      move(e);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDown = false; });
    window.addEventListener('touchmove', move, { passive: true });

    // Initial 50% center position
    setPosition(50);
  });

  // 5. Gallery Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        galleryCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Accessible Lightbox Modal
  const lightboxModal = document.querySelector('.lightbox-modal');
  const lightboxImg = document.querySelector('.lightbox-image');
  const lightboxTitle = document.querySelector('.lightbox-caption-title');
  const lightboxDesc = document.querySelector('.lightbox-caption-desc');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  let currentGalleryItems = [];
  let currentIndex = 0;

  function updateLightboxItems() {
    currentGalleryItems = Array.from(document.querySelectorAll('.gallery-card, .gallery-editorial-item')).filter(item => {
      return item.style.display !== 'none';
    });
  }

  function showLightbox(index) {
    if (!lightboxModal || currentGalleryItems.length === 0) return;
    currentIndex = (index + currentGalleryItems.length) % currentGalleryItems.length;
    const item = currentGalleryItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || item.querySelector('.gallery-overlay-title')?.innerText || 'Project Showcase';
    const desc = item.getAttribute('data-desc') || item.querySelector('.gallery-overlay-sub')?.innerText || 'Mold Recovery Plus Project';

    if (lightboxImg && img) lightboxImg.src = img.src;
    if (lightboxTitle) lightboxTitle.innerText = title;
    if (lightboxDesc) lightboxDesc.innerText = desc;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Bind clicks to gallery items
  document.querySelectorAll('.gallery-card, .gallery-editorial-item').forEach(item => {
    item.addEventListener('click', () => {
      updateLightboxItems();
      const index = currentGalleryItems.indexOf(item);
      if (index !== -1) showLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showLightbox(currentIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showLightbox(currentIndex + 1); });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(currentIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(currentIndex + 1);
  });

  // 7. Interactive Lead Assessment Form
  const inquiryForms = document.querySelectorAll('.service-inquiry-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const statusEl = form.querySelector('.form-status');
      const submitBtn = form.querySelector('button[type="submit"]');

      // Simple validation check
      const name = form.querySelector('[name="full_name"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const service = form.querySelector('[name="service"]')?.value;

      if (!name || !phone) {
        if (statusEl) {
          statusEl.className = 'form-status error';
          statusEl.innerText = 'Please provide both your name and phone number so Matt can contact you directly.';
        }
        return;
      }

      // Simulate sending inquiry
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Transmitting Service Request...';
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.className = 'form-status success';
          statusEl.innerHTML = `<strong>Thank you, ${name}!</strong> Your inquiry for <em>${service || 'Mold Remediation'}</em> has been received. Owner Matt Jarnis will review your property details and contact you directly at <strong>${phone}</strong> shortly.`;
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Request Assessment Submitted!';
        }
      }, 700);
    });
  });

  // 8. Dynamic Copyright Year
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => el.innerText = new Date().getFullYear());

  // 9. Interactive YouTube Video Facade Player (prevents Error 153 on file://)
  const videoFacades = document.querySelectorAll('.video-frame-wrap[id="youtube-facade"]');
  videoFacades.forEach(facade => {
    function playVideo() {
      const videoId = facade.getAttribute('data-video-id') || '8bl6xXmY_KE';
      if (window.location.protocol === 'file:') {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
      } else {
        const iframe = facade.querySelector('iframe');
        const overlay = facade.querySelector('.video-facade-overlay');
        if (iframe && overlay) {
          iframe.src = iframe.getAttribute('data-src') || `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
          iframe.style.display = 'block';
          overlay.style.display = 'none';
        }
      }
    }

    facade.addEventListener('click', playVideo);
    facade.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVideo();
      }
    });
  });
});
