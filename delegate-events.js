;
(function () {
    window.delegate = function (elRoot, events) {
        var arr, key, eventType, method, selector;

        for (key in events) {
            if (events.hasOwnProperty(key)) {
                arr = key.split(' ');
                eventType = arr.shift();
                selector = arr.join(' ');
                method = events[key];

                elRoot.addEventListener(
                    eventType,
                    getEventHandler(elRoot, selector, method),
                    shouldUseCapture(eventType)
                );
            }
        }
    };

    function shouldUseCapture(eventType) {
        return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(eventType) !== -1;
    }

    function getEventHandler(elRoot, selector, method) {
        return function (e) {
            if (isEventTarget(elRoot, e.target, selector)) {
                method.apply(e.target, arguments);
            }
        }
    }

    function isEventTarget(elRoot, elChild, selector) {
        var nodeList = elRoot.querySelectorAll(selector);
        for (var key in nodeList) {
            if (nodeList.hasOwnProperty(key) && nodeList[key] === elChild) {
                return true;
            }
        }
    }
})();