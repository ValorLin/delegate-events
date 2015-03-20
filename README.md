# delegate-events
Delegate all events with one call.

## Usage
[DEMO](https://weilao.github.io/delegate-events/demo.html)
```js
delegate(document.body, {
    'click .btn-test': function () {
        alert('click button');
    },
    'focus .input-test': function (e) {
        alert('focus')
    }
});
```

## Compatibility
IE9+