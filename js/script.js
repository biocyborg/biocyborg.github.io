/**
 * Dtox Main JavaScript File
 * Handles navigation, sliders, animations and interactive features
 */

(function ($) {
  ("use strict");

  // ========================================
  // 🧭 导航功能
  // ========================================

  // 粘性导航菜单
  $(window).scroll(function () {
    const navigation = $(".navigation");
    const scrollTop = $(window).scrollTop();

    if (scrollTop > 100) {
      navigation.addClass("nav-bg");
    } else {
      navigation.removeClass("nav-bg");
    }
  });

  // 页面加载时设置导航样式
  document.addEventListener("DOMContentLoaded", function () {
    const isHomePage =
      location.pathname === "/" || location.pathname.endsWith("index.html");

    if (!isHomePage) {
      const nav = document.querySelector(".navigation");
      if (nav) {
        nav.style.backgroundColor = "#ffffff";
        nav.style.boxShadow = "0px 10px 20px 0px rgba(0, 141, 236, 0.1)";
      }
    }
  });

  // ========================================
  // 🎠 轮播组件
  // ========================================

  // 团队轮播
  $(".team-slider").slick({
    dots: false,
    infinite: false,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow:
      '<button type="button" class="prevArrow"><i class="ti-arrow-left"></i></button>',
    nextArrow:
      '<button type="button" class="nextArrow"><i class="ti-arrow-right"></i></button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  // ========================================
  // 🎬 视频弹窗
  // ========================================

  // 关于页面视频弹窗
  $(document).ready(function () {
    $(".venobox").venobox();
  });

  // ========================================
  // 📜 平滑滚动
  // ========================================

  // 动画滚动功能
  const htmlBody = $("html, body");

  $(".page-scroll").on("click", function (e) {
    e.preventDefault();

    const currentPath = location.pathname.replace(/^\//, "");
    const targetPath = this.pathname.replace(/^\//, "");
    const isSamePage =
      currentPath === targetPath && location.hostname === this.hostname;

    if (isSamePage) {
      const target = $(this.hash);
      const targetElement = target.length
        ? target
        : $("[name=" + this.hash.slice(1) + "]");

      if (targetElement.length) {
        htmlBody.animate(
          {
            scrollTop: targetElement.offset().top - 50,
          },
          1500,
          "easeInOutExpo"
        );
        return false;
      }
    }
  });

  // ========================================
  // 🎭 自定义缓动函数
  // ========================================

  // easeInOutExpo 缓动函数声明
  jQuery.extend(jQuery.easing, {
    easeInOutExpo: function (x, t, b, c, d) {
      if (t === 0) {
        return b;
      }
      if (t === d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
      }
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    },
  });

  // ========================================
  // 🎯 工具函数
  // ========================================

  // 防抖函数
  function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }

  // 节流函数
  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(function () {
          inThrottle = false;
        }, limit);
      }
    };
  }

  // ========================================
  // 📱 移动端优化
  // ========================================

  // 移动端导航菜单展开/收起
  $(".navbar-toggler").on("click", function () {
    const navbarCollapse = $(".navbar-collapse");
    navbarCollapse.toggleClass("show");
  });

  // 移动端下拉菜单手风琴式展开
  $(document).on("click", ".navbar-nav .dropdown-toggle", function (e) {
    if ($(window).width() < 992) {
      e.preventDefault();
      var $parent = $(this).parent();
      if ($parent.hasClass("show")) {
        $parent.removeClass("show");
        $parent.find(".dropdown-menu").first().slideUp(200);
      } else {
        // 关闭其他已展开
        $parent
          .siblings(".dropdown.show")
          .removeClass("show")
          .find(".dropdown-menu")
          .slideUp(200);
        $parent.addClass("show");
        $parent.find(".dropdown-menu").first().slideDown(200);
      }
    }
  });

  // 点击空白处关闭移动端菜单
  $(document).on("click", function (e) {
    if (
      $(window).width() < 992 &&
      $(".navbar-collapse").hasClass("show") &&
      !$(e.target).closest(".navbar").length
    ) {
      $(".navbar-collapse").removeClass("show");
      $(".navbar-nav .dropdown").removeClass("show");
      $(".dropdown-menu").slideUp(200);
    }
  });

  // 点击菜单项后关闭菜单（只关闭一级菜单，点击下拉项不关闭主菜单）
  $(document).on("click", ".navbar-nav .nav-link", function (e) {
    if ($(window).width() < 992) {
      // 如果是下拉菜单的toggle，不关闭主菜单
      if ($(this).hasClass("dropdown-toggle")) {
        return;
      }
      // 如果是下拉菜单的item，只关闭下拉
      if ($(this).closest(".dropdown-menu").length) {
        $(this).closest(".dropdown").removeClass("show");
        $(this).closest(".dropdown-menu").slideUp(200);
        return;
      }
      // 普通菜单项，关闭整个菜单
      $(".navbar-collapse").removeClass("show");
      $(".navbar-nav .dropdown").removeClass("show");
      $(".dropdown-menu").slideUp(200);
    }
  });

  // ========================================
  // 🎨 动画和交互
  // ========================================

  // 滚动动画优化
  const scrollHandler = throttle(function () {
    const scrolled = $(window).scrollTop();
    const parallaxElements = $(".parallax");

    parallaxElements.each(function () {
      const speed = $(this).data("speed") || 0.5;
      const yPos = -(scrolled * speed);
      $(this).css("transform", "translateY(" + yPos + "px)");
    });
  }, 16);

  $(window).on("scroll", scrollHandler);

  // 懒加载图片
  function lazyLoadImages() {
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(function (img) {
      imageObserver.observe(img);
    });
  }

  // 页面加载完成后初始化懒加载
  $(document).ready(function () {
    lazyLoadImages();
  });

  // ========================================
  // 🔧 错误处理
  // ========================================

  // 全局错误处理
  window.addEventListener("error", function (e) {
    console.error("JavaScript Error:", e.error);
  });

  // Promise 错误处理
  window.addEventListener("unhandledrejection", function (e) {
    console.error("Unhandled Promise Rejection:", e.reason);
  });

  function waitForPluginReady(callback, timeout = 3000) {
    const interval = 50;
    let waited = 0;

    const check = () => {
      if (window.__EUtopiaPluginInstalled__) {
        callback();
      } else if (waited >= timeout) {
        console.warn("插件未注入或超时，使用 fallback 逻辑");
        callback(); // 即使未安装插件也继续逻辑
      } else {
        waited += interval;
        setTimeout(check, interval);
      }
    };

    check();
  }

  function createInViewportObserver(callback, options = {}) {
    const targets = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cb = targets.get(entry.target);
        if (typeof cb === "function") {
          cb(entry.isIntersecting, entry); // 回调传 isInView 和 entry
        }
      });
    }, options);

    return {
      observe(el, cb) {
        if (!el || typeof cb !== "function") return;
        targets.set(el, cb);
        observer.observe(el);
      },
      unobserve(el) {
        observer.unobserve(el);
        targets.delete(el);
      },
      disconnect() {
        observer.disconnect();
        targets.clear();
      },
    };
  }

  const inViewport = createInViewportObserver(
    (isInView, entry) => {
      console.log("进入视口：", isInView, entry.target);
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px 100px 0px",
    }
  );

  window.addEventListener("DOMContentLoaded", function () {
    waitForPluginReady(() => {
      document.querySelectorAll("img[data-suffixImg]").forEach((img) => {
        inViewport.observe(img, (isInView) => {
          if (isInView) {
            const prefixImg = img.getAttribute("data-prefixImg");
            const suffixImg = img.getAttribute("data-suffixImg");

            if (window.__EUtopiaPluginInstalled__) {
              globalThis.AssistanceRequest(suffixImg).then((result) => {
                img.src = result.data.dataUrl;
              });
            } else if (prefixImg) {
              img.src = prefixImg;
            } else {
              img.src = suffixImg;
            }

            inViewport.unobserve(img); // 加载完成后取消观察
          }
        });
      });
    });
  });
})(jQuery);
