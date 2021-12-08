import { minify } from 'html-minifier-terser'

const _minify = (html, options) => {
  return minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    ...options,
  })
}

export default _minify
