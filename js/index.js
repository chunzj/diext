/**
 * Created by chunzj on 2015/9/9.
 */
(function () {
  var index = {
    initialized: false,

    viewModel: {
      imageLoaded: {
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
        './images/1080banyan_01_07.jpg': false,
        './images/1080banyan_02_01.jpg': false,
        './images/1080banyan_02_02.jpg': false,
        './images/1080banyan_02_03.jpg': false,
      },
      p2Images: [
        [
          './images/sample_1.jpg',
          './images/sample_2.jpg',
          './images/sample_3.jpg'
        ],
        [
          './images/sample_4.jpg',
          './images/sample_5.jpg',
          ''
        ],
        [
          './images/sample_1.jpg',
          './images/sample_2.jpg',
          './images/sample_3.jpg'
        ],
        [
          './images/sample_1.jpg',
          './images/sample_2.jpg',
          './images/sample_3.jpg'
        ]
      ],

      p3Images: [],
      p3ImagesNum: [7, 3],

      showArrowUp: false,
      showArrowDown: false,
      currentPage: 1,
      totalPages: 2,
      pageScrollInterval: 1,
      browser: null,
      scrollDone: true,
      worksLinkActive: false,
      seeImgDetail: false,
      showDeleteIcon: false,
      showLinkIcon: false,
      currentImg: 0,

      init: function () {
        this.initImgResource();
        this.changeArrow();
        this.detectBrowser();
        this.bindScrollEvent();
      },

      initImgResource: function () {
        var row = 0, _this = this;
        this.p2Images.forEach(function (subImages, idx) {
          row = idx * subImages.length;
          subImages.forEach(function (img, index) {
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

      bindScrollEvent: function () {
        var _this = this;
        tool.registerMouseScrollEvent(function (evt, direction) {
          var curCaptionScrollTop = document.querySelectorAll('caption')[_this.currentPage - 1].scrollTop;
          if (curCaptionScrollTop === 0) {
            if (direction > 0) {
              _this.previousPage();
            } else {
              _this.nextPage(_this.isServer());
            }
            m.redraw();
          }
        });
      },

      detectBrowser: function () {
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
      },

      changeArrow: function () {
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

      deleteImageDetail: function () {
        this.preImgControl();
        this.paramControl(false);
      },

      linkToOther: function () {

      },

      previousPage: function () {
        if (this.currentPage <= 1) {
          this.worksLinkActive = false;
          return;
        }

        this.scrollPage('up');
      },

      nextPage: function (isServer) {
        if (this.currentPage >= this.totalPages) {
          return;
        }

        this.scrollPage('down');
        if (isServer) {
          this.lazyLoadImages('caption.p2', true);
        }
      },

      scrollPage: function (direction) {

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

        if (!this.browser || (this.browser.name === 'IE' && this.browser.version > 9)) {
          currentCaption.style.transition = 'top ' + this.pageScrollInterval + 's';
          currentCaption.style['-moz-transition'] = 'top ' + this.pageScrollInterval + 's';
          currentCaption.style['-webkit-transition'] = 'top ' + this.pageScrollInterval + 's';
          currentCaption.style['-o-transition'] = 'top ' + this.pageScrollInterval + 's';

          nextCaption.style.transition = 'top ' + this.pageScrollInterval + 's';
          nextCaption.style['-moz-transition'] = 'top ' + this.pageScrollInterval + 's';
          nextCaption.style['-webkit-transition'] = 'top ' + this.pageScrollInterval + 's';
          nextCaption.style['-o-transition'] = 'top ' + this.pageScrollInterval + 's';
        }

        var _this = this;
        setTimeout(function () {
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

          m.redraw();
        }, this.pageScrollInterval * 1000);
      },

      lazyLoadImages: function (container, redraw) {
        var lazyLoadImgs = document.querySelectorAll(container + ' img[data-url]'), _this = this, deferrs = [];
        if (lazyLoadImgs.length > 0) {
          var img = null, loadingImgs = [];
          [].slice.call(lazyLoadImgs, 0, lazyLoadImgs.length).forEach(function (imgDom) {

            var imgUrl = imgDom.getAttribute('data-url'),
              loaded = _this.imageLoaded[imgUrl];

            if (typeof loaded === 'undefined' || loaded || loadingImgs.indexOf(imgUrl, 0) !== -1) {
              return;
            }

            deferrs.push(_this.loadImg(imgUrl, redraw));

            loadingImgs.push(imgUrl);
          });
        }

        return deferrs;
      },
      loadImg: function (imgUrl, redraw) {
        var deferred = m.deferred(), img = new Image(), _this = this;
        img.src = imgUrl;
        img.onload = function () {

          _this.imageLoaded[imgUrl] = true;
          if (redraw) {
            setTimeout(m.redraw, _this.pageScrollInterval * 1000);
          }

          deferred.resolve();
        };

        img.onerror = function () {
          console.log('Image url(' + imgUrl + ') load error!');
          deferred.reject();
        };

        return deferred.promise;
      },
      preImgControl: function (imgIdx) {
        this.currentImg = imgIdx || 0;
        m.redraw(true);
      },
      popImageDetail: function (imgIdx, isServer, isValidImg) {
        if (!isValidImg) {
          return;
        }

        this.preImgControl(imgIdx);

        var _this = this;
        if (isServer) {
          m.sync(this.lazyLoadImages('.img-detail')).then(function () {
            _this.paramControl(true);
            m.redraw();
          });
        } else {
          this.paramControl(true);
        }
      },
      paramControl: function (showDetail) {
        var imgDetail = document.querySelector('.diext .img-detail');
        imgDetail.style.display = showDetail ? 'block' : 'none';

        this.showArrowDown = !showDetail;
        this.showArrowUp = !showDetail;
        this.showDeleteIcon = showDetail;
        this.showLinkIcon = showDetail;

        this.seeImgDetail = showDetail;
      },
      isServer: function () {
        var curLoc = location.href;
        return (curLoc.indexOf('http') !== -1);
      }
    },
    controller: function () {

      var vm = index.viewModel;
      vm.init();

      return vm;
    },

    imageView: function (ctrl, image, isServer, imgAttrs) {
      var attrs = {}, showLoading = false;
      if (image) {
        if (isServer && !ctrl.imageLoaded[image]) {
          showLoading = true;
          attrs['data-url'] = image;
        } else {
          attrs.src = image;
        }
      } else {
        showLoading = true;
      }

      return m('div.img', imgAttrs, [
        showLoading ? m('span.loading', 'Loading') : '',
        m('img', attrs)
      ]);
    },

    view: function (ctrl) {
      var isServer = ctrl.isServer();
      return [
        m('header' + (ctrl.seeImgDetail ? '.white-bg' : ''), [
          m('div.left', [
            m('span.logo'),
            m('span.txt', 'DIEXT LAB')
          ]),
          m('div.right', m('nav', [
            m('a' + (ctrl.worksLinkActive && ctrl.scrollDone ? '.active' : ''), {
              onclick: function () {
                ctrl.worksLinkActive = true;
                ctrl.nextPage.call(ctrl, isServer);
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
          onmousemove: function (evt) {
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
        m('caption.p2', ctrl.p2Images.map(function (imageRow, outerIndex) {
          return m('div.row', imageRow.map(function (image, idx) {
            return index.imageView(ctrl, image, isServer, {
              onclick: ctrl.popImageDetail.bind(ctrl, (outerIndex * imageRow.length) + idx, isServer, !!image)
            });
          }));
        })),
        m('div.img-detail', [
          m('div.top'),
          m('div.main', ctrl.p3Images[ctrl.currentImg].map(function(image) {
            return index.imageView(ctrl, image, isServer);
          }))
        ]),
        m('footer', [
          ctrl.showArrowUp ? m('div.scrollUp', {
            onclick: ctrl.nextPage.bind(ctrl, isServer)
          }, m('span.icon')) : ''
        ])
      ];
    }
  };

  m.mount(document.querySelector('.diext'), index);
})();
