// escape an attribute
export let esc = str => String(str).replace(/[&<>"']/g, s => `&${map[s]};`);
let map = { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', "'": 'apos' };
export let setInnerHTMLAttr = 'dangerouslySetInnerHTML';
export let DOMAttributeNames = {
    className: 'class',
    htmlFor: 'for'
};
