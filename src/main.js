import { useContext, createContext } from './context'
import { createElement, Fragment, } from './element'
import { Renderer } from './renderer'
export {
    createElement as h,
    useContext,
    createContext,
    createElement,
    Fragment
}

export async function renderToStringAsync(element) {
    const renderer = new Renderer(element);
    try {
        const markup = await renderer.renderAsync();
        return markup;
    } finally {
        renderer.destroy();
    }
}

export function renderToString(element) {
    const renderer = new Renderer(element);
    try {
        const markup = renderer.render(Infinity);
        return markup;
    } finally {
        renderer.destroy();
    }
}

export default {
    h: createElement,
    useContext,
    createContext,
    createElement,
    renderToString,
    renderToStringAsync,
    Fragment
}