/* Сезонный анонс северного сияния — ненавязчивый slide-in на страницах сайта */
(function () {
  'use strict';

  var path = location.pathname.toLowerCase();
  var excludedPages = /(?:privacy|consent|cookies|terms|oferta|marketing-consent|partners|page-severnoe-siyanie)\.html$/;
  if (excludedPages.test(path)) return;

  var POPUP_ID = 'aurora-season-popup';
  var SESSION_KEY = 'aurora_season_popup_2026_seen';
  var DISMISS_KEY = 'aurora_season_popup_2026_dismissed_at';
  var DISMISS_DAYS = 7;
  var START_DELAY = 4500;

  try {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return;
    var dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86400000) return;
  } catch (e) {}

  function cookieBannerIsVisible() {
    var banner = document.getElementById('cookie-banner');
    return banner && banner.classList.contains('show');
  }

  function rememberDismissal() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
  }

  function init() {
    if (document.getElementById(POPUP_ID)) return;

    var isEN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0 ||
      path.indexOf('/en/') !== -1;

    var css = document.createElement('style');
    css.id = 'aurora-season-popup-styles';
    css.textContent =
      '#aurora-season-popup{position:fixed;right:22px;bottom:22px;z-index:9000;width:min(410px,calc(100vw - 32px));' +
      'background:#fff;color:#17223a;border:1px solid rgba(21,39,66,.12);border-radius:20px;overflow:hidden;' +
      'box-shadow:0 24px 70px rgba(4,15,31,.3);font-family:"Montserrat",Arial,sans-serif;' +
      'opacity:0;visibility:hidden;transform:translate3d(40px,18px,0) scale(.97);' +
      'transition:opacity .45s ease,transform .45s cubic-bezier(.22,1,.36,1),visibility .45s}' +
      '#aurora-season-popup.asp-show{opacity:1;visibility:visible;transform:translate3d(0,0,0) scale(1)}' +
      '#aurora-season-popup.asp-leave{opacity:0;visibility:hidden;transform:translate3d(35px,12px,0) scale(.98)}' +
      '#aurora-season-popup .asp-image{display:block;width:100%;height:164px;object-fit:cover;object-position:center}' +
      '#aurora-season-popup .asp-content{padding:18px 20px 20px}' +
      '#aurora-season-popup .asp-kicker{display:flex;align-items:center;gap:8px;margin:0 0 7px;color:#168467;' +
      'font-size:11px;font-weight:800;line-height:1.2;letter-spacing:.12em;text-transform:uppercase}' +
      '#aurora-season-popup .asp-kicker:before{content:"";width:8px;height:8px;border-radius:50%;background:#32d29a;' +
      'box-shadow:0 0 0 5px rgba(50,210,154,.14)}' +
      '#aurora-season-popup h2{margin:0 34px 8px 0;color:#17223a;font-size:22px;line-height:1.18;font-weight:800;letter-spacing:-.02em}' +
      '#aurora-season-popup .asp-copy{margin:0 0 15px;color:#5c6878;font-size:13.5px;line-height:1.55}' +
      '#aurora-season-popup .asp-action{display:flex;align-items:center;justify-content:space-between;gap:14px}' +
      '#aurora-season-popup .asp-price{white-space:nowrap;color:#17223a;font-size:13px;font-weight:800}' +
      '#aurora-season-popup .asp-cta{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 17px;' +
      'border-radius:11px;background:linear-gradient(135deg,#159875,#20c997);color:#fff;text-decoration:none;' +
      'font-size:12px;font-weight:800;letter-spacing:.02em;box-shadow:0 9px 24px rgba(21,152,117,.25);' +
      'transition:transform .2s ease,box-shadow .2s ease,filter .2s ease}' +
      '#aurora-season-popup .asp-cta:hover{transform:translateY(-1px);filter:brightness(1.03);box-shadow:0 12px 28px rgba(21,152,117,.32)}' +
      '#aurora-season-popup .asp-close{position:absolute;top:10px;right:10px;width:38px;height:38px;border:0;border-radius:50%;' +
      'background:rgba(8,18,31,.7);color:#fff;font:400 25px/1 Arial,sans-serif;cursor:pointer;' +
      'display:grid;place-items:center;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);' +
      'transition:background .2s ease,transform .2s ease}' +
      '#aurora-season-popup .asp-close:hover{background:rgba(8,18,31,.9);transform:rotate(4deg)}' +
      '#aurora-season-popup .asp-close:focus-visible,#aurora-season-popup .asp-cta:focus-visible{outline:3px solid #62e8bc;outline-offset:3px}' +
      '@media(max-width:600px){#aurora-season-popup{left:12px;right:12px;bottom:12px;width:auto;border-radius:17px;' +
      'display:grid;grid-template-columns:112px minmax(0,1fr)}' +
      '#aurora-season-popup .asp-image{height:100%;min-height:174px}' +
      '#aurora-season-popup .asp-content{padding:15px 15px 14px}' +
      '#aurora-season-popup .asp-kicker{font-size:9px;margin-bottom:5px;letter-spacing:.09em}' +
      '#aurora-season-popup h2{font-size:17px;margin-right:25px;margin-bottom:6px}' +
      '#aurora-season-popup .asp-copy{font-size:11.5px;line-height:1.42;margin-bottom:10px}' +
      '#aurora-season-popup .asp-action{display:block}' +
      '#aurora-season-popup .asp-price{display:none}' +
      '#aurora-season-popup .asp-cta{min-height:36px;width:100%;padding:0 10px;font-size:10.5px;border-radius:9px}' +
      '#aurora-season-popup .asp-close{top:7px;right:7px;width:32px;height:32px;font-size:21px}}' +
      '@media(max-width:360px){#aurora-season-popup{grid-template-columns:94px minmax(0,1fr)}' +
      '#aurora-season-popup .asp-content{padding-left:12px;padding-right:12px}' +
      '#aurora-season-popup .asp-copy{display:none}}' +
      '@media(prefers-reduced-motion:reduce){#aurora-season-popup,#aurora-season-popup *{transition:none!important}}';
    document.head.appendChild(css);

    var popup = document.createElement('aside');
    popup.id = POPUP_ID;
    popup.setAttribute('role', 'region');
    popup.setAttribute('aria-label', isEN ? 'Northern lights season announcement' : 'Анонс сезона северного сияния');
    popup.innerHTML =
      '<img class="asp-image" src="/images/announcements/aurora-season-2026.webp" ' +
      'alt="' + (isEN ? 'Northern lights above an off-road vehicle on the Kola Peninsula' : 'Северное сияние над внедорожником на Кольском полуострове') + '" width="959" height="540">' +
      '<div class="asp-content">' +
        '<p class="asp-kicker">' + (isEN ? '2026–2027 season' : 'Сезон 2026–2027') + '</p>' +
        '<h2>' + (isEN ? 'Aurora season is in full swing' : 'Сияние уже в самом разгаре') + '</h2>' +
        '<p class="asp-copy">' + (isEN ?
          'Small-group hunts from Murmansk, guided by the forecast and with professional photos included.' :
          'Выезжаем из Мурманска в малых группах, следим за прогнозом и делаем профессиональные фотографии.') + '</p>' +
        '<div class="asp-action">' +
          '<span class="asp-price">' + (isEN ? 'from 4 500 ₽' : 'от 4 500 ₽') + '</span>' +
          '<a class="asp-cta" href="' + (isEN ? '/en/page-severnoe-siyanie.html' : '/page-severnoe-siyanie.html') + '">' +
            (isEN ? 'See the aurora tour' : 'Отправиться на охоту') +
          '</a>' +
        '</div>' +
      '</div>' +
      '<button class="asp-close" type="button" aria-label="' + (isEN ? 'Close announcement' : 'Закрыть анонс') + '">&times;</button>';
    document.body.appendChild(popup);

    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { popup.classList.add('asp-show'); });
    });

    function closePopup(remember) {
      if (remember) rememberDismissal();
      document.removeEventListener('keydown', onKeydown);
      popup.classList.remove('asp-show');
      popup.classList.add('asp-leave');
      setTimeout(function () { popup.remove(); }, 480);
    }

    function onKeydown(event) {
      if (event.key === 'Escape' && document.getElementById(POPUP_ID)) closePopup(true);
    }

    popup.querySelector('.asp-close').addEventListener('click', function () { closePopup(true); });
    popup.querySelector('.asp-cta').addEventListener('click', rememberDismissal);
    document.addEventListener('keydown', onKeydown);
  }

  function schedule() {
    var attempts = 0;
    var waitForCookieBanner = setInterval(function () {
      attempts += 1;
      if (!cookieBannerIsVisible()) {
        clearInterval(waitForCookieBanner);
        setTimeout(init, START_DELAY);
      } else if (attempts >= 90) {
        clearInterval(waitForCookieBanner);
      }
    }, 500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();
})();
