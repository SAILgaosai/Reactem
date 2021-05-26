/** @jsx Reactem.h */
/** @jsxFrag Reactem.Fragment */

import Reactem, { createContext, useContext, renderToString, renderToStringAsync } from '../src/recursive_version'

let sleep = (time) => new Promise(reslove => {
    setTimeout(() => reslove(time), time * 1000)
})

let B = () => {
    let ctx = useContext(CTX)

    return (<div>
        B.ctx.v:{ctx.v}
    </div>)
};

let C = async ({children}) => {
    let time = await sleep(0.001)
    let ctx = useContext(CTX)

    return (<p className='con'>
        {time} C.ctx.v:{ctx.v}
        <div>
            {children}
        </div>
        <CTX.Provider value={{v:2}}>
            <B/>
        </CTX.Provider>
        <B/>
    </p>)
};

const CTX = createContext({v: 1})

function APP() {

    return <body>
        <style dangerouslySetInnerHTML={{__html:'.body{color:red}'}}/>
        <CTX.Provider value={{v:9}}>
            <C>
                C1
            </C>
        </CTX.Provider>
    </body>
}

test('should support async and ctx', async () => {
    expect(await renderToStringAsync(<APP/>)).toBe(`<body><style>.body{color:red}</style><p class="con">0.001 C.ctx.v:9<div>C1</div><div>B.ctx.v:2</div><div>B.ctx.v:9</div></p></body>`)
});




test('should stringify html', () => {
    let items = ['one', 'two', 'three'];
    expect(renderToString(
        <div class="foo">
            <h1>Hi!</h1>
            <p>Here is a list of {items.length} items:</p>
            <ul>
                { items.map( item => (
                    <li>{ item }</li>
                )) }
            </ul>
        </div>
    )).toBe(
        `<div class="foo"><h1>Hi!</h1><p>Here is a list of 3 items:</p><ul><li>one</li><li>two</li><li>three</li></ul></div>`
    );
});

test('should sanitize children', () => {
    expect(renderToString(
        <div>
            { `<strong>blocked</strong>` }
            <em>allowed</em>
        </div>
    )).toBe(
        `<div>&lt;strong&gt;blocked&lt;/strong&gt;<em>allowed</em></div>`
    );
});

test('should sanitize attributes', () => {
    expect(renderToString(
        <div onclick={`&<>"'`} />
    )).toBe(
        `<div onclick="&amp;&lt;&gt;&quot;&apos;"></div>`
    );
});

test('should not sanitize the "dangerouslySetInnerHTML" attribute, and directly set its `__html` property as innerHTML', () => {
    expect(renderToString(
        <div dangerouslySetInnerHTML={{ __html: "<span>Injected HTML</span>" }} />
    )).toBe(
        `<div><span>Injected HTML</span></div>`
    );
});

test('should flatten children', () => {
    expect(renderToString(
        <div>
            {[['a','b']]}
            <c>d</c>
            {['e',['f'],[['g']]]}
        </div>
    )).toBe(
        `<div>ab<c>d</c>efg</div>`
    );
});

test('should support sortof components', () => {
    let items = ['one', 'two'];

    const Item = ({ item, index, children }) => (
        <li id={index}>
            <h4>{item}</h4>
            {children}
        </li>
    );

    expect(renderToString(
        <div class="foo">
            <h1>Hi!</h1>
            <ul>
                { items.map( (item, index) => (
                    <Item {...{ item, index }}>
                        This is item {item}!
                    </Item>
                )) }
            </ul>
        </div>
    )).toBe(
        `<div class="foo"><h1>Hi!</h1><ul><li id="0"><h4>one</h4>This is item one!</li><li id="1"><h4>two</h4>This is item two!</li></ul></div>`
    );
});

it('should support sortof components without args', () => {
  let items = ['one', 'two'];

  const Item = () => (
    <li>
      <h4></h4>
    </li>
  );

  expect(renderToString(
    <div class="foo">
      <h1>Hi!</h1>
      <ul>
        { items.map( (item, index) => (
          <Item>
            This is item {item}!
          </Item>
        )) }
      </ul>
    </div>
  )).toBe(
    `<div class="foo"><h1>Hi!</h1><ul><li><h4></h4></li><li><h4></h4></li></ul></div>`
  );
});

test('should support sortof components without args but with children', () => {
  let items = ['one', 'two'];

  const Item = ({ children }) => (
    <li>
      <h4></h4>
      {children}
    </li>
  );

  expect(renderToString(
    <div class="foo">
      <h1>Hi!</h1>
      <ul>
        { items.map( (item, index) => (
          <Item>
            This is item {item}!
          </Item>
        )) }
      </ul>
    </div>
  )).toBe(
    `<div class="foo"><h1>Hi!</h1><ul><li><h4></h4>This is item one!</li><li><h4></h4>This is item two!</li></ul></div>`
  );
});

test('should support empty (void) tags', () => {
    expect(renderToString(
        <div>
            <area />
            <base />
            <br />
            <col />
            <command />
            <embed />
            <hr />
            <img />
            <input />
            <keygen />
            <link />
            <meta />
            <param />
            <source />
            <track />
            <wbr />
            {/* Not void elements */}
            <div />
            <span />
            <p />
        </div>
    )).toBe(
        `<div><area/><base/><br/><col/><command/><embed/><hr/><img/><input/><keygen/><link/><meta/><param/><source/><track/><wbr/><div></div><span></span><p></p></div>`
    );
});

test('should handle special prop names', () => {
    expect(renderToString(
        <div className="my-class" htmlFor="id" />
    )).toBe(
        '<div class="my-class" for="id"></div>'
    );
});

test('should support string fragments', () => {
    expect(renderToString(
        <>foo{'bar'}baz</>
    )).toBe(
        'foobarbaz'
    );
});

test('should support element fragments', () => {
    expect(renderToString(
        <>
            <p>foo</p>
            <em>bar</em>
            <div class="qqqqqq">
                baz
            </div>
        </>
    )).toBe(
        '<p>foo</p><em>bar</em><div class="qqqqqq">baz</div>'
    );
});