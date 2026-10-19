(function () {
  document.querySelectorAll('[data-fleet-gallery]').forEach(function (gallery) {
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.fleet-thumb'));
    var stage = gallery.querySelector('.fleet-stage-image');
    var count = gallery.querySelector('.fleet-count');
    var strip = gallery.querySelector('.fleet-thumbs');
    var previous = gallery.querySelector('[data-fleet-prev]');
    var next = gallery.querySelector('[data-fleet-next]');
    if (!thumbs.length || !stage || !count || !strip || !previous || !next) return;

    var active = 0;
    function show(index, focusThumb) {
      active = (index + thumbs.length) % thumbs.length;
      var selected = thumbs[active];
      var image = selected.querySelector('img');
      stage.src = image.src;
      stage.alt = image.alt;
      count.textContent = (active + 1) + ' / ' + thumbs.length;
      thumbs.forEach(function (thumb, position) {
        thumb.setAttribute('aria-pressed', position === active ? 'true' : 'false');
      });
      if (focusThumb) selected.focus();
      strip.scrollTo({
        left: selected.offsetLeft - strip.offsetLeft - (strip.clientWidth - selected.clientWidth) / 2,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    }

    thumbs.forEach(function (thumb, index) {
      thumb.addEventListener('click', function () { show(index, false); });
      thumb.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
        }
      });
    });
    previous.addEventListener('click', function () { show(active - 1, false); });
    next.addEventListener('click', function () { show(active + 1, false); });
  });
})();
