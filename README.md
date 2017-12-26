# vue-datasheet
可能是目前最好的vue excel插件
使用: npm install vue-datasheet
## Options

选项 | 类型 | 描述
:--- | :---: | :---
data | Array | 二维数组,每个元素的属性会传递给对应单元格
valueRenderer | func | 渲染单元格的方法 `function(cell, i, j)`
dataRenderer | func | Method to render the underlying value of the cell `function(cell, i, j)`. This data is visible once in edit mode.
onChange | func | 发生变化的回调函数: `function(cell, i, j, newValue) {}`
onPaste | func | onPaste handler: `function(array) {}` If set, the function will be called with an array of rows. Each row has an array of objects containing the cell and raw pasted value. If the pasted value cannot be matched with a cell, the cell value will be undefined
onContextMenu | func | Context menu handler : `function(event, cell, i, j)`
parsePaste | func | `function (string) {}` If set, the function will be called with the raw clipboard data. It should return an array of arrays of strings. This is useful for when the clipboard may have data with irregular field or line delimiters. If not set, rows will be split with line breaks and cells with tabs.
attributesRenderer | func | Method to add attributes to the cell `function(cell, i, j)`. The function should return an object where the keys are the attribute names and the values are their values. Example bellow.

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
