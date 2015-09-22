;
(function () {
    window.delegate = function (rootElement, events) {
        var arr, key, eventType, method, selector,
            delegatesEvents = {};

        for (key in events) {
            if (events.hasOwnProperty(key)) {
                arr = key.split(' ');
                eventType = arr.shift();
                selector = arr.join(' ');
                method = events[key];

                delegatesEvents[eventType] = delegatesEvents[eventType] || [];
                delegatesEvents[eventType].push({
                    selector: selector,
                    method: method
                });
            }
        }

        for (eventType in delegatesEvents) {
            if (delegatesEvents.hasOwnProperty(eventType)) {
                // Bind event for each type of event
                rootElement.addEventListener(
                    eventType,
                    createEventHandler(rootElement, delegatesEvents[eventType]),
                    shouldUseCapture(eventType)
                );
            }
        }
    };

    function shouldUseCapture(eventType) {
        return ['blur', 'error', 'focus', 'load', 'resize', 'scroll'].indexOf(eventType) !== -1;
    }

    function createEventHandler(rootElement, delegates) {
        return function (e) {
            var selector, method, i,
                bubble = true,
                stopElement = e.currentTarget,
                targetElement = e.target;
            do {
                for (i = 0; i < delegates.length; i++) {
                    selector = delegates[i].selector;
                    method = delegates[i].method;
                    if (isEventTarget(rootElement, targetElement, selector)) {

                        // e.target won't change if we don't delete it.
                        delete e.target;
                        e.target = targetElement;

                        bubble = method.apply(targetElement, arguments);
                    }
                }
            } while (bubble && targetElement != stopElement && (targetElement = targetElement.parentNode));
            return bubble;
        }
    }

    function isEventTarget(rootElement, childElement, selector) {
        var nodeList = rootElement.querySelectorAll(selector);
        for (var key in nodeList) {
            if (nodeList.hasOwnProperty(key) && nodeList[key] === childElement) {
                return true;
            }
        }
    }
})();