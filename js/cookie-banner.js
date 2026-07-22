/* Баннер согласия на использование cookie (единый для всех страниц) */
(function () {
  var KEY = 'aurora_cookie_consent';
  try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}

  function init() {
    if (document.getElementById('cookie-banner')) return;

    var css = document.createElement('style');
    css.textContent =
      '#cookie-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:100001;' +
      'max-width:760px;margin:0 auto;background:rgba(16,22,32,.97);color:#E6ECF3;' +
      'border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:16px 18px;' +
      'box-shadow:0 16px 44px rgba(0,0,0,.4);display:flex;align-items:center;gap:16px;' +
      'flex-wrap:wrap;font-family:"Montserrat",Arial,sans-serif;' +
      'transform:translateY(140%);transition:transform .4s ease}' +
      '#cookie-banner.show{transform:translateY(0)}' +
      '#cookie-banner p{flex:1;min-width:220px;font-size:13.5px;line-height:1.5;margin:0;color:#C6D0DC}' +
      '#cookie-banner a{color:#3DDC84;text-decoration:none}' +
      '#cookie-banner a:hover{text-decoration:underline}' +
      '#cookie-banner .cb-btns{display:flex;gap:10px;flex-shrink:0}' +
      '#cookie-banner button{font-family:inherit;font-size:13px;font-weight:700;cursor:pointer;' +
      'border-radius:8px;padding:10px 18px;border:none;transition:filter .2s,background .2s}' +
      '#cb-accept{background:linear-gradient(135deg,#3DDC84,#00D4FF);color:#0E1626}' +
      '#cb-accept:hover{filter:brightness(1.06)}' +
      '#cb-decline{background:transparent;color:#9AA8B4;border:1px solid rgba(255,255,255,.18)}' +
      '#cb-decline:hover{color:#fff;border-color:rgba(255,255,255,.35)}' +
      '@media(max-width:560px){#cookie-banner{flex-direction:column;align-items:stretch}' +
      '#cookie-banner .cb-btns button{flex:1}}';
    document.head.appendChild(css);

    var isEN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0 ||
               location.pathname.indexOf('/en/') !== -1;
    var b = document.createElement('div');
    b.id = 'cookie-banner';
    b.innerHTML = isEN ?
      '<p>We use cookies to make the site work properly and improve your experience. ' +
      'By continuing to browse, you agree to our <a href="/cookies.html">Cookie Policy</a> ' +
      'and <a href="/privacy.html">personal data processing</a>.</p>' +
      '<div class="cb-btns">' +
      '<button id="cb-decline" type="button">Essential only</button>' +
      '<button id="cb-accept" type="button">Accept</button>' +
      '</div>'
      :
      '<p>Мы используем файлы cookie, чтобы сайт работал корректно и был удобнее. ' +
      'Продолжая пользоваться сайтом, вы соглашаетесь с <a href="/cookies.html">Политикой cookie</a> ' +
      'и <a href="/privacy.html">обработкой персональных данных</a>.</p>' +
      '<div class="cb-btns">' +
      '<button id="cb-decline" type="button">Только необходимые</button>' +
      '<button id="cb-accept" type="button">Принять</button>' +
      '</div>';
    document.body.appendChild(b);
    requestAnimationFrame(function () { b.classList.add('show'); });

    function close() {
      try { localStorage.setItem(KEY, '1'); } catch (e) {}
      b.classList.remove('show');
      setTimeout(function () { b.remove(); }, 400);
    }
    document.getElementById('cb-accept').addEventListener('click', close);
    document.getElementById('cb-decline').addEventListener('click', close);
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
