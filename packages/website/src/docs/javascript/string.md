# 字符串用法

## 1、字符串排序

```js
var list = [
  { time: "12:12:12" },
  { time: "12:12:10" },
  { time: "12:12:14" },
  { time: "12:12:11" }
]
list.sort((a,b) => a.time.localeCompare(b.time))
// 输出
//[
//  { "time": "12:12:10" },
//  { "time": "12:12:11" },
//  { "time": "12:12:12" },
//  { "time": "12:12:14" }
//]
```


