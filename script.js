 (function () {
      const homeGrid = document.querySelector('.item-grid');
      if (homeGrid) {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);

        // Defer entrance animation until after initial paint to avoid refresh flicker/jump.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.body.classList.add('home-grid-animate');
          });
        });
      }

      const header   = document.querySelector('.site-header');
      /** Same breakpoint as @media (max-width: 900px) — full-width nav pill */
      const MOBILE_BP = 900;

      /** Scroll happens on window for standalone pages; inside drawer panel when project drawer is open. */
      function getScrollRoot() {
        if (document.body.classList.contains('proj-drawer-open')) {
          const panel = document.querySelector('.proj-drawer-panel.proj-drawer-panel--open');
          if (panel) return panel;
        }
        return null;
      }

      function getScrollY() {
        const root = getScrollRoot();
        return root ? root.scrollTop : window.scrollY;
      }

      let lastY = getScrollY();
      let lastScrollRoot = getScrollRoot();
      let ticking = false;

      function isMobile() { return window.innerWidth <= MOBILE_BP; }

      function handleScroll() {
        if (!header) {
          ticking = false;
          return;
        }

        const root = getScrollRoot();
        const currentY = getScrollY();

        if (root !== lastScrollRoot) {
          lastY = currentY;
          lastScrollRoot = root;
        }

        if (isMobile()) {
          header.classList.remove('hidden');
        } else {
          if (currentY > lastY && currentY > 80) {
            header.classList.add('hidden');
          } else {
            header.classList.remove('hidden');
          }
        }

        lastY = currentY;
        ticking = false;
      }

      function requestHandleScroll() {
        if (!ticking) {
          window.requestAnimationFrame(handleScroll);
          ticking = true;
        }
      }

      window.addEventListener('scroll', requestHandleScroll, { passive: true });
      document.querySelectorAll('.proj-drawer-panel').forEach((panel) => {
        panel.addEventListener('scroll', requestHandleScroll, { passive: true });
      });

      window.addEventListener('resize', () => {
        lastScrollRoot = getScrollRoot();
        lastY = getScrollY();
      });

      requestAnimationFrame(() => {
        if (header) header.classList.remove('hidden');
      });
    })();

    // Simple overlay for About.txt (and similar items later)
    (function () {
      const overlay = document.getElementById('assetOverlay');
      const content = document.getElementById('assetOverlayContent');
      if (!overlay || !content) return;

      const aboutItem = document.querySelector('.grid-item[data-overlay="about"]');
      const overlayTitle = document.getElementById('overlayTitle');
      const overlayTitleIcon = document.querySelector('.overlay-title-icon');
      if (aboutItem) {
        aboutItem.addEventListener('click', () => {
          if (overlayTitle) overlayTitle.textContent = 'ABOUT.TXT';
          if (overlayTitleIcon) overlayTitleIcon.style.display = '';
          content.style.left = '';
          content.style.top = '';
          content.classList.remove('overlay-content-open');
          overlay.classList.add('visible');
          document.body.classList.add('overlay-open');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => content.classList.add('overlay-content-open'));
          });
        });
      }

      function closeOverlay() {
        content.classList.remove('overlay-content-open');
        content.style.left = '';
        content.style.top = '';
        overlay.classList.remove('visible');
        document.body.classList.remove('overlay-open');
      }

      overlay.addEventListener('click', () => {
        closeOverlay();
      });

      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      const closeBtn = document.getElementById('overlayCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
      }

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!overlay.classList.contains('visible')) return;
        closeOverlay();
      });
    })();

    /**
     * Open image overlay only after full-res image is ready, so scale(0→1) animates at final size
     * (avoids thumbnail-then-swap jump from grid inline/base64 previews).
     */
    function openFullImageOverlay(overlay, content, overlayImage, fullSrc) {
      content.style.left = '';
      content.style.top = '';
      content.classList.remove('overlay-content-open');

      function reveal() {
        overlay.classList.add('visible');
        document.body.classList.add('overlay-open');
        requestAnimationFrame(() => {
          requestAnimationFrame(() => content.classList.add('overlay-content-open'));
        });
      }

      function afterDimensionsReady() {
        if (typeof overlayImage.decode === 'function') {
          overlayImage.decode().then(reveal).catch(reveal);
        } else {
          reveal();
        }
      }

      overlayImage.src = fullSrc;

      if (overlayImage.complete) {
        afterDimensionsReady();
      } else {
        overlayImage.addEventListener('load', afterDimensionsReady, { once: true });
        overlayImage.addEventListener('error', reveal, { once: true });
      }
    }

    // Dedicated overlay for Me-1.png
    (function () {
      const overlay = document.getElementById('me1Overlay');
      const content = document.getElementById('me1OverlayContent');
      const overlayImage = document.getElementById('me1OverlayImage');
      if (!overlay || !content || !overlayImage) return;

      const me1ItemImg = document.querySelector('img[alt="Me-1"]');
      const me1Item = me1ItemImg ? me1ItemImg.closest('.grid-item') : null;
      if (me1Item && me1ItemImg) {
        me1Item.addEventListener('click', () => {
          const fullSrc = new URL('assets/me-1_alt.png', window.location.href).href;
          openFullImageOverlay(overlay, content, overlayImage, fullSrc);
        });
      }

      function closeOverlay() {
        content.classList.remove('overlay-content-open');
        content.style.left = '';
        content.style.top = '';
        overlay.classList.remove('visible');
        document.body.classList.remove('overlay-open');
        overlayImage.removeAttribute('src');
      }

      overlay.addEventListener('click', () => {
        closeOverlay();
      });

      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      const closeBtn = document.getElementById('me1OverlayCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
      }

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!overlay.classList.contains('visible')) return;
        closeOverlay();
      });
    })();

    // Dedicated overlay for Me-2.png
    (function () {
      const overlay = document.getElementById('me2Overlay');
      const content = document.getElementById('me2OverlayContent');
      const overlayImage = document.getElementById('me2OverlayImage');
      if (!overlay || !content || !overlayImage) return;

      const me2ItemImg = document.querySelector('img[alt="Me-2"]');
      const me2Item = me2ItemImg ? me2ItemImg.closest('.grid-item') : null;
      if (me2Item && me2ItemImg) {
        me2Item.addEventListener('click', () => {
          const fullSrc = new URL('assets/me-2_full.png', window.location.href).href;
          openFullImageOverlay(overlay, content, overlayImage, fullSrc);
        });
      }

      function closeOverlay() {
        content.classList.remove('overlay-content-open');
        content.style.left = '';
        content.style.top = '';
        overlay.classList.remove('visible');
        document.body.classList.remove('overlay-open');
        overlayImage.removeAttribute('src');
      }

      overlay.addEventListener('click', () => {
        closeOverlay();
      });

      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      const closeBtn = document.getElementById('me2OverlayCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
      }

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!overlay.classList.contains('visible')) return;
        closeOverlay();
      });
    })();

    // Dedicated overlay for Miller.png
    (function () {
      const overlay = document.getElementById('millerOverlay');
      const content = document.getElementById('millerOverlayContent');
      const overlayImage = document.getElementById('millerOverlayImage');
      if (!overlay || !content || !overlayImage) return;

      const millerItemImg = document.querySelector('img[alt="Miller"]');
      const millerItem = millerItemImg ? millerItemImg.closest('.grid-item') : null;
      if (millerItem && millerItemImg) {
        millerItem.addEventListener('click', () => {
          const fullSrc = new URL('assets/miller_full.png', window.location.href).href;
          openFullImageOverlay(overlay, content, overlayImage, fullSrc);
        });
      }

      function closeOverlay() {
        content.classList.remove('overlay-content-open');
        content.style.left = '';
        content.style.top = '';
        overlay.classList.remove('visible');
        document.body.classList.remove('overlay-open');
        overlayImage.removeAttribute('src');
      }

      overlay.addEventListener('click', () => {
        closeOverlay();
      });

      content.addEventListener('click', (e) => {
        e.stopPropagation();
      });

      const closeBtn = document.getElementById('millerOverlayCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
      }

      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!overlay.classList.contains('visible')) return;
        closeOverlay();
      });
    })();

    (function() {
      const projItems = document.querySelectorAll('.proj-item[data-body-class]');
      const hoverVideos = {
        'hover-sq-handheld': document.getElementById('sq-handheld-hover-video'),
        'hover-lululemon': document.getElementById('lululemon-hover-video'),
        'hover-the-ordinary': document.getElementById('the-ordinary-hover-video'),
        'hover-mirror': document.getElementById('mirror-hover-video'),
        'hover-whoop': document.getElementById('whoop-hover-video'),
        'hover-sq-fb': document.getElementById('square-fb-hover-video'),
        'hover-archive': document.getElementById('archive-hover-video')
      };
      const mirrorVideo = document.getElementById('mirror-hover-video');
      if (mirrorVideo) {
        mirrorVideo.addEventListener('error', () => {
          if (document.body.classList.contains('hover-mirror')) {
            document.body.classList.add('mirror-video-fallback');
          }
        });
        mirrorVideo.addEventListener('canplay', () => {
          document.body.classList.remove('mirror-video-fallback');
        });
      }
      projItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
          document.body.classList.remove('mirror-video-fallback');
          document.body.classList.add(item.dataset.bodyClass);
          const video = hoverVideos[item.dataset.bodyClass];
          if (video) {
            // Archive: restart from the beginning each time the pointer re-enters after leaving.
            if (item.dataset.bodyClass === 'hover-archive') {
              try {
                video.currentTime = 0;
              } catch (e) {}
            }
            video.play().catch(function() {});
          }
        });
        item.addEventListener('mouseleave', () => {
          const video = hoverVideos[item.dataset.bodyClass];
          if (video) video.pause();
          document.body.classList.remove(item.dataset.bodyClass, 'mirror-video-fallback');
        });
      });
    })();
    
      function toggleMenu() {
      const menu = document.getElementById('navMenu');
      menu.classList.toggle('open');
    }

    // Allow clicking anywhere on the dropdown container/pill to toggle the menu.
    // (Exclude clicks inside the open menu so links behave normally.)
    (function () {
      const dropdown = document.getElementById('navDropdown');
      if (!dropdown) return;

      dropdown.addEventListener('click', (e) => {
        if (e.target.closest('#navMenu')) return;
        toggleMenu();
      });
    })();

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      const dropdown = document.getElementById('navDropdown');
      if (!dropdown.contains(e.target)) {
        document.getElementById('navMenu').classList.remove('open');
      }
    });

    // Footer: Local Time (Los Angeles, CA)
    (function () {
      const els = document.querySelectorAll('#footerLocalTime');
      if (!els || !els.length) return;

      const fmt = new Intl.DateTimeFormat(undefined, {
        timeZone: 'America/Los_Angeles',
        hour: 'numeric',
        minute: '2-digit',
      });

      function update() {
        const text = fmt.format(new Date());
        document.querySelectorAll('#footerLocalTime').forEach(el => {
          el.textContent = text;
        });
      }

      update();
      window.setInterval(update, 1000 * 30);
      window.__ckUpdateFooterLocalTime = update;
    })();

    // Project Drawer: load project page content into a sliding panel (home -> project)
    (function () {
      const drawer = document.getElementById('projDrawer');
      const drawerPanelA = document.getElementById('projDrawerPanelA');
      const drawerPanelB = document.getElementById('projDrawerPanelB');
      const drawerInnerA = document.getElementById('projDrawerInnerA');
      const drawerInnerB = document.getElementById('projDrawerInnerB');
      const navPageLabel = document.querySelector('.nav-page-label');

      const grid = document.querySelector('.item-grid');
      if (!drawer || !drawerPanelA || !drawerPanelB || !drawerInnerA || !drawerInnerB || !grid) return; // run only on homepage

      // file:// — browsers block fetch() for sibling HTML files, so the drawer would never load.
      // Skip interception and let <a href> open project pages normally.
      if (window.location.protocol === 'file:') {
        return;
      }

      /* Don't cache parsed project HTML: stale clones hide updates (e.g. new sections)
         until a full page reload. Browser fetch uses no-store so HTML edits show up. */
      const navMenu = document.getElementById('navMenu');
      const homeHref = new URL('index.html', window.location.href).href;

      let active = { panel: drawerPanelA, inner: drawerInnerA };
      let inactive = { panel: drawerPanelB, inner: drawerInnerB };

      let currentProjectHref = null;
      let navLoopRunning = false;
      let latestRequestHref = null;
      /** True after a successful pushState when opening a project from home (so close can history.back). */
      let drawerHistoryPushed = false;

      /** Relative filename for History API (same folder as index), e.g. whoop.html */
      function getProjectHistoryPath(targetHref) {
        try {
          const u = new URL(targetHref, window.location.href);
          const seg = u.pathname.split('/').filter(Boolean);
          return seg.pop() || 'index.html';
        } catch (e) {
          return 'index.html';
        }
      }

      function pushProjectHistory(targetHref) {
        if (typeof history === 'undefined' || !history.pushState) return;
        try {
          history.pushState({ ckDrawer: true }, '', getProjectHistoryPath(targetHref));
          drawerHistoryPushed = true;
        } catch (e) {
          drawerHistoryPushed = false;
        }
      }

      function replaceProjectHistory(targetHref) {
        if (typeof history === 'undefined' || !history.replaceState) return;
        try {
          history.replaceState({ ckDrawer: true }, '', getProjectHistoryPath(targetHref));
        } catch (e) {}
      }

      function isHomeHref(href) {
        try {
          const url = new URL(href, window.location.href);
          return url.pathname === '/' || url.pathname.endsWith('/index.html');
        } catch (e) {
          return href === homeHref;
        }
      }

      function getNavLabelForHref(href) {
        if (isHomeHref(href)) return 'Home';
        if (!navMenu) return '';

        const target = new URL(href, window.location.href);
        const match = Array.from(navMenu.querySelectorAll('a.nav-menu-item[href]')).find((a) => {
          const linkUrl = new URL(a.getAttribute('href'), window.location.href);
          return linkUrl.pathname === target.pathname;
        });
        return match ? match.textContent.trim() : '';
      }

      function setNavLabelForHref(href) {
        if (!navPageLabel) return;
        const label = getNavLabelForHref(href);
        navPageLabel.textContent = label || 'Home';
      }

      function setDrawerOpen(open) {
        document.body.classList.toggle('proj-drawer-open', open);
        if (open) document.body.classList.remove('proj-drawer-closing');
        drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
      }

      async function loadProjectContent(href) {
        const res = await fetch(href, {
          credentials: 'same-origin',
          cache: 'no-store',
        });
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        const layout = doc.querySelector('.layout');
        const footer = doc.querySelector('footer.site-footer') || doc.querySelector('.site-footer');

        const wrapper = document.createElement('div');
        wrapper.className = 'proj-drawer-content';
        if (layout) wrapper.appendChild(layout.cloneNode(true));
        if (footer) wrapper.appendChild(footer.cloneNode(true));

        return wrapper;
      }

      function stopHoverBackgrounds() {
        // Stop any active hover background videos + classes so the drawer panels are clean.
        document.querySelectorAll('video.hover-bg-video').forEach(v => {
          try { v.pause(); } catch (e) {}
        });
        Array.from(document.body.classList)
          .filter(c => c.startsWith('hover-'))
          .forEach(c => document.body.classList.remove(c));
      }

      function getDrawerTransitionMs(panel) {
        let dur = getComputedStyle(panel).transitionDuration || '0s';
        if (dur.includes(',')) {
          dur = dur.split(',')[0].trim();
        }
        if (dur.endsWith('ms')) return parseFloat(dur);
        if (dur.endsWith('s')) return parseFloat(dur) * 1000;
        return 860;
      }

      /** Next animation frame — helps WebKit commit the “closed” transform before toggling open. */
      function nextAnimationFrame() {
        return new Promise((resolve) => requestAnimationFrame(resolve));
      }

      async function prepareDrawerPanelTransition(panel) {
        panel.getBoundingClientRect();
        await nextAnimationFrame();
      }

      function isTransformTransitionProperty(name) {
        return (
          name === 'transform' ||
          name === '-webkit-transform' ||
          name === 'WebkitTransform'
        );
      }

      function waitForTransformTransition(panel) {
        const durationMs = getDrawerTransitionMs(panel);
        return new Promise((resolve) => {
          let done = false;
          const onEnd = (e) => {
            if (e.target !== panel) return;
            if (!isTransformTransitionProperty(e.propertyName)) return;
            if (done) return;
            done = true;
            panel.removeEventListener('transitionend', onEnd);
            resolve();
          };

          panel.addEventListener('transitionend', onEnd);
          window.setTimeout(() => {
            if (done) return;
            done = true;
            panel.removeEventListener('transitionend', onEnd);
            resolve();
          }, durationMs + 120);
        });
      }

      async function waitForDrawerContentReady(contentEl) {
        if (!contentEl) return;

        /* Lazy-loaded images (e.g. square-fb f+b-11.gif) may never fire load/error while the
           drawer is off-screen / visibility:hidden — the browser defers them. Force eager load. */
        contentEl.querySelectorAll('img').forEach((img) => {
          if (img.loading === 'lazy') {
            img.loading = 'eager';
          }
        });

        const imgs = Array.from(contentEl.querySelectorAll('img'));
        const perImgTimeoutMs = 30000;
        await Promise.all(
          imgs.map((img) => {
            if (img.complete) return Promise.resolve();
            return Promise.race([
              new Promise((resolve) => {
                const done = () => resolve();
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
              }),
              new Promise((resolve) => window.setTimeout(resolve, perImgTimeoutMs)),
            ]);
          })
        );

        // Also wait for fonts (if supported), with a cap so a stuck font load can't block forever.
        if (document.fonts && document.fonts.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise((r) => window.setTimeout(r, 4000)),
          ]);
        }
      }

      async function closePanelInstant(panel, inner) {
        // Close without visible motion by disabling transitions while hiding.
        panel.style.transition = 'none';
        panel.classList.remove('proj-drawer-panel--open', 'proj-drawer-panel--top', 'proj-drawer-panel--dimmed');
        inner.innerHTML = '';
        // Force style flush before restoring transition.
        panel.offsetHeight;
        panel.style.transition = '';
      }

      async function openProjectFromHome(targetHref) {
        currentProjectHref = targetHref;

        // Prepare the inactive panel (offscreen by default) with hidden content.
        inactive.inner.innerHTML = '<div class="proj-drawer-loading">Loading...</div>';
        const content = await loadProjectContent(targetHref);
        if (currentProjectHref !== targetHref) return;

        inactive.inner.innerHTML = '';
        content.style.visibility = 'hidden';
        inactive.inner.appendChild(content);

        if (typeof window.__ckUpdateFooterLocalTime === 'function') {
          window.__ckUpdateFooterLocalTime();
        }

        await waitForDrawerContentReady(content);
        if (currentProjectHref !== targetHref) return;

        content.style.visibility = 'visible';

        // Case study layout reserves space for the site header — unhide if it was clipped on the home grid.
        if (content.querySelector('.proj-header')) {
          document.querySelector('.site-header')?.classList.remove('hidden');
        }

        // Enable drawer + animate panel up.
        setDrawerOpen(true);
        await prepareDrawerPanelTransition(inactive.panel);
        inactive.panel.classList.add('proj-drawer-panel--open', 'proj-drawer-panel--top');

        await waitForTransformTransition(inactive.panel);
        inactive.panel.classList.remove('proj-drawer-panel--top');
        // Let hovered video/background remain visible during slide-in, then clean up.
        stopHoverBackgrounds();

        // Swap roles: the panel we just opened becomes active.
        const oldActive = active;
        active = inactive;
        inactive = oldActive;
        setNavLabelForHref(targetHref);
        pushProjectHistory(targetHref);
      }

      async function switchProjectToProject(targetHref) {
        // Project -> Project: new panel slides up; current stays visible underneath.
        stopHoverBackgrounds();
        currentProjectHref = targetHref;
        active.panel.classList.add('proj-drawer-panel--dimmed');

        inactive.inner.innerHTML = '<div class="proj-drawer-loading">Loading...</div>';
        const content = await loadProjectContent(targetHref);
        if (currentProjectHref !== targetHref) return;

        inactive.inner.innerHTML = '';
        content.style.visibility = 'hidden';
        inactive.inner.appendChild(content);

        if (typeof window.__ckUpdateFooterLocalTime === 'function') {
          window.__ckUpdateFooterLocalTime();
        }

        await waitForDrawerContentReady(content);
        if (currentProjectHref !== targetHref) return;

        content.style.visibility = 'visible';

        if (content.querySelector('.proj-header')) {
          document.querySelector('.site-header')?.classList.remove('hidden');
        }

        // Slide the new panel up on top.
        await prepareDrawerPanelTransition(inactive.panel);
        inactive.panel.classList.add('proj-drawer-panel--open', 'proj-drawer-panel--top');
        await waitForTransformTransition(inactive.panel);
        inactive.panel.classList.remove('proj-drawer-panel--top');

        // Remove current panel instantly (no slide-down).
        await closePanelInstant(active.panel, active.inner);

        // Swap roles.
        const oldActive = active;
        active = inactive;
        inactive = oldActive;
        setNavLabelForHref(targetHref);
        replaceProjectHistory(targetHref);
      }

      async function animateCloseDrawerToHome() {
        currentProjectHref = null;

        /* Drop backdrop in sync with slide-down (same timing as :has(.proj-drawer-panel--open) did) */
        document.body.classList.remove('proj-drawer-open');
        document.body.classList.add('proj-drawer-closing');

        await prepareDrawerPanelTransition(active.panel);
        active.panel.classList.remove('proj-drawer-panel--top');
        active.panel.classList.remove('proj-drawer-panel--dimmed');
        active.panel.classList.remove('proj-drawer-panel--open');
        await waitForTransformTransition(active.panel);

        active.inner.innerHTML = '';

        document.body.classList.remove('proj-drawer-closing');
        setDrawerOpen(false);

        await closePanelInstant(inactive.panel, inactive.inner);
        setNavLabelForHref(homeHref);
      }

      async function closeProjectToHome() {
        await animateCloseDrawerToHome();
        if (drawerHistoryPushed) {
          drawerHistoryPushed = false;
          history.back();
        }
      }

      async function navigateToProjectPage(targetHref) {
        if (isHomeHref(targetHref)) {
          if (document.body.classList.contains('proj-drawer-open')) {
            await closeProjectToHome();
          }
          return;
        }

        if (document.body.classList.contains('proj-drawer-open') && currentProjectHref === targetHref) {
          return; // already showing this project
        }

        if (document.body.classList.contains('proj-drawer-open')) {
          // Between two project pages.
          await switchProjectToProject(targetHref);
        } else {
          // Home -> Project.
          await openProjectFromHome(targetHref);
        }
      }

      function requestProjectNavigation(targetHref) {
        latestRequestHref = targetHref;
        if (navLoopRunning) return;

        navLoopRunning = true;
        (async () => {
          try {
            while (latestRequestHref) {
              const href = latestRequestHref;
              latestRequestHref = null;
              try {
                await navigateToProjectPage(href);
              } catch (err) {
                window.location.assign(href);
              }
            }
          } finally {
            navLoopRunning = false;
          }
        })();
      }

      window.__ckRequestProjectNavigation = requestProjectNavigation;

      /* Deep-link: standalone project → index with drawer (see proj-next-link handler below) */
      const pendingDrawerHref = sessionStorage.getItem('ckDrawerProject');
      if (pendingDrawerHref) {
        sessionStorage.removeItem('ckDrawerProject');
        requestAnimationFrame(() => {
          requestProjectNavigation(pendingDrawerHref);
        });
      }

      /* Delegated: clicks on SVG/text inside the anchor still hit the project link. */
      grid.addEventListener('click', (e) => {
        const t = e.target;
        if (!t || typeof t.closest !== 'function') return;
        const link = t.closest('a.grid-item.proj-item[href]');
        if (!link) return;
        if (e.defaultPrevented) return;
        if (e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        requestProjectNavigation(link.href);
      });

      // Dropdown nav selections also navigate via the same drawer animation.
      if (navMenu) {
        navMenu.addEventListener('click', (e) => {
          const a = e.target.closest('a.nav-menu-item[href]');
          if (!a) return;
          e.preventDefault();
          navMenu.classList.remove('open');
          requestProjectNavigation(a.href);
        });
      }

      // "Go back" controls: ESC and clicking the logo/Home link while open.
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (!document.body.classList.contains('proj-drawer-open')) return;
        requestProjectNavigation(homeHref);
      });

      const logo = document.querySelector('a.logo[href="/"]') || document.querySelector('a.logo');
      if (logo) {
        logo.addEventListener('click', (e) => {
          if (!document.body.classList.contains('proj-drawer-open')) return;
          e.preventDefault();
          requestProjectNavigation(homeHref);
        });
      }

      // Browser Back/Forward: URL already changed — sync drawer if user hit Back to home while drawer was open.
      window.addEventListener('popstate', () => {
        if (!document.body.classList.contains('proj-drawer-open')) return;
        if (isHomeHref(window.location.href)) {
          drawerHistoryPushed = false;
          void animateCloseDrawerToHome();
        }
      });
    })();

    // Next → project links: same drawer animation as nav / grid (home + drawer), or index handoff from standalone
    (function () {
      document.addEventListener('click', (e) => {
        const a = e.target.closest('a.proj-next-link');
        if (!a) return;

        const hrefAttr = a.getAttribute('href');
        if (!hrefAttr || hrefAttr === '#') return;

        let targetHref;
        try {
          targetHref = new URL(hrefAttr, window.location.href).href;
        } catch (err) {
          return;
        }

        const onHome = !!document.querySelector('.item-grid');
        const drawerOpen = document.body.classList.contains('proj-drawer-open');
        const navFn =
          typeof window.__ckRequestProjectNavigation === 'function' ? window.__ckRequestProjectNavigation : null;

        if (onHome && drawerOpen && navFn) {
          e.preventDefault();
          navFn(targetHref);
          return;
        }

        if (document.querySelector('.proj-header') && !onHome) {
          e.preventDefault();
          try {
            sessionStorage.setItem('ckDrawerProject', targetHref);
          } catch (err) {}
          window.location.href = new URL('index.html', window.location.href).href;
        }
      });
    })();
