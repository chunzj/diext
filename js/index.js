/**
 * Created by chunzj on 2015/9/9.
 */
(function (){
  var THUMB_IMAGES = [
    [
      './images/sample_1.jpg',
      './images/sample_2.jpg',
      './images/sample_3.jpg'
    ],
    [
      './images/sample_4.jpg',
      './images/sample_5.jpg',
      ''
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
      aboutLinkActive: false,
      seeImgDetail: false,
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
          if (tool.isPhone()) {
            return;
          }

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
              _this.aboutLinkActive = false;
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
          if (tool.isPhone()) {
            return;
          }
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
        this.aboutLinkActive = false;
        this.showDeleteIcon = false;
        this.showLinkIcon = false;
        m.redraw(true);
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

        this.worksLinkActive = true;
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

      domAnimation: function (dom, styleName, interval, validateBrowser){
        if (typeof validateBrowser === 'undefined') {
          validateBrowser = true;
        }

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

        if (!validateBrowser || (!this.browser || (this.browser.name === 'IE' && this.browser.version > 9))) {
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
      popImageDetail: function (imgIdx, isValidImg, loadImg){
        if (!isValidImg) {
          return;
        }

        var _this = this;
        if (loadImg) {
          this.preImgControl(imgIdx);
          m.sync(this.lazyLoadImages('.img-detail', true));
        } else {
          this.aboutLinkActive = true;
        }

        this.paramControl(true);
        m.redraw(true);
      },
      paramControl: function (showDetail){
        var imgDetail = document.querySelector('.diext-p .img-detail'), _this = this;

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

        var x = 1.01, y = 1, z = 1;

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
      },
      bindScaleEvent: function (image, dom, addScale) {

        if (dom.bindEvent) {
          return;
        }

        var _this = this;
        dom.bindEvent = true;

        dom.onmouseover = function (){
          _this.imageScale.call(_this, this, true, !!image, addScale);
        };

        dom.onmouseout = function (){
          _this.imageScale.call(_this, this, false, !!image, addScale);
        }
      },
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
        var imageContainer = element.parentNode;
        if (!showLoading) {
          if (ctrl.currentPage === 2) {
            if (typeof $ !== 'undefined') {
              $(element).animate({opacity: 1}, ctrl.pageScrollInterval * 1000);
            }
            setTimeout(function () {
              var loadingDom = imageContainer.querySelector('.loading');
              if (loadingDom) {
                loadingDom.style.display = 'none';
              }

              element.style.opacity = 1;
              ctrl.bindScaleEvent.call(ctrl, image, element, addScale);
            }, ctrl.pageScrollInterval * 1000);


            ctrl.domAnimation(element, 'opacity');
          }
        }
      }

      return m('div.img' + (showLoading ? '.default' : ''), imgAttrs, [
        m('span.loading', 'Loading'),
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
            m('a' + (ctrl.aboutLinkActive ? '.active' : ''), {
              onclick: ctrl.popImageDetail.bind(ctrl, null, true, false)
            }, 'ABOUT')
          ])),
          ctrl.showArrowDown ? m('div.scrollDown', {
            onclick: ctrl.previousPage.bind(ctrl)
          }, m('span.icon')) : '',
          ctrl.showDeleteIcon ? m('div.deleteIcon', {
            onclick: ctrl.deleteImageDetail.bind(ctrl)
          }, m('span.icon')) : '',
          false ? m('div.linkIcon', {
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
              onclick: ctrl.popImageDetail.bind(ctrl, (outerIndex * imageRow.length) + idx, !!image, true),
              height: '438',
              width: '640',
              scale: '0.333333'
            }, true);
          }));
        })),
        m('div.img-detail',
          !ctrl.aboutLinkActive ? m('div.main', ctrl.p3Images[ctrl.currentImg].map(function (image){
            return diextPcPage.imageView(ctrl, image, {
              height: ctrl.sizeImages[image].height,
              width: ctrl.sizeImages[image].width || '1080',
              scale: '0.5'
            }, false);
          })) : m('div.main.about', [
            m('h3', 'About DIEXT'),
            m('p.desc', 'DIEXT是一家互联网设计公司，创新与创意是DIEXT设计最核心的竞争力。' +
              '同时在用户体验方面积累了多年的经验，为客户打造充满美而惊喜的产品体验与服务。' +
              '我们的业务范围以界面为源点，衍生出用户体验设计、UI视觉设计、营销设计等，覆盖在流行的各种平台'),
            m('p.contact', [
              m('span', '合作或咨询，请发邮件至  '),
              m('a', {href: 'mailto:diecxters@foxmail.com'}, m('strong', 'diecxters@foxmail.com'))
            ])
          ])
        ),
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

        if (!diextMobilePage.viewModel.enableScroll) {
          return;
        }

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
              imgContainer.querySelector('.loading').style.display = 'none';
              m.redraw();
              console.log(imgUrl + 'loaded');
            };

            lazyImg.onerror = function (){
              console.log('Image url(' + imgUrl + ') load error!');
            };
          }
        });
      });

      tool.addEvent(window, 'resize', function (){
        if (tool.isPhone()) {
          var vm = diextMobilePage.viewModel;
          vm.enableScroll = true;
          vm.activeWorks = false;
          vm.activeAbout = false;
          vm.currentThumb = -1;
        }
      });
    },
    viewModel: {
      p2Images: THUMB_IMAGES,
      currentThumb: -1,
      enableScroll: true,
      activeWorks: false,
      activeAbout: false,
      backToMain: function (){
        this.activeWorks = false;
        location.hash = 'main';
      },
      linkToAbout: function () {
        this.activeWorks = true;

        if (this.activeAbout) {
          this.activeAbout = false;
          this.popImageDetail(false, -1);
        }
        location.hash = '#thumb';
      },
      popImageDetail: function (showDetail, thumbIndex) {
        var imgDetail = document.querySelector('.diext-m .img-detail');

        if (showDetail) {
          this.activeAbout = true;
          this.enableScroll = false;
          this.showDetail(true);

          imgDetail.style.zIndex = '120';
          imgDetail.style.opacity = 1;

          diextPcPage.viewModel.domAnimation.call(diextPcPage.viewModel, imgDetail, 'opacity');
          this.adjustDetailHeight();
        } else {
          this.activeAbout = false;
          this.enableScroll = true;
          this.showDetail(false);

          imgDetail.style.zIndex = '100';
          imgDetail.style.opacity = 0;
        }

        this.currentThumb = thumbIndex;
      },
      adjustDetailHeight: function () {
        if (this.currentThumb === -1) {
          document.querySelector('.diext-m .img-detail').style.height = window.innerHeight + 'px';
        }
      },
      showDetail: function (isShow) {
        var mainDom = document.getElementById('main'), thumbDom = document.getElementById('thumb');
        mainDom.style.display = isShow ? 'none' : 'block';
        thumbDom.style.display = isShow ? 'none' : 'block';
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
            m('div.left.logo', m('span.text', 'DIEXT LAB')),
            m('nav.right', [
              m('a' + (ctrl.activeWorks ? '.active' : ''), {href: '#thumb'}, 'WORKS'),
              m('a' + (ctrl.activeAbout ? '.active' : ''), {onclick: ctrl.popImageDetail.bind(ctrl, true, -1)},'ABOUT')
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
        ]),
        m('div.img-detail', [
          m('header', [
            m('div.left.logo', m('span.text', 'DIEXT LAB')),
            m('div.left.delete-icon', {onclick: ctrl.popImageDetail.bind(ctrl, false, -1)}, m('span.icon')),
            m('nav.right', [
              m('a' + (ctrl.activeWorks ? '.active' : ''), {onclick: ctrl.linkToAbout.bind(ctrl)}, 'WORKS'),
              m('a' + (ctrl.activeAbout ? '.active' : ''), {onclick: ctrl.popImageDetail.bind(ctrl, true, -1)},'ABOUT')
            ]),
            m('di.clear')
          ]),
            m('div.content' + (ctrl.currentThumb !== -1 ? '.detail' : '.about'), ctrl.currentThumb !== -1 ? '' : [
              m('h3', 'About DIEXT'),
              m('p.desc', 'DIEXT是一家互联网设计公司，创新与创意是DIEXT设计最核心的竞争力。' +
                  '同时在用户体验方面积累了多年的经验，为客户打造充满美而惊喜的产品体验与服务。' +
                  '我们的业务范围以界面为源点，衍生出用户体验设计、UI视觉设计、营销设计等，覆盖在流行的各种平台'),
              m('p.contact', [
                m('span', '合作或咨询，请发邮件至  '),
                m('a', {href: 'mailto:diecxters@foxmail.com'}, m('strong', 'diecxters@foxmail.com'))
              ])
            ])
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
