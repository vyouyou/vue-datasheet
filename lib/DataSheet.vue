<script>
  import DataCell from "./DataCell.vue";
  import ComponentCell from "./ComponentCell";
  import {
    TAB_KEY,
    ENTER_KEY,
    ESCAPE_KEY,
    LEFT_KEY,
    UP_KEY,
    RIGHT_KEY,
    DOWN_KEY,
    DELETE_KEY,
    BACKSPACE_KEY,
    isEmpty,
    nullFtn,
    range,
    defaultParsePaste
  } from "./constant";
  export default{
    data() {
      return {
        start: {},
        end: {},
        selecting: false,
        forceEdit: false,
        editing: {},
        reverting: {},
        clear: {}
      };
    },

    components: {
      DataCell,
      ComponentCell
    },

    props: {
      props: {
        data: [Array],
        className: [Object],
        overflow: [String],
        dataRenderer: {
          type: Function,
          required: true,
        },
        valueRenderer: {
          type: Function,
          required: true,
        },
        attributesRenderer: {
          type: Function
        },
        overflow: {
          type: String
        },
        changeModel: {
          type: String,
          default: "input"
        }
      }
    },

    watch: {},

    created() {
      this.removeAllListeners = this.removeAllListeners.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
      this.onMouseOver = this.onMouseOver.bind(this);
      this.onDoubleClick = this.onDoubleClick.bind(this);
      this.onContextMenu = this.onContextMenu.bind(this);
      this.handleKey = this.handleKey.bind(this);
      this.handleCopy = this.handleCopy.bind(this);
      this.handlePaste = this.handlePaste.bind(this);
      this.pageClick = this.pageClick.bind(this);
      this.onChange = this.onChange.bind(this);
      this.defaultState = {
        start: {},
        end: {},
        selecting: false,
        forceEdit: false,
        editing: {},
        reverting: {},
        clear: {}
      };
    },

    methods: {
      removeAllListeners() {
        document.removeEventListener("keydown", this.handleKey);
        document.removeEventListener("mousedown", this.pageClick);
        document.removeEventListener("mouseup", this.onMouseUp);
        document.removeEventListener("copy", this.handleCopy);
        document.removeEventListener("paste", this.handlePaste);
      },

      pageClick(e) {
        if (!this.dgDom.contains(e.target)) {
          for (const key in this.defaultState) {
            this[key] = this.defaultState[key];
          }
          this.removeAllListeners();
        }
      },

      handleCopy(e) {
        if (isEmpty(this.editing)) {
          e.preventDefault();
          const { dataRenderer, valueRenderer, data } = this.props;
          const {
            start, end
          } = this;

          const text = range(start.i, end.i).map((i) =>
            range(start.j, end.j).map(j => {
              const cell = data[i][j];
              const value = dataRenderer ? dataRenderer(cell, i, j) : null;
              if (value === "" || value === null || typeof (value) === "undefined") {
                return valueRenderer(cell, i, j);
              }
              return value;
            }).join("\t")).join("\n");
          e.clipboardData.setData("text/plain", text);
        }
      },

      handlePaste(e) {
        if (isEmpty(this.editing)) {
          const start = this.start;
          const parse = this.props.parsePaste || defaultParsePaste;
          const pastedMap = [];
          const pasteData = parse(e.clipboardData.getData("text/plain"));

          let end = {};

          pasteData.forEach((row, i) => {
            const rowData = [];
            row.forEach((pastedData, j) => {
              const cell = this.props.data[start.i + i] && this.props.data[start.i + i][start.j + j];
              rowData.push({ cell: cell, data: pastedData });
              if (cell && !cell.readOnly && !this.props.onPaste) {
                this.onChange(start.i + i, start.j + j, pastedData);
                end = { i: start.i + i, j: start.j + j };
              }
            });
            pastedMap.push(rowData);
          });
          this.props.onPaste && this.props.onPaste(pastedMap);
          this.end = end;
        }
      },

      handleKeyboardCellMovement(e) {
        const { start, editing } = this;
        const { data } = this.props;
        const currentCell = data[start.i][start.j];
        let newLocation = null;

        if (
          (this.forceEdit || currentCell.component !== undefined) &&
          !isEmpty(this.editing) &&
          e.keyCode !== TAB_KEY
        ) {
          return false;
        } else if (e.keyCode === TAB_KEY && !e.shiftKey) {
          newLocation = { i: start.i, j: start.j + 1 };
          newLocation = typeof (data[newLocation.i][newLocation.j]) !== "undefined" ? newLocation : { i: start.i + 1, j: 0 };
        } else if (e.keyCode === RIGHT_KEY) {
          newLocation = { i: start.i, j: start.j + 1 };
        } else if (e.keyCode === LEFT_KEY || e.keyCode === TAB_KEY && e.shiftKey) {
          newLocation = { i: start.i, j: start.j - 1 };
        } else if (e.keyCode === UP_KEY) {
          newLocation = { i: start.i - 1, j: start.j };
        } else if (e.keyCode === DOWN_KEY) {
          newLocation = { i: start.i + 1, j: start.j };
        }

        if (newLocation && data[newLocation.i] && typeof (data[newLocation.i][newLocation.j]) !== "undefined") {
          this.start = newLocation;
          this.end = newLocation;
          this.editing = {};
        }
        if (newLocation) {
          e.preventDefault();
          return true;
        }
        return false;
      },

      getSelectedCells(data, start, end) {
        const selected = [];
        range(start.i, end.i).forEach(i => {
          range(start.j, end.j).forEach(j => {
            selected.push({ cell: data[i][j], i, j });
          });
        });
        return selected;
      },

      handleKey(e) {
        const { start, end, editing } = this;
        const data = this.props.data;
        const isEditing = !isEmpty(editing);
        const noCellsSelected = isEmpty(start);
        const ctrlKeyPressed = e.ctrlKey || e.metaKey;
        const deleteKeysPressed = (e.keyCode === DELETE_KEY || e.keyCode === BACKSPACE_KEY);
        const enterKeyPressed = e.keyCode === ENTER_KEY;
        const escapeKeyPressed = e.keyCode === ESCAPE_KEY;
        const numbersPressed = (e.keyCode >= 48 && e.keyCode <= 57);
        const lettersPressed = (e.keyCode >= 65 && e.keyCode <= 90);
        const numPadKeysPressed = (e.keyCode >= 96 && e.keyCode <= 105);
        const cell = data[start.i][start.j];
        const equationKeysPressed = [
            187, /* equal */
            189, /* substract */
            190, /* period */
            107, /* add */
            109, /* decimal point */
            110
          ].indexOf(e.keyCode) > -1;

        if (noCellsSelected || ctrlKeyPressed || this.handleKeyboardCellMovement(e)) {
          return true;
        }

        if (deleteKeysPressed && !isEditing) {
          this.getSelectedCells(data, start, end).map(({ getSelectedCell, i, j }) =>
            ((!getSelectedCell.readOnly) ? this.onChange(i, j, "") : null));
          //                    e.preventDefault();
        } else if (enterKeyPressed && isEditing) {
          this.editing = {};
          this.reverting = {};
        } else if (escapeKeyPressed && isEditing) {
          this.editing = {};
          this.reverting = editing;
        } else if (enterKeyPressed && !isEditing && !cell.readOnly) {
          this.editing = start;
          this.clear = {};
          this.reverting = {};
          this.forceEdit = true;
        } else if (numbersPressed
          || numPadKeysPressed
          || lettersPressed
          || equationKeysPressed
          || enterKeyPressed
        ) {
          if (!isEditing && !cell.readOnly) {
            this.editing = start;
            this.clear = start;
            this.reverting = {};
            this.forceEdit = false;
          }
        }
      },

      onContextMenu(evt, i, j) {
        const cell = this.props.data[i][j];
        if (this.props.onContextMenu) {
          this.props.onContextMenu(evt, cell, i, j);
        }
      },

      onMouseDown(i, j) {
        setTimeout(() => {
          const editing = (isEmpty(this.editing) || this.editing.i !== i || this.editing.j !== j)
            ? {} : this.editing;
          this.selecting = true;
          this.start = { i, j };
          this.end = { i, j };
          this.editing = editing;
          this.forceEdit = false;

          //Keep listening to mouse if user releases the mouse (dragging outside)
          document.addEventListener("mouseup", this.onMouseUp);
          //Listen for any keyboard presses (there is no input so must attach to document)
          document.addEventListener("keydown", this.handleKey);
          //Listen for any outside mouse clicks
          document.addEventListener("mousedown", this.pageClick);

          //Copy paste event handler
          document.addEventListener("copy", this.handleCopy);
          document.addEventListener("paste", this.handlePaste);
        }, 0);
      },

      onMouseOver(i, j) {
        (this.selecting && isEmpty(this.editing)) ? this.end = { i, j } : null;
      },

      onDoubleClick(i, j) {
        const cell = this.props.data[i][j];
        if (!cell.readOnly) {
          this.editing = { i: i, j: j };
          this.forceEdit = true;
          this.clear = {};
        }
      },

      onClick(i, j) {
        setTimeout(() => {
          const cell = this.props.data[i][j];
          if (!cell.readOnly) {
            this.editing = { i: i, j: j };
            this.forceEdit = true;
            this.clear = {};
          }
        }, 0);
      },

      onMouseUp() {
        this.selecting = false;
        document.removeEventListener("mouseup", this.onMouseUp);
      },

      onChange(i, j, val) {
        this.props.onChange(this.props.data[i][j], i, j, val);
        this.editing = {};
      }
    },

    beforeUpdate(){
      if (!isEmpty(this.end) && !(this.end.i === this.prevEnd.i && this.end.j === this.prevEnd.j)) {
        this.onSelect && this.onSelect(this.data[this.end.i][this.end.j]);
      }
      this.prevEnd.i = this.end.i;
      this.prevEnd.j = this.end.j;
    },

    updated(){

    },

    render(h) {
      const {
        dataRenderer, valueRenderer, attributesRenderer, overflow, changeModel
      } = this.props;

      const isSelected = (i, j) => {
        const start = this.start;
        const end = this.end;
        const posX = (j >= start.j && j <= end.j);
        const negX = (j <= start.j && j >= end.j);
        const posY = (i >= start.i && i <= end.i);
        const negY = (i <= start.i && i >= end.i);

        return (posX && posY) ||
          (negX && posY) ||
          (negX && negY) ||
          (posX && negY);
      };

      const isEditing = (i, j) => this.editing.i === i && this.editing.j === j;
      const isReverting = (i, j) => this.reverting.i === i && this.reverting.j === j;
      const shouldClear = (i, j) => this.clear.i === i && this.clear.j === j;
      return <table ref='table' class={{ "data-grid": true }}>
        <tbody>
        {this.props.data.map((row, i) => {
          return (<tr key={this.props.keyFn ? this.props.keyFn(i) : i}>
            {
              row.map((cell, j) => {
                const props = {
                  key: cell.key ? cell.key : j,
                  className: cell.className ? cell.className : {},
                  row: i,
                  col: j,
                  selected: isSelected(i, j),
                  onMouseDown: cell.disableEvents ? nullFtn : this.onMouseDown,
                  onClick: cell.disableEvents ? nullFtn : this.onClick,
                  onDoubleClick: cell.disableEvents ? nullFtn : this.onDoubleClick,
                  onMouseOver: cell.disableEvents ? nullFtn : this.onMouseOver,
                  onContextMenu: cell.disableEvents ? nullFtn : this.onContextMenu,
                  editing: isEditing(i, j),
                  reverting: isReverting(i, j),
                  colSpan: cell.colSpan,
                  style: cell.style,
                  component: cell.component ? cell.component : null,
                  forceComponent: cell.forceComponent || false,
                  overflow: cell.overflow,
                  value: valueRenderer(cell, i, j),
                  onChange: this.onChange,
                  changeModel: changeModel || "input"
                };

                props.readOnly = cell.readOnly;
                props.rowSpan = cell.rowSpan;
                if (cell.component) {
                  return <ComponentCell
                    forceComponent={cell.forceComponent || false}
                    component={cell.component}
                    props={props}
                  />;
                }
                return <DataCell
                  data={this.dataRenderer ? this.dataRenderer(cell, i, j) : null}
                  clear={shouldClear(i, j)}
                  rowSpan={cell.rowSpan}
                  readOnly={cell.readOnly}
                  props={props}
                />;
              })
            }
          </tr>);
        })}
        </tbody>
      </table>;
    },

    beforeDestroy() {
      this.removeAllListeners();
    },

    created(){
      this.prevEnd = { i: "", j: "" };
    },

    mounted() {
      this.dgDom = this.$refs.table;
    }
  };
</script>

<style type="text/css">
  @import "./react-datasheet.css";
</style>

<style type="text/css" scoped>
</style>
