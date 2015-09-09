/**
 * Created by huangliqin on 2015/9/9.
 */
(function () {
    var index = {
        viewModel: {},
        controller: function () {
            return index.viewModel;
        },
        view: function () {
            return [
                m('header', [
                    m('div.left', 'DIEXT LAB'),
                    m('div.right', m('nav', [
                        m('li', 'WORKS'),
                        m('li', 'ABOUT')
                    ])),
                    m('div.clear')
                ]),
                m('caption'),
                m('footer')
            ];
        }
    };

    m.mount(document.querySelector('.diext'), index);
})();
