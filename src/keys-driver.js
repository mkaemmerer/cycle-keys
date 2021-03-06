import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';
import keycode from 'keycode';

export function makeKeysDriver () {
  return function keysDriver() {
    const methods = {};
    const events = ['keypress', 'keyup', 'keydown'];

    events.forEach(event => {
      const methodName = event.replace('key', '');

      methods[methodName] = (key) => {
        let event$ = fromEvent(document.body, event);

        if (key) {
          const code = keycode(key);

          event$ = event$.filter(event => event.keyCode === code);
        }

        return event$;
      }
    });

    methods['isDown'] = (key) => {
      const code = keycode(key);

      const down$ = fromEvent(document.body, 'keydown')
        .filter(ev => ev.keyCode === code)
        .map(ev => true);

      const up$ = fromEvent(document.body, 'keyup')
        .filter(ev => ev.keyCode === code)
        .map(ev => false);

      return xs.merge(
        down$,
        up$
      ).startWith(false);
    }

    return methods;
  }
}
