/**
 * Created by huangliqin on 2015/9/9.
 */
(function (){
  var index = {
    viewModel: {},
    controller: function (){
      return index.viewModel;
    },
    view: function (){
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
        m('footer', [
            m('div.scrollUp')
        ])
      ];
    }
  };

  m.mount(document.querySelector('.diext'), index);
})();
