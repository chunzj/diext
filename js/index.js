/**
 * Created by huangliqin on 2015/9/9.
 */
(function () {
  var index = {
    viewModel: {
      p2Images: [
        [
          '../images/sample_1.jpg',
          '../images/sample_2.jpg',
          '../images/sample_3.jpg'
        ],
        [
          '../images/sample_4.jpg',
          '../images/sample_5.jpg',
          '../images/sample_1.jpg'
        ],
        [
          '../images/sample_1.jpg',
          '../images/sample_2.jpg',
          '../images/sample_3.jpg'
        ]
      ],
      showArrowUp: true,
      showArrowDown: false
    },
    controller: function () {
      return index.viewModel;
    },
    view: function (ctrl) {
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
          ctrl.showArrowDown ? m('div.scrollDown', m('span.icon')) : '',
          m('div.clear')
        ]),
        m('caption.p1', [
          m('div.card', {
            onmousemove: function (evt) {
              var e = (window.innerWidth / 2 - evt.pageX) / 20,
                n = (window.innerHeight / 2 - evt.pageY) / 20;

              this.setAttribute('style', "transform:rotateY(" + e + "deg) rotateX(" + n + "deg);" +
                "-webkit-transform: rotateY(" + e + "deg) rotateX(" + n + "deg);" +
                "-moz-transform: rotateY(" + e + "deg) rotateX(" + n + "deg)");
            }
          }, [
            m('img.frame', {src: './images/p1.png'}),
            m('img.john', {src: './images/p2.png'}),
            m('img.lower', {src: './images/p3.png'})
          ])
        ]),
        m('caption.p2', ctrl.p2Images.map(function (imageRow) {
          return m('div.row', imageRow.map(function (image) {
            return m('div.img', [
              m('span.loading', 'Loading'),
              m('img', {'data-url': image})
            ]);
          }));
        })),
        m('footer', [
          ctrl.showArrowUp ? m('div.scrollUp', m('span.icon')) : ''
        ])
      ];
    }
  };

  m.mount(document.querySelector('.diext'), index);
})();
