![](https://img.shields.io/badge/License-MIT-00CCFF.svg?style=flat-square)
![](https://img.shields.io/badge/supertest--akamai-JS-FF0066.svg?style=flat-square)

<p align="center">
<b><a href="#installation">Installation</a></b>
|
<b><a href="#usage">Usage</a></b>
|
<b><a href="#license">License</a></b>
</p>

# supertest-akamai

[supertest](https://github.com/visionmedia/supertest) extension enabling testing configurations on Akamai Staging and Production networks. It also captures response headers and body using [supertest-capture-error](https://github.com/kjarmicki/supertest-capture-error), which helps with further investigation.

## Installation

Install with [npm](http://npmjs.org/): `npm install lukaszczerpak/supertest-akamai`

Install with [yarn](https://yarnpkg.com/): `yarn add lukaszczerpak/supertest-akamai`

Once installed it can now be referenced by simply calling `require('supertest-akamai');`

## Usage

When you create a request object, you need to pass a URL (protocol + domain) and optionally a hostname to spoof to. Necessary Akamai Pragma header will be added automatically.

For instance, if your website is `www.example.com` and you want to test path `/about-us` against Akamai Production Network, all you need to do is to pass the URL when create request object:

```js
const akamaiReq = require('supertest-akamai');
const request = akamaiReq('http://www.example.com').get('/about-us');
```

For Staging Network the second parameter must point to a staging edge hostname, for instance:

```js
const akamaiReq = require('supertest-akamai');
const request = akamaiReq('http://www.example.com', 'example.com.edgesuite-staging.net').get('/about-us');
```



With [chai-akamai](https://github.com/lukaszczerpak/chai-akamai) gives powerful framework to build unit test suites:

```js
const chai = require('chai');
const expect = chai.expect;
const akamaiReq = require('supertest-akamai');

chai.use(require('chai-http'));
chai.use(require('chai-akamai'));

const request = akamaiReq('http://www.example.com', 'example.com.edgesuite-staging.net').get('/about-us');

describe('sanity check', function () {
  it('respond with OK', function () {
    return paywallReq
      .expect((res) => {
        expect(res.statusCode).to.equal(200);
        expect(res).to.be.akamaiStaging;
      });
  });
});
```

## License

supertest-akamai is licensed under the [MIT license](LICENSE).
