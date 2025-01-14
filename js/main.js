gsap.registerPlugin(ScrollTrigger);
// let mm = gsap.matchMedia();

// lenis scrollsmoothhhh
function initScrollSmooth() {
  const locoScroll = new LoconativeScroll({
    el: document.querySelector("[data-scroll-container]"),
    scrollToEasing: (t) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2,
    smooth: true,
    duration: 0.75,
  });

  window.onresize = locoScroll.update();
  locoScroll.on("scroll", () => ScrollTrigger.update());

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}

function initPinPortfolioTabs() {
  ScrollTrigger.create({
    trigger: ".portfolio-desc-section .row",
    pin: ".portfolio-desc-section .tabs-link-wrap",
    start: "top 10%",
    end: () =>
      "+=" +
      document.querySelector(".portfolio-desc-section .tabContent.active")
        .offsetHeight /
      1.5,
  });
}

// refresh on screen size
function initWindowResize() {
  let currentWidth = $(window).width();
  $(window).on("resize", function () {
    if (
      $(window).width() - currentWidth > 300 ||
      currentWidth - $(window).width() > 300
    ) {
      currentWidth = $(this).width();
      location.reload();
    }
  });
}

// Hamburger Nav Open/Close
function initHamburger() {
  $("[data-toggle='modal-nav-mobile']").click(function () {
    if ($("header").hasClass("nav-mobile-not-active")) {
      openMobileNav();
    } else {
      closeMobileNav();
    }
  });

  $("[data-close='modal']").click(function () {
    closeMobileNav();
  });

  // add active class to the link selection
  var activeUlMobile = document.getElementById("ul-mobile");
  var activeLink = activeUlMobile.getElementsByClassName("mobile-link");
  for (var i = 0; i < activeLink.length; i++) {
    activeLink[i].addEventListener("click", function () {
      closeMobileNav();
      var current = document.getElementsByClassName("nav-active");
      current[0].className = current[0].className.replace(" nav-active", "");
      this.className += " nav-active";
    });
  }

  ScrollTrigger.refresh();

  function openMobileNav() {
    $("header").addClass("nav-mobile-active");
    $("header").removeClass("nav-mobile-not-active");
    // Add the modal-open class to disable scrolling
    $("body").addClass("modal-open");
  }

  function closeMobileNav() {
    $("header").addClass("nav-mobile-not-active");
    $("header").removeClass("nav-mobile-active");
    // Remove the modal-open class to enable scrolling
    $("body").removeClass("modal-open");
  }
}

// added active class to menu links
function initMenuLinks() {
  let mainUrl = window.location.href;
  $(".link-desktop li a").each(function () {
    if (this.href === mainUrl) {
      $(this).addClass("active");
    }
  });
}

// add active class when scrolling to each section
function initScrollingMenuLinks() {
  const navLinks = document.querySelectorAll(".link-desktop-center a");

  // Function to update active link based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll("[data-scroll-section]");
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - sectionHeight / 3) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").slice(1) === current) {
        link.classList.add("active");
      }
    });
  }

  // Listen for scroll events
  window.addEventListener("scroll", updateActiveLink);

  // Initial call to set active link based on current position
  updateActiveLink();
}

// custom cursor
function initCustomCursor() {

  var posXBtn = 0;
  var posYBtn = 0;
  var posXImage = 0;
  var posYImage = 0;
  var mouseX = 0;
  var mouseY = 0;

  if (document.querySelector(".custom-cursor")) {
    gsap.to({}, 0.0083333333, {
      repeat: -1,
      onRepeat: function () {
        if (document.querySelector(".custom-cursor")) {
          posXBtn += (mouseX - posXBtn) / 5;
          posYBtn += (mouseY - posYBtn) / 5;
          gsap.set($(".custom-cursor"), {
            css: {
              left: posXBtn,
              top: posYBtn,
            },
          });
        }
        if (document.querySelector(".mouse-pos-list-image")) {
          posXImage += (mouseX / 1 - posXImage) / 5;
          posYImage += (mouseY - posYImage) / 5;
          gsap.set($(".mouse-pos-list-image"), {
            css: {
              left: posXImage,
              top: posYImage,
            },
          });
          gsap.set($(".mouse-pos-list-rotate"), {
            css: {
              rotate: (mouseX - posXBtn) / 20,
            },
          });
        }
      },
    });
  }

  $(window).on("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Mouse Init - Deploy the mouse position
  $("main").on("mousemove", function () {
    if ($(".custom-cursor").hasClass("cursor-init")) {
    } else {
      $(".custom-cursor").addClass("cursor-init");
    }
  });

  $(document).mouseleave(function () {
    $(".custom-cursor").removeClass("cursor-init");
  });

  // Normal Hover
  $("[data-cursor-text]").on("mouseenter", function () {
    let dataText = $(this).data("cursor-text");
    let dataBackgroundColor = $(this).data("background-color");
    $(".custom-cursor").addClass("cursor-hover");
    $(".custom-cursor").find(".cursor-text").text(dataText);
    $(".custom-cursor")
      .find(".cursor-normal-before")
      .css("background-color", dataBackgroundColor);
    $(".custom-cursor")
      .find(".cursor-text")
      .css("--cursor-speed", " " + dataText.length + "s");
  });
  $("[data-cursor-text]").on("mouseleave", function () {
    $(".custom-cursor").removeClass("cursor-hover");
  });

  // Link Hover
  $("a, .hover").on("mouseenter", function () {
    $(".custom-cursor").addClass("cursor-hover-link");
  });
  $("a, .hover").on("mouseleave", function () {
    $(".custom-cursor").removeClass("cursor-hover-link");
  });

  // Pressed
  $("main").on("mousedown", function () {
    $(".custom-cursor").addClass("pressed");
  });
  $("main").on("mouseup", function () {
    $(".custom-cursor").removeClass("pressed");
  });

  // Mouse pos list image
  $(".mouse-pos-list-image-hover").on("mouseenter", function () {
    $(".mouse-pos-list-image").addClass("active");
  });
  $(".mouse-pos-list-image-hover").on("mouseleave", function () {
    $(".mouse-pos-list-image").removeClass("active");
  });

  $(".mouse-pos-list-image-ul li").on("mouseenter mouseleave", function () {
    var index = $(this).index();
    $(".mouse-pos-list-image-ul, .mouse-pos-list-image").each(function () {
      $("li", this).eq(index).siblings().removeClass("active");
      $("li", this).eq(index).addClass("active");
    });
  });
}


// swiper
function initSwiper() {
  // hero swiper
  var isHovered = false; // Track hover state

  var swiper = new Swiper(".swiper.hero-swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 1000,
    effect: "fade",
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
      waitForTransition: true,
    },
  });

  swiper.el.addEventListener("mouseenter", () => {
    isHovered = true;
    swiper.autoplay.stop(); // Pause autoplay on hover
  });

  swiper.el.addEventListener("mouseleave", () => {
    isHovered = false;
    if (!swiper.autoplay.running) {
      swiper.autoplay.start(); // Resume autoplay when not on hover
    }
  });

  // Wait for the page to load before starting autoplay/swiper
  window.addEventListener("load", initSwiper);

  // top stories swiper (desktop)
  var topStoriesThumbnail = new Swiper(".swiper.top-stories-thumb", {
    loop: true,
    spaceBetween: 10,
    speed: 1000,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  });

  var topsToriesMain = new Swiper(".swiper.top-stories", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    speed: 1000,
    navigation: {
      nextEl: ".custom-nav-wrapper.top-stories .custom-button-next",
      prevEl: ".custom-nav-wrapper.top-stories .custom-button-prev",
    },
    thumbs: {
      swiper: topStoriesThumbnail,
    },
    effect: "creative",
    creativeEffect: {
      prev: {
        shadow: true,
        translate: ["-20%", 0, -1],
      },
      next: {
        translate: ["100%", 0, 0],
      },
    },


  });

  // top stories swiper (mobile)
  var topStoriesMobile = new Swiper(".swiper.top-stories-mobile", {
    slidesPerView: 1,
    spaceBetween: 5,
    centeredSlides: true,
    navigation: {
      nextEl: ".custom-nav-wrapper.top-stories-mobile .custom-button-next",
      prevEl: ".custom-nav-wrapper.top-stories-mobile .custom-button-prev",
    },
    pagination: {
      el: ".custom-pagination-wrapper.top-stories-mobile",
      dynamicBullets: false,
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
    },
  });

  // other stories tab (mobile)
  var otherStoriesTabMobile = new Swiper(".swiper.other-stories-tab-mobile", {
    slidesPerView: 3,
    spaceBetween: 5,
  });
}

//  added class to header when scrolling
function initHeaderClass() {
  // when scrolling
  var WindowHeight = jQuery(window).height();

  var load_element = 0;

  //position of element
  var scroll_position = jQuery(".header").offset().top;

  var screen_height = jQuery(window).height();
  var activation_offset = 0;
  var max_scroll_height = jQuery("body").height() + screen_height;

  var scroll_activation_point =
    scroll_position - screen_height * activation_offset;

  jQuery(window).on("scroll", function (e) {
    var y_scroll_pos = window.pageYOffset;
    var element_in_view = y_scroll_pos > scroll_activation_point;
    var has_reached_bottom_of_page =
      max_scroll_height <= y_scroll_pos && !element_in_view;

    if (element_in_view || has_reached_bottom_of_page) {
      jQuery(".header").addClass("header-scrolled");
    } else {
      jQuery(".header").removeClass("header-scrolled");
    }
  });

  function initHideNavbar() {
    // hide and show header
    let lastScrollTop = 0;
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scrolling down, hide the navbar
        navbar.classList.add("hidden");
      } else {
        // Scrolling up, reveal the navbar
        navbar.classList.remove("hidden");
      }

      lastScrollTop = scrollTop;
    });
  }
  initHideNavbar();
}

// general tab
function initTab() {
  function initCustomTab(tabSelector, contentSelector, randomContentSelector) {
    let tabs = document.querySelectorAll(tabSelector);
    let tabContents = document.querySelectorAll(contentSelector);
    let tabContentRandom = document.querySelector(randomContentSelector);
    let otherStoriesWrapper = tabContentRandom.querySelector(
      ".other-stories-wrapper"
    );
    let loadMoreButtonRandom = document.getElementById("loadMoreButtonRandom");

    // Select the second to fifth tabContents
    let selectedTabContents = Array.from(tabContents).slice(1, 5);

    // Array to store the selected card-wraps and a set to track already added card-wraps
    let selectedCardWraps = [];
    let addedCardWraps = new Set();

    // Randomly select one card-wrap from each tabContent
    selectedTabContents.forEach((tabContent) => {
      let cardWraps = Array.from(tabContent.querySelectorAll(".cards-wrap"));
      let randomIndex = Math.floor(Math.random() * cardWraps.length);
      let randomCardWrap = cardWraps[randomIndex];

      // Clone and append the randomized card-wrap to other-stories-wrapper
      let clonedCardWrap = randomCardWrap.cloneNode(true);
      otherStoriesWrapper.appendChild(clonedCardWrap);
      selectedCardWraps.push(clonedCardWrap);
      addedCardWraps.add(randomCardWrap);
    });

    // Append the remaining card-wraps in order of their respective tabContents (1, 2, 3, 4)
    selectedTabContents.forEach((tabContent) => {
      let cardWraps = Array.from(tabContent.querySelectorAll(".cards-wrap"));

      cardWraps.forEach((cardWrap) => {
        if (!addedCardWraps.has(cardWrap)) {
          let clonedCardWrap = cardWrap.cloneNode(true);
          clonedCardWrap.classList.add("hidden");
          otherStoriesWrapper.appendChild(clonedCardWrap);
          addedCardWraps.add(cardWrap);
        }
      });
    });

    // Show the tabContentRandom initially
    tabContentRandom.classList.add("active");

    // Add event listener to the load more button
    loadMoreButtonRandom.addEventListener("click", () => {
      let hiddenCardWraps =
        otherStoriesWrapper.querySelectorAll(".cards-wrap.hidden");
      hiddenCardWraps.forEach((cardWrap) => {
        cardWrap.classList.remove("hidden");
      });
      loadMoreButtonRandom.style.display = "none"; // Hide the button after showing all card-wraps
    });

    // Default tab event listener
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        tabContents.forEach((content) => {
          content.classList.remove("active");
        });

        tabContentRandom.classList.remove("active");

        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });

        // Show the tabContent corresponding to the clicked tab
        let tabContent = tabContents[index];
        tabContent.classList.add("active");

        // Highlight the clicked tab
        tabs[index].classList.add("active");
      });
    });
  }

  initCustomTab(
    ".tabLinks",
    ".tab-wrapper .tabContent",
    ".tab-wrapper .tabContentRandom"
  );
}

// fixed class on mobile tabs
function initFixedTabOnScroll() {
  window.addEventListener("scroll", function () {
    let fixedTabs = document.getElementById("fixed-tabs");
    let fixedBody = document.getElementById("fixed-body");
    let rect = fixedBody.getBoundingClientRect();

    if (rect.top <= 20) {
      fixedTabs.classList.add("fixed-on-visible");
      fixedBody.classList.add("margin-on-visible");
    } else {
      fixedTabs.classList.remove("fixed-on-visible");
      fixedBody.classList.remove("margin-on-visible");
    }
  });
}



function initScrollingClass() {
  let changeColor = gsap.utils.toArray(
    ".btn-link.btn-nav-home a, .link-navbar-wrapper .link-desktop.link-desktop-left, header .hamburger"
  );

  gsap.utils.toArray(".dark-theme, .light-theme").forEach((section) => {
    let isDark = section.classList.contains("dark-theme");
    ScrollTrigger.create({
      trigger: section,
      markers: false,
      start: "0% 7.5%",
      end: () => "+=" + section.offsetHeight,
      onToggle: (self) => {
        if (self.isActive) {
          changeColor.forEach((section) => {
            let classList = section.classList;
            if (isDark) {
              classList.add("light-theme");
              classList.remove("dark-theme");
            } else {
              classList.add("dark-theme");
              classList.remove("light-theme");
            }
          });
        }
      },
    });
  });

  ScrollTrigger.refresh();
}

// custom dropdown selection
function initCustomDropdown() {
  $("select").each(function () {
    var $this = $(this),
      numberOfOptions = $(this).children("option").length;

    $this.addClass("select-hidden");
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');

    var $styledSelect = $this.next("div.select-styled");
    $styledSelect.text($this.children("option").eq(0).text());

    var $list = $("<ul />", {
      class: "select-options",
    }).insertAfter($styledSelect);

    for (var i = 0; i < numberOfOptions; i++) {
      $("<li />", {
        text: $this.children("option").eq(i).text(),
        rel: $this.children("option").eq(i).val(),
      }).appendTo($list);
      if ($this.children("option").eq(i).is(":selected")) {
        $('li[rel="' + $this.children("option").eq(i).val() + '"]').addClass(
          "is-selected"
        );
      }
    }

    var $listItems = $list.children("li");

    $styledSelect.click(function (e) {
      e.stopPropagation();
      $("div.select-styled.active")
        .not(this)
        .each(function () {
          $(this).removeClass("active").next("ul.select-options").hide();
        });
      $(this).toggleClass("active").next("ul.select-options").toggle();
    });

    $listItems.click(function (e) {
      e.stopPropagation();
      $styledSelect.text($(this).text()).removeClass("active");
      $this.val($(this).attr("rel"));
      $list.find("li.is-selected").removeClass("is-selected");
      $list
        .find('li[rel="' + $(this).attr("rel") + '"]')
        .addClass("is-selected");
      $list.hide();
    });

    $(document).click(function () {
      $styledSelect.removeClass("active");
      $list.hide();
    });
  });
}

// load more function
function initLoadMore() {
  $(document).ready(function () {
    function showInitialResults() {
      if (window.matchMedia("(min-width: 1500px)").matches) {
        return 4;
      }
      return 4;
    }

    function loadMoreResults() {
      if (window.matchMedia("(min-width: 1500px)").matches) {
        return 8;
      }
      return 8;
    }

    $(".results-block").slice(0, showInitialResults()).show();

    if ($(".results-block:hidden").length !== 0) {
      $("#loadMoreButton").show();
    }

    $("#loadMoreButton").on("click", function (e) {
      e.preventDefault();
      $(".results-block:hidden")
        .slice(0, loadMoreResults())
        .slideDown("fast", function () {
          // Trigger an update of ScrollTrigger when new content is loaded
          ScrollTrigger.refresh();
        });
      if ($(".results-block:hidden").length === 0) {
        $("#loadMoreButton").text("End of results");
        $("#loadMoreButton").addClass("disabled");
      }
    });
  });
}

// this will pin the element while scrolling down -> usage on other stories tabs
function initPinScrollItems() {
  if (window.matchMedia("(min-width: 1025px)").matches) {
    ScrollTrigger.create({
      trigger: ".other-stories-parent",
      start: "top 10%",
      end: ".other-stories-section .stories-block-wrap",
      pin: ".sticky-scroll",
      markers: true,
    });
  }
}

// trigger element
function initTextReveal() {
  // trigger text/element on scroll
  let headers = gsap.utils.toArray(".triggerElement");
  headers.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      yPercent: 10,
      duration: 1.2,
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "resume pause resume pause",
      },
      ease: "power4.inOut",
    });
  });

  let triggerText = gsap.utils.toArray(".triggerText");
  triggerText.forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      yPercent: 100,
      duration: 1.2,
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "resume pause resume pause",
      },
      ease: "power4.inOut",
    });
  });

  // Select all elements with the class 'triggerPartnerLogo'
  let triggerPartnerLogo = gsap.utils.toArray(".triggerPartnerLogo");

  triggerPartnerLogo.forEach((el) => {
    // Create an animation for each 'triggerPartnerLogo' element
    gsap.from(el, {
      opacity: 0,
      yPercent: 50,
      duration: 1.2,
      scrollTrigger: {
        trigger: ".other-stories-section",
        start: "top 60%",
        end: "bottom top",
        toggleActions: "resume pause resume pause",
      },
      ease: "power4.inOut",
    });
  });
}

// trigger highlight text
function initHighlightTextReveal() {
  // Select all elements with the class 'text-highlight'
  const highlightTextElements = document.querySelectorAll(".text-highlight");

  // Create a ScrollTrigger for each 'text-highlight' element
  highlightTextElements.forEach((highlightText) => {
    gsap.to(highlightText, {
      scrollTrigger: {
        trigger: highlightText,
        start: "top 90%", // Adjust this as needed
        onEnter: () => {
          highlightText.classList.add("active");
        },
      },
    });
  });
}

// preloader
function initPreloader(callback) {
  // animate preload images first
  const images = document.querySelectorAll(".preload-image.normal");
  const scaleImage = document.querySelector(".preload-image.scale");
  const heroTitleWrap = document.querySelector(".hero-title-wrap");
  const logoHeroWrap = document.querySelector(".logo-hero-wrap");
  const descWrap = document.querySelector(".desc-wrap");
  const tl = gsap.timeline();

  // Animate the other images to appear at random positions
  images.forEach((image, index) => {
    if (index !== 0) {

      // animate the image
      tl.fromTo(
        image,
        { scale: 0.3, opacity: 0 },
        {
          scale: 0.8,
          opacity: 1,
          duration: 0.5,
          ease: "power1.inOut",
        },
        "-=0.3"
      );
    }
  });

  // Continue with the rest of the preloader animations
  tl.to(
    ".preload-image.normal",
    1.5,
    {
      opacity: 0,
      scale: 0.2,
      yPercent: 100,
      ease: "power4.inOut",
    },
    "-=0.3"
  );


  tl.to(
    ".preloader-bg-wrapper",
    1.5,
    {
      scale: 0.3,
      yPercent: 100,
      ease: "power4.inOut",
    },
    "-=0.3"
  );

  // Add the animating class to hero-title-wrap
  tl.add(() => {
    heroTitleWrap.classList.add("animating");
  }, "-=1.0");

  tl.fromTo(
    heroTitleWrap,
    {
      top: "60%",
    },
    {
      top: "35%",
      duration: 1.0,
      ease: "power4.inOut",
    },
    "-=1.6"
  );

  // Add the animating class to desc-wrap
  tl.add(() => {
    descWrap.classList.add("animating");
  }, "-=1.0");

  tl.fromTo(
    descWrap,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power4.inOut",
    },
    "-=1.59"
  );

  // Add the animating class to logo hero wrap
  tl.add(() => {
    logoHeroWrap.classList.add("animating");
  }, "-=1.6");

  tl.fromTo(
    logoHeroWrap,
    {
      top: "50%",
    },
    {
      top: "20%",
      duration: 1.0,
      ease: "power4.inOut",
    },
    "-=1.6"
  );

  if (window.matchMedia("(max-width: 767px)").matches) {
    // Add the animating class to hero-title-wrap
    tl.add(() => {
      heroTitleWrap.classList.add("animating");
    }, "-=1.0");

    tl.fromTo(
      heroTitleWrap,
      {
        top: "58%",
      },
      {
        top: "24%",
        duration: 1.0,
        ease: "power4.inOut",
      },
      "-=1.6"
    );


    tl.add(() => {
      logoHeroWrap.classList.add("animating");
    }, "-=1.6");

    tl.fromTo(
      logoHeroWrap,
      {
        top: "47%",
      },
      {
        top: "16%",
        duration: 1.0,
        ease: "power4.inOut",
      },
      "-=1.6"
    );

  }

  // Optional: remove preloader after animations
  setTimeout(function () {
    var loadingPreload = document.getElementsByClassName("loading");
    loadingPreload[0].classList.add("removePreloader");
  }, 5000);

  setTimeout(callback, 4000);
}

//  Fire all scripts on page load
function init() {
  initScrollSmooth();
  initWindowResize();
  initHamburger();
  initScrollingMenuLinks();
  initCustomCursor();
  initSwiper();
  initHeaderClass();
  initTab();
  initFixedTabOnScroll();
  initScrollingClass();
  initCustomDropdown();
  initLoadMore();
  initTextReveal();
  // initPreloader();
}

window.onload = () => {
  init();
};


