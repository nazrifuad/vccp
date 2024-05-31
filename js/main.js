gsap.registerPlugin(ScrollTrigger);
// let mm = gsap.matchMedia();

// lenis scrollsmoothhhh
function initScrollSmooth() {
  // https://github.com/quentinhocde/loconative-scroll
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
    // end: "+=100",
    // markers: true
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
  // Sticky Cursor with delay
  // https://greensock.com/forums/topic/21161-animated-mouse-cursor/

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

// magnetic hover
// function initMagneticHover() {
//   const magneticHover = document.querySelectorAll(".m-hover");
//   var hoverMouse = function ($el) {
//     $el.each(function () {
//       var $self = $(this);
//       var hover = false;
//       var offsetHoverMax = $self.attr("offset-hover-max") || 0.8;
//       var offsetHoverMin = $self.attr("offset-hover-min") || 0.3;

//       var attachEventsListener = function () {
//         $(window).on("mousemove", function (e) {
//           //
//           var hoverArea = hover ? offsetHoverMax : offsetHoverMin;

//           // cursor
//           var cursor = {
//             x: e.clientX,
//             y: e.pageY,
//           };

//           // size
//           var width = $self.outerWidth();
//           var height = $self.outerHeight();

//           // position
//           var offset = $self.offset();
//           var elPos = {
//             x: offset.left + width / 2,
//             y: offset.top + height / 2,
//           };

//           // comparison
//           var x = cursor.x - elPos.x;
//           var y = cursor.y - elPos.y;

//           // dist
//           var dist = Math.sqrt(x * x + y * y);

//           // mutex hover
//           var mutHover = false;

//           // anim
//           if (dist < width * hoverArea) {
//             mutHover = true;
//             if (!hover) {
//               hover = true;
//             }
//             onHover(x, y);
//           }

//           // reset
//           if (!mutHover && hover) {
//             onLeave();
//             hover = false;
//           }
//         });
//       };

//       var onHover = function (x, y) {
//         TweenMax.to($self, 0.4, {
//           x: x * 0.3,
//           y: y * 0.3,
//           //scale: .9,
//           rotation: x * 0.02, // rotation
//           ease: Power2.easeOut,
//         });
//       };
//       var onLeave = function () {
//         TweenMax.to($self, 0.7, {
//           x: 0,
//           y: 0,
//           scale: 1,
//           rotation: 0,
//           // ease: Power2.easeOut
//           ease: Elastic.easeOut.config(1.2, 0.4),
//         });
//       };

//       attachEventsListener();
//     });
//   };

//   hoverMouse($(magneticHover));
// }

// parallax images
// function initParallaxImage() {
//   // if ($(window).width() > 1024) {

//   // expertise
//   const rotateImgTriggerExpertise = document.querySelectorAll(
//     ".overlay-img-parent.expertise"
//   );
//   const rotateImgElementExpertise = document.querySelectorAll(
//     ".overlay-img-parent.expertise img"
//   );
//   const rotateElementExpertise = gsap.timeline({
//     scrollTrigger: {
//       scrub: 1,
//       pin: true,
//       trigger: rotateImgTriggerExpertise,
//       start: "top 50%",
//       endTrigger: rotateImgTriggerExpertise,
//       end: "bottom 50%",
//       // markers: true
//     },
//   });

//   rotateElementExpertise.to(rotateImgElementExpertise, {
//     rotateZ: 100,
//   });

//   // faqs
//   const rotateImgTriggerFaqs = document.querySelectorAll(
//     ".overlay-img-parent.faqs"
//   );
//   const rotateImgElementFaqs = document.querySelectorAll(
//     ".overlay-img-parent.faqs img"
//   );
//   const rotateElementFaqs = gsap.timeline({
//     scrollTrigger: {
//       scrub: 1,
//       pin: true,
//       trigger: rotateImgTriggerFaqs,
//       start: "top 50%",
//       endTrigger: rotateImgTriggerFaqs,
//       end: "+=100",
//       // markers: true
//     },
//   });

//   rotateElementFaqs.to(rotateImgElementFaqs, {
//     rotateZ: 20,
//   });
// }

// pinning layered portfolio section
// https://gsap.com/community/forums/topic/33597-stacking-cards-overlap/
// function initPinningPortfolio() {
//   if ($(window).width() > 1024) {
//     const cards = gsap.utils.toArray(".portfolio .pinned");
//     const spacer = 50;
//     const minScale = 0.9;

//     const distributor = gsap.utils.distribute({
//       base: minScale,
//       amount: 0.05,
//     });

//     cards.forEach((card, index) => {
//       const scaleVal = distributor(index, cards[index], cards);

//       gsap.to(card, {
//         scrollTrigger: {
//           trigger: card,
//           start: "top 5%",
//           scrub: true,
//           // markers: true,
//           invalidateOnRefresh: true,
//         },
//         ease: "none",
//         scale: scaleVal,
//       });

//       const start = `top-=${index * spacer} 5%`;
//       const endTrigger = ".cards-grid.portfolio";

//       ScrollTrigger.create({
//         trigger: card,
//         start,
//         endTrigger,
//         end:
//           index < cards.length - 1
//             ? `bottom top+=${800 + cards.length * spacer}`
//             : `bottom-=${index * spacer} top+=${800 + cards.length * spacer}`,
//         pin: true,
//         pinSpacing: false,
//         // markers: true,
//         id: `pin-${index}`, // unique ID for each ScrollTrigger
//         invalidateOnRefresh: true,
//       });
//     });
//   }
// }

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

  // Function to manually start autoplay when the page loads
  // function startAutoplay() {
  //   if (!isHovered && !swiper.autoplay.running) {
  //     swiper.autoplay.start();
  //   }
  // }

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
    // pagination: {
    //   el: ".team-section .swiper-pagination",
    //   type: "progressbar",
    // },
    // on: {
    //   init: function () {
    //     // Initialize with the first slide's number and total number of slides
    //     document.querySelector(".current-slide-number").textContent = "01";
    //     document.querySelector(".total-slides").textContent = ("0" + this.slides.length).slice(-2);
    //   },
    //   slideChange: function () {
    //     // Get the current active slide index
    //     var activeIndex = this.activeIndex;

    //     // Format the activeIndex to have leading zeros if needed
    //     var formattedIndex = ("0" + (activeIndex + 1)).slice(-2);

    //     // Update the pagination-number element with the formatted index and total number of slides
    //     document.querySelector(".current-slide-number").textContent = formattedIndex;
    //   },
    // },
    // breakpoints: {
    //   320: {
    //     slidesPerView: 1
    //   },
    //   640: {
    //     slidesPerView: 2,
    //     spaceBetween: 30,
    //   },
    //   1024: {
    //     slidesPerView: 2,
    //     spaceBetween: 60,
    //   }
    // }
  });

  // top stories swiper (mobile)
  var topStoriesMobile = new Swiper(".swiper.top-stories-mobile", {
    // loop: true,
    slidesPerView: 1,
    spaceBetween: 5,
    centeredSlides: true,
    // speed: 1000,
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
    // loop: true,
    slidesPerView: 3,
    spaceBetween: 5,
    // centeredSlides: true,
    // speed: 1000,
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

    // Select the second to fifth tabContents
    let selectedTabContents = Array.from(tabContents).slice(1, 5);

    // Select one random cards-wrap from each restricted tabContent
    selectedTabContents.forEach((tabContent) => {
      let cardWraps = tabContent.querySelectorAll(".cards-wrap");
      let randomIndex = Math.floor(Math.random() * cardWraps.length);
      let randomCardWrap = cardWraps[randomIndex];

      // Append the randomly selected card-wrap to the other-stories-wrapper in tabContentRandom
      otherStoriesWrapper.appendChild(randomCardWrap.cloneNode(true));
    });

    // Show the tabContentRandom initially
    tabContentRandom.classList.add("active");

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

// accordion
// function initAccordion() {
//   function setupAccordion(accordionId) {
//     // Set up initial state
//     $(`#${accordionId} .accordion-item.active .accordion-bottom`).slideDown(0);

//     $(`#${accordionId} .accordion-item`).click(function () {
//       if ($(this).hasClass("active")) {
//         $(this).removeClass("active");
//       } else {
//         $(`#${accordionId} .accordion-item`).removeClass("active");
//         $(this).addClass("active");
//       }
//     });

//     $(`#${accordionId} .accordion-top`).click(function () {
//       $(`#${accordionId} .accordion-bottom`)
//         .not($(this).parent().find(".accordion-bottom"))
//         .slideUp(400, "swing");
//       $(this).parent().find(".accordion-bottom").slideToggle(400, "swing");
//     });
//   }

//   // Initialize accordions for each tab
//   setupAccordion("pricingAccordion");
//   setupAccordion("startingProjectAccordion");
//   setupAccordion("designAccordion");
//   setupAccordion("developmentAccordion");
// }

// marquee
// function initMarquee() {
//   // https://codepen.io/GreenSock/pen/QWqoKBv

//   let direction = 1; // 1 = forward, -1 = backward scroll

//   const roll1 = roll(".marquee-wrapper .marquee-inner-wrapper.rollingText01", {
//       duration: 40,
//     }),
//     roll2 = roll(
//       ".marquee-wrapper .marquee-inner-wrapper.rollingText02",
//       {
//         duration: 40,
//       },
//       true
//     ),
//     scroll = ScrollTrigger.create({
//       trigger: document.querySelector(
//         ".marquee-wrapper .marquee-inner-wrapper"
//       ),
//       onUpdate(self) {
//         if (self.direction !== direction) {
//           direction *= -1;
//           gsap.to([roll1, roll2], {
//             timeScale: direction,
//             overwrite: true,
//           });
//         }
//         self.direction === -1
//           ? $(".marquee-wrapper").removeClass("flipped")
//           : $(".marquee-wrapper").addClass("flipped");
//       },
//     });

//   // helper function that clones the targets, places them next to the original, then animates the xPercent in a loop to make it appear to roll across the screen in a seamless loop.
//   function roll(targets, vars, reverse) {
//     vars = vars || {};
//     vars.ease || (vars.ease = "none");
//     const tl = gsap.timeline({
//         repeat: -1,
//         onReverseComplete() {
//           this.totalTime(this.rawTime() + this.duration() * 10); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
//         },
//       }),
//       elements = gsap.utils.toArray(targets),
//       clones = elements.map((el) => {
//         let clone = el.cloneNode(true);
//         el.parentNode.appendChild(clone);
//         return clone;
//       }),
//       positionClones = () =>
//         elements.forEach((el, i) =>
//           gsap.set(clones[i], {
//             position: "absolute",
//             overwrite: false,
//             top: el.offsetTop,
//             left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth),
//           })
//         );
//     positionClones();
//     elements.forEach((el, i) =>
//       tl.to(
//         [el, clones[i]],
//         {
//           xPercent: reverse ? 100 : -100,
//           ...vars,
//         },
//         0
//       )
//     );
//     window.addEventListener("resize", () => {
//       let time = tl.totalTime(); // record the current time
//       tl.totalTime(0); // rewind and clear out the timeline
//       positionClones(); // reposition
//       tl.totalTime(time); // jump back to the proper time
//     });
//     return tl;
//   }
// }

// add class to header when scrolling to sections
// https://greensock.com/forums/topic/29263-gsapscrolltrigger-change-header-class/
function initScrollingClass() {
  let changeColor = gsap.utils.toArray(
    ".btn-link.btn-nav-home a, .link-navbar-wrapper .link-desktop.link-desktop-left, header .hamburger"
  );

  gsap.utils.toArray(".dark-theme, .light-theme").forEach((section) => {
    let isDark = section.classList.contains("dark-theme");
    ScrollTrigger.create({
      // scroller: '[data-scroll-content]',
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
      //console.log($this.val());
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

// category filter tab
// function initCategoryFilter() {

//   document.addEventListener("DOMContentLoaded", function () {
//     const postBlocksContainer = document.querySelector(".posts-container");
//     const tagButtons = document.querySelectorAll(".tabLinks");
//     const loadMoreButton = document.getElementById("loadMoreButton");
//     const postBlocks = document.querySelectorAll(".post");

//     let selectedTag = "all"; // Initially, "all" tag is selected
//     let currentPage = 1;
//     const itemsPerPage = 3;

//     function filterPostsByTag(tag) {
//       selectedTag = tag;
//       currentPage = 1; // Reset current page when changing tags

//       // Clear existing posts in the container
//       postBlocksContainer.innerHTML = "";

//       const filteredPostBlocks = Array.from(postBlocks).filter((block) => {
//         const tags = block.getAttribute("data-tags").split(",");
//         return selectedTag === "all" || tags.includes(selectedTag);
//       });

//       showPostsForPage(currentPage, filteredPostBlocks);
//       updateLoadMoreButton(filteredPostBlocks);
//     }

//     function showPostsForPage(pageNumber, postBlocks) {
//       const startIndex = (pageNumber - 1) * itemsPerPage;
//       const endIndex = Math.min(startIndex + itemsPerPage, postBlocks.length);

//       for (let i = startIndex; i < endIndex; i++) {
//         postBlocksContainer.appendChild(postBlocks[i].cloneNode(true));
//       }
//     }

//     function updateLoadMoreButton(filteredPostBlocks) {
//       const visiblePostCount = filteredPostBlocks.length;

//       if (visiblePostCount <= currentPage * itemsPerPage) {
//         loadMoreButton.style.display = "none";
//       } else {
//         loadMoreButton.style.display = "block";
//       }
//     }

//     function loadMorePosts() {
//       currentPage++;
//       const filteredPostBlocks = Array.from(postBlocks).filter((block) => {
//         const tags = block.getAttribute("data-tags").split(",");
//         return selectedTag === "all" || tags.includes(selectedTag);
//       });

//       showPostsForPage(currentPage, filteredPostBlocks);
//       updateLoadMoreButton(filteredPostBlocks);
//     }

//     tagButtons.forEach((button) => {
//       button.addEventListener("click", () => {
//         tagButtons.forEach((btn) => btn.classList.remove("active"));
//         button.classList.add("active");
//         const tag = button.getAttribute("data-tag");
//         filterPostsByTag(tag);
//       });
//     });

//     loadMoreButton.addEventListener("click", loadMorePosts);

//     // Initial setup
//     filterPostsByTag(selectedTag);
//   });
// }

// this will pin the element while scrolling down -> usage on other stories tabs
function initPinScrollItems() {
  if (window.matchMedia("(min-width: 1025px)").matches) {
    ScrollTrigger.create({
      trigger: ".other-stories-parent",
      start: "top 10%",
      // end: () => {
      //   // Dynamically calculate the end position based on the last visible .results-block element
      //   const lastVisibleResult = $(".results-block:visible").last();
      //   const triggerBottom = lastVisibleResult.offset().top + lastVisibleResult.outerHeight();
      //   return `bottom ${triggerBottom}px bottom`;
      // },
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
        // markers: true,
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
      // skewY: 4,
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
        // markers: true,
      },
      ease: "power4.inOut",
    });
  });

  // title reveal on page load
  // const titleTimeline = gsap.timeline();

  // const titleReveal = document.querySelector(".hero-title-reveal");
  // if (titleReveal) {
  //   titleTimeline.from(titleReveal, 1.5, {
  //     y: 100,
  //     ease: "power4.inOut",
  //     delay: .2,
  //     skewY: 4,
  //     opacity: 0,
  //     stagger: {
  //       amount: 0.3
  //     }
  //   });
  // }
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
        // markers: true,
        onEnter: () => {
          highlightText.classList.add("active");
          // Use GSAP to animate the highlight effect
          // gsap.to(highlightText, {
          //   backgroundSize: "100% 100%",
          //   color: "var(--black-color)",
          //   duration: 1, // Adjust the duration as needed
          // });
        },
        // onLeaveBack: () => {
        //   highlightText.classList.remove("active");
        //   // Use GSAP to reverse the highlight effect
        //   gsap.to(highlightText, {
        //     backgroundSize: "0% 100%",
        //     color: "inherit",
        //     duration: 1, // Adjust the duration as needed
        //   });
        // },
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

  // Animate the first image to cover the whole screen
  // const scaleImage = document.querySelector(".preload-image.scale");
  // tl.fromTo(
  //   scaleImage,
  //   { scale: 0, opacity: 0 },
  //   { scale: 1.5, opacity: 1, duration: 1.5, ease: "power4.inOut" }
  // );

  // Animate the other images to appear at random positions
  images.forEach((image, index) => {
    if (index !== 0) {
      // // define boundaries for random positions
      // const minX = image.width; // minimum X position from the left edge
      // const maxX = window.innerWidth - image.width; // maximum X position from the right edge
      // const minY = 0; // minimum Y position from the top edge
      // const maxY = window.innerHeight - image.height; // maximum Y position from the bottom edge

      // // generate random positions within defined boundaries
      // const randomX = Math.random() * (maxX - minX) + minX;
      // const randomY = Math.random() * (maxY - minY) + minY;

      // animate the image
      tl.fromTo(
        image,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1,
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

  // tl.to(
  //   ".counter-wrap .logo",
  //   1.0,
  //   {
  //     opacity: 0,
  //     yPercent: -100,
  //     ease: "power4.inOut",
  //   },
  //   "-=0.3"
  // );

  tl.to(
    ".preloader-bg-wrapper",
    1.5,
    {
      // opacity: 0,
      scale: 0.3,
      yPercent: 100,
      ease: "power4.inOut",
    },
    "-=0.3"
  );

  // tl.fromTo(
  //   ".preload-image.scale",
  //   { scale: 0, opacity: 1 },
  //   {
  //     scale: 5,
  //     opacity: 0,
  //     // yPercent: -100,
  //     duration: 1.5,
  //     ease: "power4.inOut",
  //   },
  //   "-=0.5"
  // );

  // Add the animating class to hero-title-wrap
  tl.add(() => {
    heroTitleWrap.classList.add("animating");
  }, "-=1.0");

  tl.fromTo(
    heroTitleWrap,
    {
      top: "60%",
      // opacity: 0,
    },
    {
      top: "35%",
      // opacity: 1,
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
      // top: "60%",
      opacity: 0,
    },
    {
      // top: "35%",
      opacity: 1,
      duration: 1.2,
      ease: "power4.inOut",
    },
    "-=1.59"
  );

  // Remove the animating class after the animation completes
  // tl.add(() => {
  //   heroTitleWrap.classList.remove("animating");
  // });

  // Add the animating class to logo hero wrap
  tl.add(() => {
    logoHeroWrap.classList.add("animating");
  }, "-=1.6");

  tl.fromTo(
    logoHeroWrap,
    {
      top: "50%",
      // opacity: 0,
    },
    {
      top: "20%",
      // opacity: 1,
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
        top: "78%",
        // opacity: 0,
      },
      {
        top: "24%",
        // opacity: 1,
        duration: 1.0,
        ease: "power4.inOut",
      },
      "-=1.6"
    );

    // Remove the animating class after the animation completes
    // tl.add(() => {
    //   heroTitleWrap.classList.remove("animating");
    // });

    // Add the animating class to logo hero wrap
    tl.add(() => {
      logoHeroWrap.classList.add("animating");
    }, "-=1.6");

    tl.fromTo(
      logoHeroWrap,
      {
        top: "67%",
        // opacity: 0,
      },
      {
        top: "16%",
        // opacity: 1,
        duration: 1.0,
        ease: "power4.inOut",
      },
      "-=1.6"
    );
  }

  // tl.to(
  //   ".preload-image.scale",
  //   1.6,
  //   {
  //     delay: 0.5,
  //     opacity: 0,
  //     scale: 15.5,
  //     ease: "power4.inOut",
  //   },
  //   "-=2.0"
  // );

  // tl.to(
  //   ".preloader-bg-inner",
  //   1.1,
  //   {
  //     yPercent: 100,
  //     ease: "power4.inOut",
  //   },
  //   "-=0.8"
  // );

  // tl.to(
  //   ".preloader-bg-wrapper-duplicate",
  //   1.1,
  //   {
  //     yPercent: 100,
  //     ease: "power4.inOut",
  //   },
  //   "-=1.0"
  // );

  // tl.to(
  //   ".preloader-bg-inner-duplicate",
  //   1.0,
  //   {
  //     yPercent: -100,
  //     ease: "power4.inOut",
  //   },
  //   "-=0.2"
  // );

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
  // initPinPortfolioTabs();
  initWindowResize();
  initHamburger();
  initScrollingMenuLinks();
  // initMenuLinks();
  initCustomCursor();
  // initMagneticHover();
  // initParallaxImage();
  // initPinningPortfolio();
  initSwiper();
  initHeaderClass();
  // initCustomTab();
  // initAccordion();
  initTab();
  initFixedTabOnScroll();
  // initMarquee();
  initScrollingClass();
  initCustomDropdown();
  initLoadMore();
  // initCategoryFilter();
  // initPinScrollItems();
  initTextReveal();
  // initHighlightTextReveal();
  initPreloader();
  // initChangeText();
}

window.onload = () => {
  init();
};

// scroll to top
// $(document).ready(function () {
//   $("#back-to-top").hide();
//   $(function scrollToTop() {
//     $(window).scroll(function () {
//       if ($(this).scrollTop() > 100) {
//         $('#back-to-top').fadeOut();
//       } else {
//         $('#back-to-top').fadeIn();
//       }
//     });

//     $('#back-to-top').click(function () {
//       $('body,html').animate({
//         scrollTop: 0
//       }, 1200);
//       return false;
//     });
//   });
// });
