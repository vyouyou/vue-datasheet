<script>
  export default {
      props: {
          props: {
              value: [String, Number],
              row: { type: Number, required: true },
              col: { type: Number, required: true },
              colSpan: { type: Number, required: true },
              rowSpan: { type: Number, required: true },
              overflow: [String],
              selected: [Boolean],
              editing: [Boolean],
              onMouseDown: [Function],
              onDoubleClick: [Function],
              onMouseOver: [Function],
              onContextMenu: [Function]
          }
      },

      data() {
          return {};
      },

      watch: {
          "props.editing"(newVal, oldVal) {
              //         console.log("oldval",oldVal, this.props.editing,this.props.reverting);
              //         if (oldVal === true && this.props.editing === false && this.props.reverting === false) {
              //           console.log("this_input","11"+this._input.value);
              //           this.onChange(this._input.value);
              //         }
              if (oldVal === false && this.props.editing === true) {
                  if (this.props.clear) {
                      this._input.value = "";
                  } else {
                      this._input.value = this.props.data === null ? this.props.value : this.props.data;
                  }
                  this._input.focus();
              }
          }
      },

      methods: {
          onChange(value) {
              const initialData = this.props.data === null ? this.props.value : this.props.data;
              (value === "" || initialData !== value && this.props.reverting === false) && this.props.onChange(this.props.row, this.props.col, value);
              this._input.value = "";
          }
      },

      render(h) {
          const {
              row, col, rowSpan, readOnly, colSpan, style, overflow, className,
              editing, selected, onMouseDown, onMouseOver, onDoubleClick, onClick, onContextMenu,
              changeModel
          } = this.props;
          const { value } = this.props;
          const classObj = {
              cell: true,
              selected: selected,
              editing: editing,
              "read-only": readOnly,
              ...className
          };
          return (
              <td
                  key={row + col}
                  class={classObj}
                  onMousedown={() => onMouseDown(row, col)}
                  onDblclick={() => onDoubleClick(row, col)}
                  onMouseover={() => onMouseOver(row, col)}
                  onContextMenu={(e) => onContextMenu(e, row, col)}
                  colSpan={colSpan || 1}
                  rowSpan={rowSpan || 1}
                  style={{
                      ...style,
                      position: "relative"
                  }}
              >
                  <span
                      style={
                          { display: (editing && selected) ? "none" : "block" }
                      }>
                      {value}
                  </span>
                  <div style={{ display: (editing && selected) ? "block" : "none" }}>
                      <input
                          id='cellinput'
                          ref='input'
                          style={
                              {
                                  display: (editing && selected) ? "block" : "none"
                              }
                          }
                          onChange={(e) => {
                              this.onChange(e.target.value);
                          }}
                      />
                  </div>
              </td>
          );
      },

      mounted() {
          this._input = this.$refs.input;
      },

      updated() {
          if (this.props.editing === true) {
              this.$nextTick(() => {
                  this.$refs.input.focus();
              });
          }
      },

      beforeDestroy() {
          clearTimeout(this.timeout);
      }
  };

</script>
