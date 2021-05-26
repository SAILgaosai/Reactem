import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE, REACT_PROVIDER_TYPE } from './symbol'
import emptyTags from './emptyTags'
import { esc, setInnerHTMLAttr, DOMAttributeNames } from './util'
import { Element, FragmentElement } from './element';
import { ProviderElement } from './context';

export class Renderer {
    constructor(vm) {
        this.stack = [];
        this.html = '';
        this.root = vm;
    }
    push(vm) {
        if (vm.$type === REACT_PROVIDER_TYPE) {
            vm._ctx.PushProvider(vm.attrs.value);
        } else if (vm.$type === REACT_FRAGMENT_TYPE)
            ;
        else {
            if (vm.name) {
                if (emptyTags.indexOf(vm.name) === -1) {
                    this.html += '<' + vm.name;
                    if (vm.attrs) for (let i in vm.attrs) {
                        if (vm.attrs[i] !== false && vm.attrs[i] != null && i !== setInnerHTMLAttr) {
                            this.html += ` ${DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i)}="${esc(vm.attrs[i])}"`;
                        }
                    }
                    this.html += '>';
                    if (vm.attrs && vm.attrs[setInnerHTMLAttr]) {
                        this.html += vm.attrs[setInnerHTMLAttr].__html
                        this.html += `</${vm.name}>`
                        return;
                    }
                } else {
                    this.html += '<' + vm.name;
                    if (vm.attrs) for (let i in vm.attrs) {
                        if (vm.attrs[i] !== false && vm.attrs[i] != null && i !== setInnerHTMLAttr) {
                            s += ` ${DOMAttributeNames[i] ? DOMAttributeNames[i] : esc(i)}="${esc(vm.attrs[i])}"`;
                        }
                    }
                    this.html += '/>';
                }
            }
        }

        this.stack.push(vm);
    }
    pop() {
        let vm = this.stack.pop();

        if (vm.$type === REACT_PROVIDER_TYPE) {
            vm._ctx.PopProvider();
        } else if (vm.$type === REACT_FRAGMENT_TYPE)
            ;
        else {
            if (vm.name) {
                if (emptyTags.indexOf(vm.name) === -1) {
                    this.html += `</${vm.name}>`
                }
                else;
            }
        }
    }
    render() {
        while (this.root.name instanceof Function) {
            this.root = this.root.name({ ...this.root.attrs, children: this.root.children.slice().reverse() });
        }
        if (this.root instanceof Array) {
            this.root = new FragmentElement(this.root)
        }
        if (this.root instanceof Element) {
            this.push(this.root)
        } else {
            this.html += esc(this.root)
        }
        while (this.stack.length > 0) {
            let top = this.stack[this.stack.length - 1];
            if (!top.children || top.children.length == 0) {
                this.pop();
            }
            else {
                let first = top.children.pop();//将i从children中去除，防止重复
                if (first instanceof Element) {
                    if (first.name instanceof Function) {
                        let res = first.name({ ...first.attrs, children: first.children.slice().reverse() })
                        top.children.push(res)
                    }
                    else this.push(first)
                }
                else if (first instanceof Array) {
                    for (let i of first.slice().reverse())
                        top.children.push(i)
                }
                else {
                    this.html += esc(first)
                }
            }
        }
        return this.html
    }
    async renderAsync() {
        if (this.root instanceof Promise)
            this.root = await this.root;
        while (this.root.name instanceof Function) {
            this.root = await this.root.name({ ...this.root.attrs, children: this.root.children.slice().reverse() });
        }
        if (this.root instanceof Array) {
            this.root = new FragmentElement(this.root)
        }
        if (this.root instanceof Element) {
            this.push(this.root)
        } else {
            this.html += esc(this.root)
        }
        while (this.stack.length > 0) {
            let top = this.stack[this.stack.length - 1];
            if (!top.children || top.children.length == 0) {
                this.pop();
            }
            else {
                let first = top.children.pop();//将i从children中去除，防止重复
                if (first instanceof Element) {
                    if (first.name instanceof Function) {
                        let res = await first.name({ ...first.attrs, children: first.children.slice().reverse() })
                        top.children.push(res)
                    }
                    else this.push(first)
                }
                else if (first instanceof Array) {
                    for (let i of first.slice().reverse())
                        top.children.push(i)
                }
                else {
                    this.html += esc(first)
                }
            }
        }
        return this.html
    }
    destroy() {

    }
}