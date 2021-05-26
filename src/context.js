import { Element } from './element';
import { REACT_PROVIDER_TYPE } from './symbol'
/*
 * Implementation of React.Context API
 */
export class Context {
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
export class ProviderElement extends Element {
    constructor(ctx, attrs, children) {
        super('', attrs, children)
        this.$type = REACT_PROVIDER_TYPE
        this._ctx = ctx
    }
}
export function useContext(context) {
    return context.currentValue()
}
export function createContext(defaultValue) {
    return new Context(defaultValue)
}