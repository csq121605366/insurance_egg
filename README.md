# egg

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

* Use `npm run lint` to check code style.
* Use `npm test` to run unit test.
* Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.

[egg]: https://eggjs.org

# 问题

> 这里记录一些问题

* 大部分接口没有对用户的权限限制 比如 role=='0' || ((role=='2'||role=='3')&&status!='2')
