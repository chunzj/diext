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
      pcResizeFunc(clientWidth, innerHeight);
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

  function pcResizeFunc (clientWidth, innerHeight) {
    var pageContainer = document.querySelector('.diext');
    pageContainer.style.height = innerHeight + 'px';

    var captions = document.querySelectorAll('caption'), imgDetail = document.querySelector('.img-detail'),
      defaultImgs = pageContainer.querySelectorAll('.default');
    [].slice.call(captions, 0, captions.length).forEach(function (caption, idx) {
      caption.style.height = ((idx === 0) ? innerHeight : (innerHeight - 75)) + 'px';
      caption.style.top = idx * innerHeight + 'px';

      imgDetail.style.height = innerHeight + 'px';
    });

    [].slice.call(defaultImgs, 0, defaultImgs.length).forEach(function (img) {
      var initialHeight = Number(img.getAttribute('height')),
        initialWidth = Number(img.getAttribute('width'));

      var rowContainer = img.parentNode,
        imgContainers = rowContainer.querySelectorAll('.img'),
        images = rowContainer.querySelectorAll('img'),
        scale = Number(img.getAttribute('scale'));

      if (images.length === imgContainers.length) {
        img.style.height = (((clientWidth * scale) * initialHeight) / initialWidth).toFixed(2) + 'px';
      }
    });
  }

  window.onload = function () {
    adjustBase();
  }
})();
