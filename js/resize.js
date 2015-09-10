(function () {
  var MAX_WIDTH = 1080;
  var resizing = null;

  window.onresize = function() {
    if (resizing) {
      clearTimeout(resizing);
    }
    resizing = setTimeout(adjustBase, 100);
  };

  function adjustBase() {
    var clientWidth = document.body.clientWidth,
        clientHeight = window.innerHeight;

    document.querySelector('caption').style.height = clientHeight + 'px';

    if (clientWidth > MAX_WIDTH) {
      clientWidth = MAX_WIDTH;
    }

    document.querySelector('html').style['font-size'] = (clientWidth / 640) * 62.5 + '%';
    resizing = null;
  }

  window.onload = function () {
	adjustBase();  
  }
})();
