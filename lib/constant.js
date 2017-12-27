/**
 * Created by vyouyou on 17-12-11.
 */
export const TAB_KEY = 9;
export const ENTER_KEY = 13;
export const ESCAPE_KEY = 27;
export const LEFT_KEY = 37;
export const UP_KEY = 38;
export const RIGHT_KEY = 39;
export const DOWN_KEY = 40;
export const DELETE_KEY = 46;
export const BACKSPACE_KEY = 8;
export const isEmpty = (obj) => Object.keys(obj).length === 0;
export const range = (start, end) => {
    const array = [];
    const inc = (end - start > 0);
    for (let i = start; inc ? (i <= end) : (i >= end); inc ? i++ : i--) {
        inc ? array.push(i) : array.unshift(i);
    }
    return array;
};

export const nullFtn = (obj) => {};

export const defaultParsePaste = (str) => {
    return str.split(/\r\n|\n|\r/)
        .map((row) => row.split("\t"));
};

