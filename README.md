# vue-datasheet

满足基本excel功能的vue插件

npm install vue-datasheet --save <br>

![image](https://github.com/vyouyou/vue-datasheet/blob/master/assets/example1.gif)
## Options

选项 | 类型 | 描述
:--- | :---: | :---
data | Array | 二维数组,每个元素的属性会传递给对应单元格
valueRenderer | func | 渲染单元格的方法: `function(cell, i, j)`
onChange | func | 发生变化的回调函数: `function(cell, i, j, newValue) {}`
onPaste | func | 粘贴的回调函数: `function(array) {}`
onContextMenu | func | 鼠标右键的上下文菜单回调: `function(event, cell, i, j)`
parsePaste | func | `function (string) {}` 粘贴时对内容字符串处理的回调函数

## Cell Options

The cell object is what gets passed back to the onChange callback. They can contain the following options as well

Option | Type | Default |  Description
:--- | :--- | :--- | :--
readOnly | Bool | false | Cell will never go in edit mode
key | String | undefined | By default, each cell is given the key of col number and row number. This would override that key
className | String | undefined | Additional class names for cells.
component | ReactElement | undefined | Insert a react element or JSX to this field. This will render on edit mode
forceComponent | bool | false | Renders what's in component at all times, even when not in edit mode
disableEvents | bool | false | Makes cell unselectable and read only
colSpan | number | 1 | The colSpan of the cell's td element
rowSpan | number | 1 | The rowSpan of the cell's td element
width | number or String | undefined | Sets the cell's td width using a style attribute. Number is interpreted as pixels, strings are used as-is. Note: This will only work if the table does not have a set width.
overflow | 'wrap'\|'nowrap'\| 'clip' | undefined | How to render overflow text. Overrides grid-level `overflow` option.
