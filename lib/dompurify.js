import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)
const TEMPORARY_ATTRIBUTE_HREF_TARGET = 'data-temp-href-target'

DOMPurify.addHook('beforeSanitizeAttributes', function (node) {
  if (node.tagName === 'A') {
    if (!node.hasAttribute('target')) {
      node.setAttribute('target', '_self')
    }
    if (node.hasAttribute('target')) {
      node.setAttribute(TEMPORARY_ATTRIBUTE_HREF_TARGET, node.getAttribute('target'))
    }
  }
})
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if (node.tagName === 'A' && node.hasAttribute(TEMPORARY_ATTRIBUTE_HREF_TARGET)) {
    node.setAttribute('target', node.getAttribute(TEMPORARY_ATTRIBUTE_HREF_TARGET))
    node.removeAttribute(TEMPORARY_ATTRIBUTE_HREF_TARGET)
    if (node.getAttribute('target') === '_blank') {
      node.setAttribute('rel', 'noopener noreferrer')
    }
  }
})

export default DOMPurify
