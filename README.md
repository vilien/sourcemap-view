# sourcemap-view

View the original code from the sourcemap based on the error lineno and colno. 



## Installation

```bash
npm install sourcemap-view
```



## Why would you want to do that?

When js throws an exception, we can view the original code without Chrome Console or Other.

```
Uncaught TypeError: Cannot read property 'a' of undefined
    at a.getSameError (app.07cd8612.js:1:3842)
    at app.07cd8612.js:1:3357
```



## Usage

```javascript
const fs = require('fs');
const sourcemapView = require('sourcemap-view');

const sourcemapRaw = fs.readFileSync('./app.07cd8612.js.map', { encoding: 'utf-8'});

const view = sourcemapView(JSON.parse(sourcemapRaw));

view(1, 3821); // { file: './HelloWorld.js', lineNo: 43, colNo: 29, name: 'a', content: <Original Code> }
view(1, 3357); // { file: './HelloWorld.js', lineNo: 35, colNo: 0, name: 'setTimeout', content: <Original Code> }
```



## License

[MIT](https://github.com/vilien/sourcemap-view/blob/master/LICENSE).