// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "indent": 0,
    "no-tabs": 0,
    "no-mixed-spaces-and-tabs": 0,
    "spaced-comment": 0,
    "no-unused-vars": 0,
    "no-multi-spaces": 0,
    "no-multiple-empty-lines": 0,
    "no-useless-return": 0,
    'no-control-regex': 0
  }
}
