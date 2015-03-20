# delegate-events
Delegate all events with one call.
## Usage

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