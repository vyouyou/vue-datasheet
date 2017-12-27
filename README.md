# vue-datasheet

简单易用的在线excel插件

npm install vue-datasheet --save <br>

![image](https://github.com/vyouyou/vue-datasheet/blob/master/assets/example1.gif)
## 选项

选项 | 类型 | 描述
:--- | :---: | :---
data | Array | 二维数组,每个元素的属性会传递给对应单元格
valueRenderer | func | 渲染单元格的方法: `function(cell, i, j)`
onChange | func | 发生变化的回调函数: `function(cell, i, j, newValue) {}`
onPaste | func | 粘贴的回调函数: `function(array) {}`
onContextMenu | func | 鼠标右键的上下文菜单回调: `function(event, cell, i, j)`
parsePaste | func | `function (string) {}` 粘贴时对内容字符串处理的回调函数

## 单元格选项

Option | Type | Default |  Description
:--- | :--- | :--- | :--
readOnly | Bool | false | 是否只读
key | String | undefined | 默认为行列的number
className | Object | undefined | 单元格的class
component | Function | undefined | component(h)形式的jsx自定义单元格
forceComponent | bool | false | 默认只在edit时显示自定义单元格,为true则一直保持自定义单元格形式
disableEvents | bool | false | cell会不可选取
colSpan | number | 1 | cell的colSpan
rowSpan | number | 1 | cell的rowSpan
style | Object | undefined | cell的style
