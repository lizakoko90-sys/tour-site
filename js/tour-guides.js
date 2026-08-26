(function () {
  var roots = document.querySelectorAll('[data-tour-guides]');
  if (!roots.length) return;

  var stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/css/tour-guides.css';
  document.head.appendChild(stylesheet);

  var guides = {
    ru: [
      {name:'Михаил', role:'Гид, который влюблён в историю Севера', image:'/images/team/mikhail.jpg', alt:'Михаил — гид Aurora Trip, знаток истории Кольского Севера', lead:'Большой любитель истории и увлечённый путешественник. Он умеет не просто рассказывать факты, а оживлять прошлое.', details:'Для Михаила Север — это край с характером, судьбами и легендами, которыми хочется делиться с каждым гостем.'},
      {name:'Александра', role:'Жемчужина нашей команды', image:'/images/team/aleksandra.jpg', alt:'Александра — гид Aurora Trip по Кольскому полуострову', lead:'Её рассказы о поморах, северных традициях и жизни людей на Кольском полуострове превращают поездку в увлекательную историю.', details:'Александра создаёт особую атмосферу тепла и уюта, благодаря которой гости чувствуют себя настоящими путешественниками.'},
      {name:'Елизавета', role:'Надёжный гид и проводник по Северу', image:'/images/team/elizaveta.jpg', alt:'Елизавета — аттестованный гид Aurora Trip', lead:'Опытный и внимательный гид, который делает каждое путешествие комфортным, интересным и безопасным.', details:'Её спокойствие, ответственность и любовь к людям помогают гостям чувствовать себя уверенно с первых минут знакомства.'},
      {name:'Роман', role:'Душа компании и знаток Севера', image:'/images/team/roman.jpg', alt:'Роман — гид Aurora Trip по Кольскому полуострову', lead:'Внимательный проводник, приятный собеседник и настоящий знаток Севера, с которым легко найти общий язык.', details:'Чувство юмора, спокойствие и любовь Романа к своему делу делают путешествие лёгким и запоминающимся.'}
    ],
    en: [
      {name:'Mikhail', role:'A guide who is passionate about northern history', image:'/images/team/mikhail.jpg', alt:'Mikhail — Aurora Trip guide and expert on Kola history', lead:'A keen historian and traveller who brings the past to life instead of simply listing facts.', details:'For Mikhail, the North is a land of character, people and legends worth sharing with every guest.'},
      {name:'Alexandra', role:'The gem of our team', image:'/images/team/aleksandra.jpg', alt:'Alexandra — Aurora Trip guide on the Kola Peninsula', lead:'Her stories about Pomors, northern traditions and life on the Kola Peninsula turn every trip into a vivid journey.', details:'Alexandra creates a warm atmosphere in which guests feel like true travellers, not simply tourists.'},
      {name:'Elizaveta', role:'A reliable guide and confident northern companion', image:'/images/team/elizaveta.jpg', alt:'Elizaveta — certified Aurora Trip guide', lead:'An experienced and attentive guide who makes every journey comfortable, interesting and safe.', details:'Her calm manner, responsibility and care help guests feel confident from the very first minutes.'},
      {name:'Roman', role:'The heart of the group and a northern expert', image:'/images/team/roman.jpg', alt:'Roman — Aurora Trip guide on the Kola Peninsula', lead:'An attentive companion, an engaging conversationalist and a true expert on the Russian North.', details:'Roman’s humour, calm nature and love for his work make every journey easy and memorable.'}
    ]
  };

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char];
    });
  }

  roots.forEach(function (root) {
    var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'ru';
    var copy = lang === 'en' ? {
      kicker:'Who will guide you', title:'Meet our <em>team</em>',
      intro:'Every journey is created by people who love the North, know its history and want to show it through their own eyes.',
      badge:'All our guides are officially certified', more:'Read more', less:'Show less',
      foot:'We are a team of professionals united by experience, care and a genuine love of travel.'
    } : {
      kicker:'Кто поведёт вас', title:'Наша <em>команда</em>',
      intro:'За каждым путешествием стоят люди, которые любят Север, знают его историю и умеют показать его таким, каким видят сами.',
      badge:'Все гиды прошли официальную аттестацию', more:'Подробнее', less:'Свернуть',
      foot:'Мы — команда профессионалов, которая объединяет опыт, заботу и любовь к путешествиям.'
    };
    var cards = guides[lang].map(function (guide) {
      return '<article class="tour-guide">' +
        '<div class="tour-guide-photo"><img loading="lazy" width="800" height="1000" src="'+guide.image+'" alt="'+escapeHtml(guide.alt)+'"></div>' +
        '<div class="tour-guide-body"><h3 class="tour-guide-name">'+escapeHtml(guide.name)+'</h3>' +
        '<p class="tour-guide-role">'+escapeHtml(guide.role)+'</p>' +
        '<p class="tour-guide-lead">'+escapeHtml(guide.lead)+'</p>' +
        '<button class="tour-guide-more" type="button" aria-expanded="false">'+copy.more+'</button>' +
        '<p class="tour-guide-details">'+escapeHtml(guide.details)+'</p></div></article>';
    }).join('');
    root.className = 'tour-guides';
    root.setAttribute('aria-labelledby', root.id + '-title');
    root.innerHTML = '<div class="tour-guides-head"><span class="tour-guides-kicker">'+copy.kicker+'</span>' +
      '<h2 class="tour-guides-title" id="'+root.id+'-title">'+copy.title+'</h2>' +
      '<p class="tour-guides-intro">'+copy.intro+'</p>' +
      '<span class="tour-guides-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>'+copy.badge+'</span></div>' +
      '<div class="tour-guides-grid">'+cards+'</div><p class="tour-guides-foot">'+copy.foot+'</p>';
    root.querySelectorAll('.tour-guide-more').forEach(function (button) {
      button.addEventListener('click', function () {
        var card = button.closest('.tour-guide');
        var open = card.classList.toggle('open');
        button.setAttribute('aria-expanded', String(open));
        button.textContent = open ? copy.less : copy.more;
      });
    });
  });
})();
