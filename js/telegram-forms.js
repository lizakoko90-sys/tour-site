/* ============================================================
   Отправка заявок с форм в Telegram (Bot API, без бэкенда)
   ------------------------------------------------------------
   НАСТРОЙКА (2 значения ниже):
   1) TG_TOKEN   — токен бота от @BotFather
   2) TG_CHAT_ID — id чата, куда слать заявки (ваш личный чат,
                   группа или канал). Узнать: напишите боту, затем
                   откройте https://api.telegram.org/bot<ТОКЕН>/getUpdates
                   и возьмите "chat":{"id": ... }.
   Пока значения не вставлены — формы работают в демо-режиме
   (показывают «спасибо», но ничего не отправляют).
   ============================================================ */
(function () {
  var TG_TOKEN = '8946320686:AAESXIwxe0XyVzdPUEXcWG_SoZM6pXLcU9Y';
  var TG_CHAT_ID = '600019715';

  var configured = TG_TOKEN.indexOf('ВСТАВЬТЕ') === -1 && TG_CHAT_ID.indexOf('ВСТАВЬТЕ') === -1;

  // человекочитаемые подписи полей
  var LABELS = {
    name: 'Имя',
    phone: 'Телефон',
    company: 'Компания',
    country: 'Страна / город',
    season: 'Сезон',
    guests: 'Человек',
    time: 'Удобное время',
    message: 'Сообщение'
  };

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildMessage(form) {
    var source = form.getAttribute('data-tg') || 'Форма на сайте';
    var lines = ['🔔 <b>Новая заявка — Aurora Trip</b>', ''];
    var fields = form.querySelectorAll('input[name], select[name], textarea[name]');
    fields.forEach(function (el) {
      if (el.type === 'checkbox' || el.type === 'radio') return;
      var val = (el.value || '').trim();
      if (!val) return;
      var label = LABELS[el.name] || el.name;
      lines.push('• <b>' + escapeHtml(label) + ':</b> ' + escapeHtml(val));
    });
    lines.push('');
    lines.push('📄 Источник: ' + escapeHtml(source));
    lines.push('🔗 Страница: ' + escapeHtml(location.pathname));
    return lines.join('\n');
  }

  function sendToTelegram(text) {
    return fetch('https://api.telegram.org/bot' + TG_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT_ID, text: text, parse_mode: 'HTML', disable_web_page_preview: true })
    }).then(function (r) {
      if (!r.ok) throw new Error('Telegram API ' + r.status);
      return r.json();
    });
  }

  function showStatus(form, ok) {
    var box = form.querySelector('.tg-status');
    if (!box) {
      box = document.createElement('div');
      box.className = 'tg-status';
      box.style.cssText = 'margin-top:12px;font-size:14px;font-weight:600;line-height:1.4;border-radius:7px;padding:12px 14px;';
      form.appendChild(box);
    }
    if (ok) {
      box.style.background = 'rgba(61,220,132,.15)';
      box.style.color = '#12A67E';
      box.textContent = '✓ Спасибо! Заявка отправлена — мы свяжемся с вами в ближайшее время.';
    } else {
      box.style.background = 'rgba(234,102,95,.15)';
      box.style.color = '#D64B44';
      box.textContent = 'Не удалось отправить. Позвоните нам: +7 (921) 166-33-15 или напишите в Telegram.';
    }
  }

  function handle(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (typeof form.reportValidity === 'function' && !form.reportValidity()) return;

      var btn = form.querySelector('button[type="submit"], .btn-send, .asf-btn-submit, .modal-submit');
      var oldText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Отправляем…'; }

      var done = function (ok) {
        if (btn) { btn.disabled = false; btn.textContent = oldText; }
        showStatus(form, ok);
        if (ok) {
          form.querySelectorAll('input, select, textarea').forEach(function (el) {
            if (el.type === 'checkbox') return;
            if (el.id === 'sidebar-guests') { el.value = '1'; return; }
            el.value = '';
          });
        }
      };

      var text = buildMessage(form);

      if (!configured) {
        console.warn('[telegram-forms] Не заданы TG_TOKEN / TG_CHAT_ID — заявка НЕ отправлена. Текст заявки:\n' + text);
        setTimeout(function () { done(true); }, 400); // демо-режим
        return;
      }

      sendToTelegram(text).then(function () { done(true); }).catch(function (err) {
        console.error('[telegram-forms]', err);
        done(false);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form[data-tg]').forEach(handle);
  });
})();
