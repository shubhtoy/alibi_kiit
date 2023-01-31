window.addEventListener('load', () => {
  document.documentElement.classList.remove('is-animating');
});

window.addEventListener('pageshow', (e) => {
  if (e.persisted) {
    window.location.reload();
  }
});

if (document.body.classList.contains('no-ajax')) {
  const links = document.querySelectorAll('a:not([target="_blank"]):not([href*=\\#]):not([href^=mailto]):not(a[data-fancybox]');

  links.forEach(e => {
    e.addEventListener('click', function(link) {
      document.documentElement.classList.add('is-animating');
    });
  });
}

if (document.body.classList.contains('swup-enabled')) {
  let containers = ['#swup'];

  if (document.querySelector('#wpadminbar')) {
    containers = ['#swup', '#wpadminbar'];
  }

  const swup = new Swup({
    containers: containers,
    cache: false,
    animateHistoryBrowsing: true,
    plugins: [
      new SwupBodyClassPlugin(),
      new SwupHeadPlugin(),
      new SwupScrollPlugin({
        animateScroll: false
      })
    ]
  })
  .on('contentReplaced', swupReload);
}

function swupReload() {
  themerainLoadMore();
  themerainAos();
  themerainHeader();
  themerainHero();
  themerainPortfolio();
  themerainVideoThumb();

  ScrollTrigger.refresh(true);

  // Init ThemeRain Core
  if (typeof themerainCore !== 'undefined') {
    themerainCore.init();
  }

  // Init Contact Form 7
  document.querySelectorAll('.wpcf7 > form').forEach(function(e) {
    return wpcf7.init(e);
  });

  // Init Elementor frontend
  if (typeof window.elementorFrontend !== 'undefined') {
    elementorFrontend.init();
  }

  // Google Analytics
  if (typeof window.ga !== 'undefined') {
    window.ga('set', 'title', document.title);
    window.ga('set', 'page', window.location.pathname + window.location.search);
    window.ga('send', 'pageview');
  }
}

function themerainLoadMore() {
  const button = document.querySelector('.load-more');
  const area = document.querySelector('.area');

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    if (button.classList.contains('loading')) {
      return;
    }

    button.classList.add('loading');

    let type = button.dataset.type,
        ppp = button.dataset.ppp,
        cpage = button.dataset.cpage,
        pages = button.dataset.pages,
        style = button.dataset.style;

    fetch(themerain.ajaxurl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        action: 'themerain_loadmore',
        type: type,
        ppp: ppp,
        cpage: cpage,
        pages: pages,
        style: style
      })
    })
    .then(response => response.text())
    .then(data => {
      area.insertAdjacentHTML('beforeend', data);
      themerainAos();
      themerainVideoThumb();

      cpage++;

      button.dataset.cpage = cpage;

      if (cpage == pages) {
        button.classList.add('hidden');
      }

      button.classList.remove('loading');
    });
  });
}
themerainLoadMore();

function themerainAos() {
  const sections = document.querySelectorAll('.hero-caption, .entry-header, .entry-content > *, .blog-area > *, .portfolio-area.grid > *, .portfolio-area.covers .project-caption, .blocks-gallery-grid > *, .wp-block-column, .entry-navigation, .load-more, .post-footer, .comment, .comment-respond');

  ScrollTrigger.batch(sections, {
    once: true,
    toggleClass: 'active'
  });
}
themerainAos();

function themerainHeader() {
  // Sticky header
  const showAnim = gsap.from('.site-header', {
    yPercent: -10,
    autoAlpha: 0,
    paused: true,
    duration: 0.3
  }).progress(1);

  ScrollTrigger.create({
    start: "100 top",
    end: 99999,
    onUpdate: (self) => {
      self.direction === -1 ? showAnim.play() : showAnim.reverse();
    }
  });

  // Header color
  if (document.querySelector('.site-hero')) {
    ScrollTrigger.create({
      trigger: '.site-hero',
      end: 'bottom 50',
      toggleClass: {
        targets: '.site-header',
        className: 'header--colored'
      }
    });
  }

  // Submenu animation
  const mediaQuery = window.matchMedia('(min-width: 1024px)')

  if (mediaQuery.matches) {
    const menuItems = document.querySelectorAll('.site-menu > ul > .menu-item-has-children');

    menuItems.forEach(e => {
      const items = document.querySelectorAll('.site-menu > ul > li');
      const submenuItems = e.querySelectorAll('.sub-menu li');

      e.addEventListener('mouseenter', function() {
        items.forEach(item => {
          if (e !== item) {
            item.classList.add('hidden');
          }
        });

        gsap.to(submenuItems, {
          opacity: 1,
          x: 0,
          duration: 0.2,
          stagger: 0.1
        });
      });

      e.addEventListener('mouseleave', function() {
        items.forEach(item => item.classList.remove('hidden'));

        gsap.to(submenuItems, {
          opacity: 0,
          x: -10,
          duration: 0.2,
          stagger: 0.1
        });
      });
    });
  }

  // Menu toggle
  document.querySelector('.menu-toggle').addEventListener('click', () => {
    document.body.classList.toggle('toggled-on');
  });

  // Submenu toggle
  const submenuParent = document.querySelectorAll('.site-menu .menu-item-has-children > a');
  submenuParent.forEach(e => {
    const toggle = document.createElement('span');
    toggle.setAttribute('class', 'dropdown-toggle');
    e.after(toggle);
  });

  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => toggle.parentNode.classList.toggle('submenu-open'));
  });

  if (document.querySelector('.site-menu .current-menu-ancestor')) {
    document.querySelector('.site-menu .current-menu-ancestor').classList.add('submenu-open');
  }
}
themerainHeader();

function themerainHero() {
  if (document.querySelector('.site-hero.style-fixed')) {
    ScrollTrigger.create({
      start: 'top -100',
      end: 99999,
      toggleClass: {
        className: 'has-scrolled',
        targets: '.site-hero.style-fixed'
      }
    });
  }

  if (document.querySelector('.site-hero.parallax-img .hero-media img')) {
    gsap.to('.site-hero.parallax-img .hero-media img', {
      y: '25%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.site-hero',
        start: 'top top',
        scrub: true
      }
    });
  }
}
themerainHero();

function themerainPortfolio() {
  // Slider style
  if (typeof Swiper !== 'undefined') {
    var swiperSlider = new Swiper('.portfolio-area.slider .swiper-container', {
      slidesPerView: 1,
      speed: 900,
      parallax: true,
      grabCursor: true,
      slideToClickedSlide: true,
      mousewheel: true,
      keyboard: {
        enabled: true
      },
      navigation: {
        nextEl: '.swiper-next'
      }
    });
  }

  // Carousel style
  if (typeof Swiper !== 'undefined') {
    var swiperCarousel = new Swiper('.portfolio-area.carousel .swiper-container', {
      slidesPerView: 1,
      grabCursor: true,
      spaceBetween: 0,
      keyboard: {
        enabled: true
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      breakpoints: {
        600: {
          slidesPerView: 2
        },
        1024: {
          slidesPerView: 3
        }
      }
    });
  }

  // Covers style
  const captions = document.querySelectorAll('.portfolio-area.covers .project-caption');

  captions.forEach(caption => {
    caption.addEventListener('mouseenter', function() {
      caption.parentNode.classList.add('hovered');
      captions.forEach(item => {
        if (caption !== item) {
          item.classList.add('hidden');
        }
      });
    });

    caption.addEventListener('mouseleave', function() {
      caption.parentNode.classList.remove('hovered');
      captions.forEach(item => item.classList.remove('hidden'));
    });
  });

  // Slider caption hover
  document.querySelectorAll('.portfolio-area.slider .project-caption h3 a').forEach(caption => {
    caption.addEventListener('mouseenter', function() {
      caption.parentNode.parentNode.classList.add('hovered');
    });

    caption.addEventListener('mouseleave', function() {
      caption.parentNode.parentNode.classList.remove('hovered');
    });
  });
}
themerainPortfolio();

function themerainVideoThumb() {
  document.querySelectorAll('.portfolio-area .has-hover-video').forEach(thumb => {
    thumb.addEventListener('mouseenter', function() {
      thumb.querySelector('video').play();
    });

    thumb.addEventListener('mouseleave', function() {
      thumb.querySelector('video').currentTime = 0;
    });
  });
}
themerainVideoThumb();
