(function () {
  'use strict';

  var isEnglish = document.documentElement.lang.toLowerCase().indexOf('en') === 0;
  var copy = isEnglish ? {
    label: 'What the difficulty level means',
    levels: [
      ['Easy', 'Suitable for guests of any age and fitness level. No advance preparation is needed.'],
      ['Moderate', 'Includes walking on uneven terrain or a longer active part. A normal everyday fitness level is enough.'],
      ['Challenging', 'A physically demanding route with long walks, elevation changes or difficult weather conditions.'],
      ['Extreme', 'For experienced and well-prepared travellers. Special equipment and good physical fitness may be required.']
    ]
  } : {
    label: 'Что означает уровень сложности',
    levels: [
      ['Лёгкий', 'Подходит гостям любого возраста и уровня физической подготовки. Предварительная подготовка не требуется.'],
      ['Средний', 'Есть прогулки по неровному рельефу или продолжительная активная часть. Достаточно обычной физической формы.'],
      ['Сложный', 'Физически насыщенный маршрут с долгими переходами, перепадами высот или непростыми погодными условиями.'],
      ['Экстремальный', 'Для опытных и подготовленных путешественников. Может потребоваться специальное снаряжение и хорошая физическая форма.']
    ]
  };

  function closeAll(except) {
    document.querySelectorAll('.wgt-info-wrap.is-open, .tc-info-wrap.is-open').forEach(function (wrap) {
      if (wrap !== except) {
        wrap.classList.remove('is-open');
        var button = wrap.querySelector('.wgt-info, .tc-info-button');
        if (button) button.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function bind(wrap, button, tooltip, index) {
    var id = tooltip.id || 'tour-info-tooltip-' + index;
    tooltip.id = id;
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      var shouldOpen = !wrap.classList.contains('is-open');
      closeAll(wrap);
      wrap.classList.toggle('is-open', shouldOpen);
      button.setAttribute('aria-expanded', String(shouldOpen));
    });
    tooltip.addEventListener('click', function (event) { event.stopPropagation(); });
  }

  document.querySelectorAll('.wgt-info-wrap').forEach(function (wrap, index) {
    var oldButton = wrap.querySelector('.wgt-info');
    var tooltip = wrap.querySelector('.wgt-tooltip');
    if (!oldButton || !tooltip) return;
    var button = oldButton;
    if (oldButton.tagName !== 'BUTTON') {
      button = document.createElement('button');
      button.type = 'button';
      button.className = oldButton.className;
      button.innerHTML = oldButton.innerHTML;
      oldButton.replaceWith(button);
    }
    var title = wrap.closest('.wgt-hd') && wrap.closest('.wgt-hd').querySelector('.wgt-title');
    button.setAttribute('aria-label', isEnglish
      ? 'What ' + (title ? title.textContent.toLowerCase() : 'this level') + ' means'
      : 'Что означает «' + (title ? title.textContent : 'этот уровень') + '»');
    bind(wrap, button, tooltip, index);
  });

  document.querySelectorAll('.tc-bars').forEach(function (bars, index) {
    if (bars.querySelector('.tc-info-wrap')) return;
    bars.classList.add('tc-difficulty-row');
    var activeCount = Math.max(1, bars.querySelectorAll('i.on').length);
    var wrap = document.createElement('span');
    wrap.className = 'tc-info-wrap';
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'tc-info-button';
    button.textContent = 'i';
    button.setAttribute('aria-label', copy.label);
    var tooltip = document.createElement('span');
    tooltip.className = 'wgt-tooltip';
    tooltip.setAttribute('role', 'dialog');
    tooltip.setAttribute('aria-label', copy.label);
    tooltip.innerHTML = copy.levels.map(function (level, levelIndex) {
      return '<span class="tt-item' + (levelIndex + 1 === activeCount ? ' active' : '') + '">' +
        '<span class="tt-row"><span class="tt-name">' + level[0] + '</span>' +
        '<span class="tt-bar"><span class="tt-bar-fill" style="width:' + ((levelIndex + 1) * 25) + '%"></span></span></span>' +
        '<span class="tt-desc">' + level[1] + '</span></span>';
    }).join('');
    wrap.appendChild(button);
    wrap.appendChild(tooltip);
    bars.appendChild(wrap);
    bind(wrap, button, tooltip, 100 + index);
  });

  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAll();
  });
}());
