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
                currentTarget = e.target;
            do {
                for (i = 0; i < delegates.length; i++) {
                    selector = delegates[i].selector;
                    method = delegates[i].method;
                    if (isEventTarget(rootElement, currentTarget, selector)) {
                        e = createEvent(e, stopElement, currentTarget);
                        bubble = method.call(currentTarget, e);
                        if(bubble !== false){
                            // Default: bubble is true
                            bubble = true;
                        }
                    }
                }
            } while (bubble && currentTarget != stopElement && (currentTarget = currentTarget.parentNode));
            return bubble;
        }
    }

    function createEvent(e, stopElement, currentTarget) {
        var EventClass = e.constructor;
        var fixed = new EventClass(e.type, e);
        addProperty(fixed, 'target', stopElement);
        addProperty(fixed, 'currentTarget', currentTarget);
        return fixed;
    }

    function addProperty(obj, prop, val) {
        Object.defineProperty(obj, prop, {value: val, enumerable: true});
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