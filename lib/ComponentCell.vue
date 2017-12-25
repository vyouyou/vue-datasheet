<script>
    export default{
        props: {
            row: [Number],
            col: [Number],
            colSpan: [Number],
            rowSpan: [Number],
            width: [String],
            overflow: [String],
            className: [Object],
            selected: [Boolean],
            editing: [Boolean],
            onMouseDown: [Function],
            onDoubleClick: [Function],
            onMouseOver: [Function],
            onContextMenu: [Function],
            forceComponent: [Boolean],
            attributes: [Object],
            props: [Object]
        },

        data() {
            return {
                updated: false
            };
        },

        components: {
        },

        watch: {
            props: {
                deep: true,
                handler(newVal, oldVal) {
                    if (newVal.value !== this.props.value) {
                        this.updated = true;
                        this.timeout = setTimeout(() => { this.updated = false; }, 700);
                    }
                }
            }
        },

        methods: {
        },

        render(h) {
            const {
                row, col, readOnly, forceComponent, rowSpan, colSpan, width, overflow, value, className, editing, selected, style,
                onMouseDown, onMouseOver, onDoubleClick, onContextMenu, attributes
            } = this.props;

            //            className={[
            //                    className, "cell", overflow,
            //                    editing && "editing", selected && "selected",
            //            this.state.updated && "updated"
            //        ].filter(a => a).join(" ")}
            return (
                <td
                    class={{
                        ...className,
                        overflow: true,
                        cell: true,
                        editing: this.editing,
                        selected: this.selected,
                        updated: this.updated
                    }}
                    onMouseDown={() => onMouseDown(row, col)}
                    onDoubleClick={() => onDoubleClick(row, col)}
                    onMouseOver={() => onMouseOver(row, col)}
                    onContextMenu={(e) => onContextMenu(e, row, col)} colSpan={colSpan || 1}
                    rowSpan={rowSpan || 1}
                    style={style}
                    { ...attributes }
                >
                    { ((editing && !readOnly) || forceComponent) ? this.props.component(h, value) : value }
                </td>
            );
        },

        beforeDestroy() {
            clearTimeout(this.timeout);
        }
    };
</script>
