# Reactem

[![NPM](https://github.com/SAILgaosai/Reactem/workflows/test/badge.svg)](https://github.com/SAILgaosai/Reactem/actions) [![NPM](https://img.shields.io/npm/v/@gsail/reactem.svg)](https://www.npmjs.com/package/@gsail/reactem) [![NPM](https://img.shields.io/npm/l/@gsail/reactem.svg)](https://www.npmjs.com/package/@gsail/reactem)

### **A template engine to generate html on server which you can write in JSX and use React.useContext API**

This framework is inspired by [vhtml](https://github.com/developit/vhtml) and [React](https://github.com/facebook/react). I want to use JSX to render HTML on the server side, but I don't want to use React. It is static HTML, VDOM is not necessary. 

Then I found [vhtml](https://github.com/developit/vhtml), a light framework that Render JSX/Hyperscript to HTML strings, without VDOM. 

But I needed some asynchronous operations and Context, so I developed this **Reactem** (React + Template).

In some less rigorous test situations, **it is 3 times faster than React**

Reactem is currently just a toy. It is not perfect and there may be bugs. Feedback and issues are welcome.
## Installation

`yarn add @gsail/reactem`

**OR**

`npm install --save @gsail/reactem`


---


## Usage

```js
// import the library:
import Reactem, { renderToString } from '@gsail/reactem'

// you might need @babel/plugin-transform-react-jsx
// tell babel to transpile JSX to h() calls:
/** @jsx Reactem.h */    
/** @jsxFrag Reactem.Fragment */

// OR /** @jsx Reactem.createElement */

// Write some simple functional components, just like in React

const Item = ({ item, index, children }) => (
  <li id={index}>
    <h4>{item}</h4>
    {children}
  </li>
);

const App = ()=>{
    let items = ['book', 'card', 'notebook'];
    return (
        <div class="foo">
            <h1>Hello World!</h1>
            <p>Here is a list of {items.length} items:</p>
            <ul>
                { items.map( (item, index) => 
                    <Item {...{ item, index }}>
                        This is : {item}!
                    </Item> )}
            </ul>
        </div>
    )
}

// Then render it to get the html string
console.log(renderToString(<App>));

```

The HTML you get:

```html
<div class="foo">
    <h1>Hello World!</h1>
    <p>Here is a list of 3 items:</p>
    <ul>
        <li id="0">
            <h4>book</h4>This is : book!
        </li>
        <li id="1">
            <h4>card</h4>This is : card!
        </li>
        <li id="2">
            <h4>notebook</h4>This is : notebook!
        </li>
    </ul>
</div>
```

## Usage of async/await & Context API

```js
import Reactem, { createContext, useContext, renderToStringAsync } from '@gsail/reactem'

/** @jsx Reactem.h */
/** @jsxFrag Reactem.Fragment */


const CTX = createContext({v: 0})

let sleep = (time) => new Promise(reslove => {
    setTimeout(() => reslove(time), time * 1000)
})

let B = () => {
    let ctx = useContext(CTX)

    return (<div>
        B.ctx.v:{ctx.v}
    </div>)
};

let C = async () => {
    let time = await sleep(1)
    let ctx = useContext(CTX)

    return (<div className='con'>
        Time:{time} C.ctx.v:{ctx.v}
        <CTX.Provider value={{v:2}}>
            <B/>
        </CTX.Provider>
        <B/>
    </div>)
};

let App = ()=>{

    return <>
        <style dangerouslySetInnerHTML={{__html:'.con{color:red}'}}/>
        <CTX.Provider value={{v:9}}>
            <C/>
        </CTX.Provider>
        <B/>
    </>
};

(async ()=>{
    console.log(await renderToStringAsync(<App>));
}())
```

The HTML you get:

```html
<style>.con{color:red}</style>
<div class="con">
    Time:1 C.ctx.v:9
    <div>B.ctx.v:2</div>
    <div>B.ctx.v:9</div>
    <div>B.ctx.v:0</div>
</div>
```