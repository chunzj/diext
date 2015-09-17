(function () {
  var MAX_WIDTH = 1920, SPEC_WIDTH = 1920;
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

    if (!tool.isPhone()) {
      pcResizeFunc(innerHeight);
    } else {
      MAX_WIDTH = 1080;
      SPEC_WIDTH = 640;
    }

    if (clientWidth > MAX_WIDTH) {
      clientWidth = MAX_WIDTH;
    }

    document.querySelector('html').style['font-size'] = (clientWidth / SPEC_WIDTH) * 62.5 + '%';
    resizing = null;
  }

  function pcResizeFunc (innerHeight) {
    var pageContainer = document.querySelector('.diext');
    pageContainer.style.height = innerHeight + 'px';

    var captions = document.querySelectorAll('caption'), imgDetail = document.querySelector('.img-detail');
    [].slice.call(captions, 0, captions.length).forEach(function (caption, idx) {
      caption.style.height = ((idx === 0) ? innerHeight : (innerHeight - 75)) + 'px';
      caption.style.top = idx * innerHeight + 'px';

      imgDetail.style.height = innerHeight + 'px';
    });
  }

  window.onload = function () {
    adjustBase();
  }
})();
