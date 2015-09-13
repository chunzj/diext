(function () {
  var MAX_WIDTH = 1920;
  var resizing = null;

  window.onresize = function() {
    if (resizing) {
      clearTimeout(resizing);
    }
    resizing = setTimeout(adjustBase, 100);
  };

  function adjustBase() {
    var clientWidth = document.body.clientWidth,
      innerHeight = window.innerHeight;

    var pageContainer = document.querySelector('.diext');
    pageContainer.style.height = innerHeight + 'px';

    var captions = document.querySelectorAll('caption'), imgDetail = document.querySelector('.img-detail');
    [].slice.call(captions, 0, captions.length).forEach(function (caption, idx) {
      caption.style.height = innerHeight + 'px';
      caption.style.top = idx * innerHeight + 'px';

      imgDetail.style.height = innerHeight + 'px';
    });

    if (clientWidth > MAX_WIDTH) {
      clientWidth = MAX_WIDTH;
    }

    document.querySelector('html').style['font-size'] = (clientWidth / 1920) * 62.5 + '%';
    resizing = null;
  }

  window.onload = function () {
    adjustBase();
  }
})();
