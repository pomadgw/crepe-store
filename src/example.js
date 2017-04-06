import CrepeStore from './crepestore';

// From https://davidwalsh.name/javascript-debounce-function :
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;
  return function(...args) {
    var later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
};

function throttle(fn, threshhold = 250, scope = this) {
  var last,
      deferTimer;
  return function (...args) {
    var context = scope;

    var now = +new Date;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

$(() => {
  var $input = $('#input');
  var $output = $('#output');

  var store = new CrepeStore({
    state: {
      text: 'Type something'
    },
    mutations: {
      change(state, text) {
        state.text = text;
      }
    },
    actions: {
      changeInput({ commit }, text) {
        commit('change', text);
      }
    },
    getters: {
      value(state) {
        return state.text;
      }
    }
  });

  store.subscribe(() => {
    $output.text(store.getters.value);
  });

  $input.keyup(throttle(function(event) {
    store.dispatch('changeInput', $input.val());
  }, 250));
});
