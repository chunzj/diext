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
        './images/sample_5.jpg': false
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
      showArrowUp: false,
      showArrowDown: false,
      currentPage: 1,
      totalPages: 2,
      pageScrollInterval: 1,
      browser: null,

      init: function () {
        this.changeArrow();
        this.detectBrowser();
        this.bindScrollEvent();
      },

      bindScrollEvent: function () {
        var _this = this;
        tool.registerMouseScrollEvent(function (evt, direction) {
          var curCaptionScrollTop = document.querySelectorAll('caption')[_this.currentPage - 1].scrollTop;
          if (curCaptionScrollTop === 0) {
            if (direction > 0) {
              _this.previousPage();
            } else {
              _this.nextPage();
            }
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

      previousPage: function () {
        if (this.currentPage <= 1) {
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
          this.lazyLoadImages();
        }
      },

      scrollPage: function (direction) {
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

        //chane page
        if (direction === 'down') {
          this.currentPage += 1;
        } else if (direction === 'up') {
          this.currentPage -= 1;
        }

        var _this = this;
        setTimeout(function () {
          _this.changeArrow();
          m.redraw();
        }, this.pageScrollInterval * 1000);
      },

      lazyLoadImages: function () {
        var lazyLoadImgs = document.querySelectorAll('img[data-url]'), _this = this;
        if (lazyLoadImgs.length > 0) {
          var img = null, loadingImgs = [];
          [].slice.call(lazyLoadImgs, 0, lazyLoadImgs.length).forEach(function (imgDom) {

            var imgUrl = imgDom.getAttribute('data-url'),
              loaded = _this.imageLoaded[imgUrl];

            if (typeof loaded === 'undefined' || loaded || loadingImgs.indexOf(imgUrl, 0) !== -1) {
              return;
            }

            img = new Image();
            img.src = imgUrl;
            img.onload = function () {
              _this.imageLoaded[imgUrl] = true;
              setTimeout(m.redraw, _this.pageScrollInterval * 1000);
            };

            img.onerror = function () {
              console.log('Image url(' + imgUrl + ') load error!');
            };

            loadingImgs.push(imgUrl);
          });
        }
      }
    },
    controller: function () {

      var vm = index.viewModel;
      vm.init();

      return vm;
    },
    view: function (ctrl) {
      var curLoc = location.href, isServer = (curLoc.indexOf('http') !== -1);
      return [
        m('header', [
          m('div.left', [
            m('span.logo'),
            m('span.txt', 'DIEXT LAB')
          ]),
          m('div.right', m('nav', [
            m('li', 'WORKS'),
            m('li', 'ABOUT')
          ])),
          ctrl.showArrowDown ? m('div.scrollDown', {
            onclick: ctrl.previousPage.bind(ctrl)
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
        m('caption.p2', ctrl.p2Images.map(function (imageRow) {
          return m('div.row', imageRow.map(function (image) {

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

            return m('div.img', [
              showLoading ? m('span.loading', 'Loading') : '',
              m('img', attrs)
            ]);
          }));
        })),
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
