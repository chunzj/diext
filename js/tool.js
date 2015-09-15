/**
 * Created by chunzj on 2015/9/12.
 */
(function() {
    var switchPhoneMaxWidth = 1080;
    var tool = {
        addEvent: function (domNode, type, fn) {
            if (domNode.addEventListener) {
                domNode.addEventListener(type, function (evt) {
                    fn.call(this, evt);
                }, false);
            } else if (domNode.attachEvent) {
                domNode.attachEvent('on' + type, function (evt) {
                    fn.call(this, evt);
                });
            } else {
                domNode['on' + type] = function (evt) {
                    fn.call(this, evt);
                };
            }
        },
        registerMouseScrollEvent: function (scrollFunc) {
            var _scrollFunc = function (evt) {
                var direction = tool.scrollDirection(evt);
                scrollFunc.call(this, evt, direction);
            };

            if(document.addEventListener){
                document.addEventListener('DOMMouseScroll', function(evt) {
                    _scrollFunc.call(this, evt);
                }, false);
            }

            tool.addEvent(window, 'mousewheel', _scrollFunc);
            tool.addEvent(document, 'mousewheel', _scrollFunc);
        },
        scrollDirection: function(evt) {
            evt = evt || window.event;
            return (evt.wheelDelta) ? evt.wheelDelta / 120 : -(evt.detail || 0) / 3;
        },
        checkPlatform: function () {
            var userAgent = navigator.userAgent.toLowerCase();
            this._isPhone = userAgent.indexOf('mobile') !== -1;
        },
        isPhone: function () {
            return this._isPhone || window.innerWidth <= switchPhoneMaxWidth;
        }

    };

    tool.checkPlatform();
    window.tool = tool;
})();
