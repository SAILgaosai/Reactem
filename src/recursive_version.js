import emptyTags from './emptyTags'
import { esc, setInnerHTMLAttr, DOMAttributeNames } from './util'
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE, REACT_PROVIDER_TYPE } from './symbol'

/*
 * This is a recursive version of the algorithm, which helps to understand the algorithm
 */


function renderHeadTag(vm) {
    let html = '';
    if (vm.name) {
        if (emptyTags.indexOf(vm.name) === -1) {
            html += '<' + vm.name;
            if (vm.attrs) for (let i in vm.attrs) {
                if (vm.attrs[i] !== false && vm.attrs[i] != null && i !== setInnerHTMLAttr) {
                    html += ` ${DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i)}="${esc(vm.attrs[i])}"`;
                }
            }
            html += '>';
            if (vm.attrs && vm.attrs[setInnerHTMLAttr]) {
                html += vm.attrs[setInnerHTMLAttr].__html
                html += `</${vm.name}>`
                return html;
            }
        } else {
            html += '<' + vm.name;
            if (vm.attrs) for (let i in vm.attrs) {
                if (vm.attrs[i] !== false && vm.attrs[i] != null && i !== setInnerHTMLAttr) {
                    s += ` ${DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i)}="${esc(vm.attrs[i])}"`;
                }
            }
            html += '/>';
        }
    }
    return html
}
function renderTailTag(vm) {
    if (vm.attrs && vm.attrs[setInnerHTMLAttr]) return ''

    else if (emptyTags.indexOf(vm.name) === -1)
        return `</${vm.name}>`
    else return ''
}

async function renderAsync(root) {
    let html = ''
    if (root instanceof Promise)
        html += await renderAsync(await root)
    else if (root.name instanceof Function)
        html += await renderAsync(await root.name({ ...root.attrs, children: root.children }))
    else if (root instanceof Array)
        for (let i in root) {
            html += await renderAsync(root[i])
        }
    else if (root.$type === REACT_FRAGMENT_TYPE) {
        for (let i in root.children) {
            html += await renderAsync(root.children[i])
        }
    }
    else if (root.$type === REACT_PROVIDER_TYPE) {
        root._ctx.PushProvider(root.attrs.value);
        if (root.children) for (let i in root.children) {
            html += await renderAsync(root.children[i])
        }
        root._ctx.PopProvider();
    }
    else if (root.name) {
        html += renderHeadTag(root)
        if (root.children) for (let i in root.children) {
            html += await renderAsync(root.children[i])
        }
        html += renderTailTag(root)
    } else {
        html += esc(root)
    }
    return html
}


export async function renderToStringAsync(element) {
    return await renderAsync(element)
}
export function renderToString(element) {
    return render(element)
}

function render(root) {
    let html = ''
    if (root instanceof Promise)
        html += render(root)
    else if (root.name instanceof Function)
        html += render(root.name({ ...root.attrs, children: root.children }))
    else if (root instanceof Array)
        for (let i in root) {
            html += render(root[i])
        }
    else if (root.$type === REACT_FRAGMENT_TYPE) {
        for (let i in root.children) {
            html += render(root.children[i])
        }
    }
    else if (root.$type === REACT_PROVIDER_TYPE) {
        root._ctx.PushProvider(root.attrs.value);
        if (root.children) for (let i in root.children) {
            html += render(root.children[i])
        }
        root._ctx.PopProvider();
    }
    else if (root.name) {
        html += renderHeadTag(root)
        if (root.children) for (let i in root.children) {
            html += render(root.children[i])
        }
        html += renderTailTag(root)
    } else {
        html += esc(root)
    }
    return html
}


class Element {
    constructor(name, attrs, children) {
        this.$type = REACT_ELEMENT_TYPE
        this.name = name;
        this.attrs = attrs;
        this.children = children;
    }
}
class FragmentElement extends Element {
    constructor(children) {
        super('', null, children)
        this.$type = REACT_FRAGMENT_TYPE
    }
}
class ProviderElement extends Element {
    constructor(ctx, attrs, children) {
        super('', attrs, children)
        this.$type = REACT_PROVIDER_TYPE
        this._ctx = ctx
    }
}
export function Fragment({ children }) {
    return new FragmentElement(children)
}
export function createElement(type, attrs, ...children) {
    return new Element(type, attrs, children)
}


class Context {
    constructor(defaultValue) {
        this._context = [defaultValue],
            this.Provider = ({ value, children }) => {
                return new ProviderElement(this, { value }, children)
            }
    }
    PushProvider(value) { this._context.push(value) }
    PopProvider() { this._context.pop() }
    currentValue() { return this._context[this._context.length - 1] }
}
export function useContext(context) {
    return context.currentValue()
}
export function createContext(defaultValue) {
    return new Context(defaultValue)
}

export default {
    h: createElement,
    useContext,
    createContext,
    createElement,
    renderToString,
    Fragment
}
