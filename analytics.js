/*
  Google Analytics 4 settings

  Measurement ID configured on 2026-07-10.
  Upload this file with the site.

  When the ID is empty or still the placeholder, analytics stays disabled.
*/
(function () {
  var GA_MEASUREMENT_ID = "G-WFT7JW0W9Y";
  var PLACEHOLDER_ID = "G-XXXXXXXXXX";
  var PAGE_NAME = window.location.pathname.indexOf("access_map") !== -1 ? "access" : "home";

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === PLACEHOLDER_ID) {
    window.trackSiteEvent = function () {};
    return;
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, {
    page_title: document.title,
    page_location: window.location.origin + window.location.pathname,
    page_path: window.location.pathname,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  window.trackSiteEvent = function (name, params) {
    if (!/^[a-z][a-z0-9_]{0,39}$/.test(name)) return;

    var eventParams = Object.assign({}, params || {}, {
      page_name: PAGE_NAME,
      transport_type: "beacon"
    });
    gtag("event", name, eventParams);
  };

  document.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;

    var link = event.target.closest("a");
    if (!link) return;

    var href = link.getAttribute("href") || "";
    var label = (link.getAttribute("aria-label") || link.textContent || link.title || "")
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 80);
    var url = link.href || href;

    if (href.indexOf("tel:") === 0) {
      window.trackSiteEvent("phone_click", {
        contact_method: "phone",
        link_location: link.closest("header") ? "header" : "content"
      });
    } else if (href.indexOf("instagram.com") !== -1) {
      window.trackSiteEvent("instagram_click", {
        link_text: label,
        link_url: url
      });
    } else if (href.indexOf("maps.google") !== -1 || href.indexOf("google.com/maps") !== -1) {
      window.trackSiteEvent("map_click", {
        link_text: label,
        link_url: url
      });
    } else if (href.charAt(0) === "#") {
      window.trackSiteEvent("section_nav_click", {
        link_text: label,
        section_id: href.slice(1, 80)
      });
    } else if (link.hostname && link.hostname !== window.location.hostname) {
      window.trackSiteEvent("external_link_click", {
        link_text: label,
        link_url: url
      });
    }
  });
})();
