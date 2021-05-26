import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from './symbol'

export class Element {
    constructor(name, attrs, children) {
        this.$type = REACT_ELEMENT_TYPE
        this.name = name;
        this.attrs = attrs;
        // the render algorithm used shift/unshift operating, cause it's slower than push/pop, we reverse the array.
        this.children = children.reverse();
    }
}

export function createElement(type, attrs, ...children) {
    return new Element(type, attrs, children)
}


export class FragmentElement extends Element {
    constructor(children) {
        super('', null, children)
        this.$type = REACT_FRAGMENT_TYPE
    }
}

export function Fragment({ children }) {
    return new FragmentElement(children)
}
