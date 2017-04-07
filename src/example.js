import CrepeStore from './crepestore';

/*
 * Example using Crêpe Store
 *
 * Also using virtual-dom and t7 here
 *
 */

function isDefined(variable) {
  return variable != null;
}

function isObject(variable) {
  return typeof variable === 'object';
}

function compileToH({ tag, attrs = {}, children = [] }) {
  if (isDefined(children)) {
    if (isObject(children)) {
      children = children.map( (e) => {
        if (typeof e === 'object') {
          let res = compileToH(e);
          return res;
        }
        else
          return e;
      });
    } else {
      children = [String(children)];
    }
  }
  return virtualDom.h(tag, attrs, children);
}

$(() => {
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

  t7.setOutput(t7.Outputs.Universal);

  function render() {
    var result = t7`
    <div>
      <input type="text" id="input" value="${ store.getters.value }"/>
      <div id="output">
        ${ store.getters.value }
      </div>
    </div>
    `;
    return compileToH(result);
  }

  var tree = render();
  var rootNode = virtualDom.create(tree);

  $('body')[0].appendChild(rootNode);

  $('#input').keyup(function(){
    store.dispatch('changeInput', $(this).val());
  });

  // 3: Wire up the update logic
  store.subscribe(function () {
    var newTree = render();
    var patches = virtualDom.diff(tree, newTree);
    rootNode = virtualDom.patch(rootNode, patches);
    tree = newTree;
  });
});
