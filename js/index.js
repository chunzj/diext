/**
 * Created by chunzj on 2015/9/9.
 */
(function (){
  var THUMB_IMAGES = [
    [
      './images/sample_2.jpg',
      './images/sample_1.jpg',
      './images/sample_3.jpg'
    ],
    [
      './images/sample_5.jpg',
      '',
      './images/sample_4.jpg'
    ]
  ];

  var IMG_CACHE = {
    './images/sample_1.jpg': false,
    './images/sample_2.jpg': false,
    './images/sample_3.jpg': false,
    './images/sample_4.jpg': false,
    './images/sample_5.jpg': false,
    './images/1080banyan_01_01.jpg': false,
    './images/1080banyan_01_02.jpg': false,
    './images/1080banyan_01_03.jpg': false,
    './images/1080banyan_01_04.jpg': false,
    './images/1080banyan_01_05.jpg': false,
    './images/1080banyan_01_06.jpg': false,
    './images/1080banyan_01_07.jpg': false
  };

  var diextPcPage = {
    initialized: false,

    viewModel: {
      sizeImages: {
        './images/1080banyan_01_01.jpg': {
          height: '342'
        },
        './images/1080banyan_01_02.jpg': {
          height: '760'
        },
        './images/1080banyan_01_03.jpg': {
          height: '1596'
        },
        './images/1080banyan_01_04.jpg': {
          height: '699'
        },
        './images/1080banyan_01_05.jpg': {
          height: '977'
        },
        './images/1080banyan_01_06.jpg': {
          height: '658'
        },
        './images/1080banyan_01_07.jpg': {
          height: '1447'
        }
      },
      p2Images: THUMB_IMAGES,

      p3Images: [],
      p3ImagesNum: [7],

      showArrowUp: false,
      showArrowDown: false,
      currentPage: 1,
      totalPages: 2,
      pageScrollInterval: 1,
      browser: null,
      os: null,
      scrollDone: true,
      worksLinkActive: false,
      seeImgDetail: false,
      imgDetailDone: false,
      showDeleteIcon: false,
      showLinkIcon: false,
      currentImg: 0,

      init: function (){
        this.initImgResource();
        this.detectBrowser();
        if (!tool.isPhone()) {
          this.changeArrow();
          this.bindScrollEvent();
          this.bindResizeEvent();
        }
      },

      showCaptions: function (isShow){
        var captions = document.querySelectorAll('.diext caption');
        [].slice.call(captions, 0, captions.length).forEach(function (caption){
          caption.style.opacity = isShow ? 1 : 0;
        });
      },

      bindResizeEvent: function (){
        var _this = this, resizeTimer = false;
        tool.addEvent(window, 'resize', function (evt){
          var header = null;
          if (!header) {
            header = document.querySelector('.diext header');
          }

          _this.showCaptions(false);

          if (resizeTimer) {
            clearTimeout(resizeTimer);
            resizeTimer = null;
          }

          if (header) {
            resizeTimer = setTimeout(function (){
              _this.showCaptions(true);

              _this.currentPage = 1;
              _this.worksLinkActive = false;
              _this.changeArrow();
              _this.adjustHeaderWidth(header);
              m.redraw();
            }, 100);
          }
        });
      },

      adjustHeaderWidth: function (header){
        var clientWidth = window.innerWidth;
        var scrollDefaultWidth = 16;
        if (this.os === 'mac') {
          scrollDefaultWidth = 12;
        }
        header.style.width = ((1 - scrollDefaultWidth / clientWidth).toFixed(4) * 100) + '%';
      },

      initImgResource: function (){
        var row = 0, _this = this;
        this.p2Images.forEach(function (subImages, idx){
          row = idx * subImages.length;
          subImages.forEach(function (img, index){
            var imgNum = row + index;
            _this.p3Images[imgNum] = [];
            for (var i = 1; i <= _this.p3ImagesNum[imgNum]; i++) {
              _this.p3Images[imgNum].push('./images/1080banyan_' +
                  (imgNum < 10 ? '0' + (imgNum + 1) : (imgNum + 1)) + '_' + (i < 10 ? '0' + i : i) + '.jpg');
            }
          });
          row++;
        });
      },

      bindScrollEvent: function (){
        var _this = this;
        tool.registerMouseScrollEvent(function (evt, direction){
          var curCaptionScrollTop = document.querySelectorAll('caption')[_this.currentPage - 1].scrollTop;
          if (curCaptionScrollTop === 0) {
            if (direction > 0) {
              _this.previousPage();
            } else {
              _this.nextPage();
            }
            m.redraw();
          }
        });
      },

      detectBrowser: function (){
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf('MSIE') !== -1) {
          var iePattern = /MSIE\s*(\d\.[^;])+/g;
          var patternRes = iePattern.exec(userAgent);
          if (patternRes) {
            this.browser = {
              name: 'IE',
              version: patternRes[1]
            };
          }
        }

        if (userAgent.toLowerCase().indexOf('windows') !== -1) {
          this.os = 'windows';
        } else if (userAgent.toLowerCase().indexOf('mac') !== -1) {
          this.os = 'mac';
        }
      },

      changeArrow: function (){
        if (this.currentPage === 1) {
          this.showArrowUp = true;
          this.showArrowDown = false;
        } else if (this.currentPage === this.totalPages) {
          this.showArrowUp = false;
          this.showArrowDown = true;
        } else {
          this.showArrowUp = true;
          this.showArrowDown = true;
        }
      },

      deleteImageDetail: function (){
        this.preImgControl();
        this.paramControl(false);
      },

      linkToOther: function (){

      },

      previousPage: function (){
        if (this.currentPage <= 1) {
          this.worksLinkActive = false;
          return;
        }

        this.scrollPage('up');
      },

      nextPage: function (){
        if (this.currentPage >= this.totalPages) {
          return;
        }

        this.scrollPage('down');
      },

      scrollPage: function (direction){

        if (!this.scrollDone || this.seeImgDetail) {
          return;
        }

        this.showArrowUp = false;
        this.showArrowDown = false;
        this.scrollDone = false;

        var clientHeight = window.innerHeight;

        var captions = document.querySelectorAll('caption');
        var currentCaption = null, nextCaption = null;
        if (direction === 'down') {
          currentCaption = captions[this.currentPage - 1];
          nextCaption = captions[this.currentPage];

          if (typeof $ !== 'undefined') {
            $(currentCaption).animate({top: -clientHeight}, this.pageScrollInterval * 1000);
            $(nextCaption).animate({top: 0}, this.pageScrollInterval * 1000);
          } else {
            currentCaption.style.top = -clientHeight + 'px';
            nextCaption.style.top = '0px';
          }
        } else if (direction === 'up') {
          currentCaption = captions[this.currentPage - 1];
          nextCaption = captions[this.currentPage - 2];

          if (typeof $ !== 'undefined') {
            $(currentCaption).animate({top: clientHeight}, this.pageScrollInterval * 1000);
            $(nextCaption).animate({top: 0}, this.pageScrollInterval * 1000);
          } else {
            currentCaption.style.top = clientHeight + 'px';
            nextCaption.style.top = '0px';
          }
        }

        this.domAnimation(currentCaption, 'top');
        this.domAnimation(nextCaption, 'top');

        var _this = this;
        setTimeout(function (){
          //change page
          if (direction === 'down') {
            _this.currentPage += 1;
          } else if (direction === 'up') {
            _this.currentPage -= 1;
          }

          if (_this.currentPage === 1) {
            _this.worksLinkActive = false;
          }

          _this.changeArrow();
          _this.scrollDone = true;

          if (direction === 'down') {
            _this.lazyLoadImages('caption.p2', true);
          }

          m.redraw();
        }, this.pageScrollInterval * 1000);
      },

      domAnimation: function (dom, styleName, interval){
        if (arguments.length === 2) {
          if (typeof  arguments[1] === 'string') {
            styleName = arguments[1];
            interval = this.pageScrollInterval;
          } else if (typeof  arguments[1] === 'number') {
            interval = arguments[1];
            styleName = 'all';
          }
        } else if (arguments.length === 1) {
          styleName = 'all';
          interval = this.pageScrollInterval;
        }

        if (!this.browser || (this.browser.name === 'IE' && this.browser.version > 9)) {
          dom.style.transition = styleName + ' ' + interval + 's';
          dom.style['-moz-transition'] = styleName + ' ' + interval + 's';
          dom.style['-webkit-transition'] = styleName + ' ' + interval + 's';
          dom.style['-o-transition'] = styleName + ' ' + interval + 's';
        }
      },

      lazyLoadImages: function (container, redraw){
        var lazyLoadImgs = document.querySelectorAll(container + ' img[data-url]'), _this = this, deferrs = [];
        if (lazyLoadImgs.length > 0) {
          var img = null, loadingImgs = [], deferred = m.deferred();
          [].slice.call(lazyLoadImgs, 0, lazyLoadImgs.length).forEach(function (imgDom){

            var imgUrl = imgDom.getAttribute('data-url'),
                loaded = IMG_CACHE[imgUrl];

            deferrs.push(deferred.promise);

            if (typeof loaded === 'undefined' || loaded || loadingImgs.indexOf(imgUrl, 0) !== -1) {
              deferred.resolve();
              return;
            }

            _this.loadImg(imgUrl, deferred, redraw);

            loadingImgs.push(imgUrl);
          });
        }

        return deferrs;
      },
      loadImg: function (imgUrl, deferred, redraw){
        var img = new Image(), _this = this;
        img.src = imgUrl;
        img.onload = function (){

          IMG_CACHE[imgUrl] = true;
          if (redraw) {
            setTimeout(m.redraw, _this.pageScrollInterval * 1000);
          }

          deferred.resolve();
        };

        img.onerror = function (){
          console.log('Image url(' + imgUrl + ') load error!');
          deferred.reject();
        };
      },
      preImgControl: function (imgIdx){
        this.currentImg = imgIdx || 0;
        m.redraw(true);
      },
      popImageDetail: function (imgIdx, isValidImg){
        if (!isValidImg) {
          return;
        }

        var _this = this;
        this.preImgControl(imgIdx);
        m.sync(this.lazyLoadImages('.img-detail', true)).then(function (){
            _this.imgDetailDone = true;
        });
        this.paramControl(true);
      },
      paramControl: function (showDetail){
        var imgDetail = document.querySelector('.diext .img-detail'), _this = this;

        if (showDetail) {
          imgDetail.style.zIndex = '766';
          if (typeof $ !== 'undefined') {
            $(imgDetail).animate({opacity: 1}, this.pageScrollInterval * 1000);
          } else {
            imgDetail.style.opacity = 1;
          }

          this.domAnimation(imgDetail, 'opacity');

          setTimeout(function (){
            imgDetail.scrollTop = 0;
          }, this.pageScrollInterval * 10);

        } else {

          imgDetail.style.opacity = 0;
          imgDetail.style.zIndex = '744';
        }

        this.showArrowDown = !showDetail;
        this.showArrowUp = !showDetail;
        this.showDeleteIcon = showDetail;
        this.showLinkIcon = showDetail;

        this.seeImgDetail = showDetail;
        if (!showDetail) {
          this.changeArrow();
        }
      },
      backToMain: function (){
        this.deleteImageDetail();
        this.previousPage();
      },
      imageScale: function (dom, changeBigger, isValidImg, addScale){
        if (!isValidImg || !addScale) {
          return;
        }

        var x = 1, y = 1, z = 1;

        if (changeBigger) {
          x = 1.2;
          y = 1.2;
          z = 1.2;
          dom.style.zIndex = 999;
        } else {
          dom.style.zIndex = 'inherit';
        }

        dom.style.transform = "scale(" + x + "," + y + ")";
        dom.style['-moz-transform'] = "scale(" + x + "," + y + ")";
        dom.style['-webkit-transform'] = "scale(" + x + "," + y + ")";
        dom.style['-o-transform'] = "scale(" + x + "," + y + ")";

        this.domAnimation(dom, 1.5);
      }
    },
    controller: function (){

      var vm = diextPcPage.viewModel;
      vm.init();

      return vm;
    },

    imageView: function (ctrl, image, imgAttrs, addScale){
      var imgUrl = './images/balckline.jpg', showLoading = true, attrs = {};

      if (image && IMG_CACHE[image]) {
        imgUrl = image;
        showLoading = false;
      }

      attrs.src = imgUrl;
      if (image && showLoading) {
        attrs['data-url'] = image;
      }

      attrs.config = function (element){
        if (!showLoading) {
          if (ctrl.currentPage === 2) {
            if (typeof $ !== 'undefined') {
              $(element).animate({opacity: 1}, ctrl.pageScrollInterval * 1000);
            } else {
              element.style.opacity = 1;
            }
            ctrl.domAnimation(element);
          }
        }
      }

      if (!tool.isPhone()) {
        attrs.onmouseover = function (){
          ctrl.imageScale.call(ctrl, this, true, !!image, addScale);
        };

        attrs.onmouseout = function (){
          ctrl.imageScale.call(ctrl, this, false, !!image, addScale);
        }
      }

      return m('div.img' + (showLoading ? '.default' : ''), imgAttrs, [
        showLoading ? m('span.loading', 'Loading') : '',
        m('img', attrs)
      ]);
    },

    view: function (ctrl){
      var isAdjustWidth = (ctrl.seeImgDetail || ctrl.currentPage === 2);
      return [
        m('header' + (isAdjustWidth ? '.white-bg' : ''), {
          config: function (element){
            if (isAdjustWidth) {
              ctrl.adjustHeaderWidth.call(ctrl, element);
            }
          }
        }, [
          m('div.left', [
            m('span.logo', {onclick: ctrl.backToMain.bind(ctrl)}),
            m('span.txt', {onclick: ctrl.backToMain.bind(ctrl)}, 'DIEXT LAB')
          ]),
          m('div.right', m('nav', [
            m('a' + (ctrl.worksLinkActive && ctrl.scrollDone ? '.active' : ''), {
              onclick: function (){
                ctrl.worksLinkActive = true;
                ctrl.nextPage.call(ctrl);
              }
            }, 'WORKS'),
            m('a', 'ABOUT')
          ])),
          ctrl.showArrowDown ? m('div.scrollDown', {
            onclick: ctrl.previousPage.bind(ctrl)
          }, m('span.icon')) : '',
          ctrl.showDeleteIcon ? m('div.deleteIcon', {
            onclick: ctrl.deleteImageDetail.bind(ctrl)
          }, m('span.icon')) : '',
          ctrl.showLinkIcon ? m('div.linkIcon', {
            onclick: ctrl.linkToOther.bind(ctrl)
          }, m('span.icon')) : '',
          m('div.clear')
        ]),
        m('caption.p1', m('div.main', {
          onmousemove: function (evt){
            var cardDom = this.querySelector('.card');

            var e = -((window.innerWidth / 2 - evt.pageX) / 20),
                n = ((window.innerHeight / 2 - evt.pageY) / 10);

            cardDom.setAttribute('style', "transform:rotateY(" + e + "deg) rotateX(" + n + "deg);" +
                "-webkit-transform: rotateY(" + e + "deg) rotateX(" + n + "deg);" +
                "-moz-transform: rotateY(" + e + "deg) rotateX(" + n + "deg)");
          }
        }, m('div.card', [
          m('img.frame', {src: './images/bigword.svg'}),
          m('img.john', {src: './images/lines.svg'}),
          m('img.lower', {src: './images/smallword.svg'})
        ]))),
        m('caption.p2', ctrl.p2Images.map(function (imageRow, outerIndex){
          return m('div.row', imageRow.map(function (image, idx){
            return diextPcPage.imageView(ctrl, image, {
              onclick: ctrl.popImageDetail.bind(ctrl, (outerIndex * imageRow.length) + idx, !!image),
              height: '438',
              width: '640',
              scale: '0.333333'
            }, true);
          }));
        })),
        m('div.img-detail' + (ctrl.seeImgDetail ? (ctrl.imgDetailDone ?
                '.default-color' : '.black-bg') : '.default-color'), [
          m('div.top'),
          m('div.main', ctrl.p3Images[ctrl.currentImg].map(function (image){
            return diextPcPage.imageView(ctrl, image, {
              height: ctrl.sizeImages[image].height,
              width: ctrl.sizeImages[image].width || '1080',
              scale: '0.5'
            }, false);
          }))
        ]),
        m('footer', [
          ctrl.showArrowUp ? m('div.scrollUp', {
            onclick: ctrl.nextPage.bind(ctrl)
          }, m('span.icon')) : ''
        ])
      ];
    }
  };

  var diextMobilePage = {
    isInitialized: false,
    init: function (){
      var lazyingImgs = {}, lazyImg = null;
      tool.addEvent(window, 'scroll', function (){
        var docScrollTop = document.querySelector('body').scrollTop, innerHeight = window.innerHeight;
        var lazyImgsDom = document.querySelectorAll('.diext-m img[data-url]');
        [].slice.call(lazyImgsDom, 0, lazyImgsDom.length).forEach(function (imgDom, idx){
          var imgUrl = imgDom.getAttribute('data-url');
          if (lazyingImgs[imgUrl] || IMG_CACHE[imgUrl]) {
            return;
          }

          var imgContainer = imgDom.parentNode, containerTop = imgContainer.offsetTop;
          if (docScrollTop + innerHeight > containerTop + 50) {
            lazyingImgs[imgUrl] = true;

            lazyImg = new Image();
            lazyImg.src = imgUrl;

            lazyImg.onload = function (){
              IMG_CACHE[imgUrl] = true;
              m.redraw();
              console.log(imgUrl + 'loaded');
            };

            lazyImg.onerror = function (){
              console.log('Image url(' + imgUrl + ') load error!');
            };
          }
        });
      });
    },
    viewModel: {
      p2Images: THUMB_IMAGES,
      backToMain: function (){
        location.hash = 'main';

        //var mainDom = document.getElementById('main');
        //mainDom.style.transition = 'all ease 1s';
      }
    },
    controller: function (){

      if (!diextMobilePage.isInitialized) {
        diextMobilePage.init();
      }

      return diextMobilePage.viewModel;
    },
    view: function (ctrl){
      return [
        m('div#main.main', [
          m('header', [
            m('div.left', m('span.text', 'DIEXT LAB')),
            m('nav.right', [
              m('a', {href: '#thumb'}, 'WORKS'),
              m('a', 'ABOUT')
            ]),
            m('di.clear')
          ]),
          m('div.content', m('div.imgs', [
            m('img.target', {src: './images/target.png'}),
            m('img.desc', {src: './images/desc.png'})
          ]))
        ]),
        m('div#thumb.thumb', [
          m('div.title', {onclick: ctrl.backToMain.bind(ctrl)}, 'WORKS'),
          m('div.content', ctrl.p2Images.map(function (groupImages){
            return groupImages.map(function (img){
              var imgUrl = './images/balckline.jpg', showLoading = true, attrs = {};
              if (img && IMG_CACHE[img]) {
                imgUrl = img;
                showLoading = false;
              }

              attrs.src = imgUrl;
              if (img && showLoading) {
                attrs['data-url'] = img;
              }

              return m('div.img' + (showLoading ? '.default' : ''), [
                showLoading ? m('span.loading', 'Loading') : '',
                m('img', attrs)
              ]);
            });
          }))
        ])
      ];
    }
  };

  function loadPage(){
    var container = document.querySelector('.diext'), classList = container.classList;
    if (tool.isPhone()) {
      classList.add('diext-m');
      classList.remove('diext-p');
      m.mount(container, diextMobilePage);
    } else {
      classList.add('diext-p');
      classList.remove('diext-m');
      m.mount(container, diextPcPage);
    }
  }

  loadPage();
  tool.addEvent(window, 'resize', function (){
    loadPage();
  });
})();
