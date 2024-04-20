"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
require("./selectSearchData.css");
var SelectSearchData = function (props) {
    var data = props.data, title = props.title, value = props.value, placeholder = props.placeholder, onSearch = props.onSearch, defaultValue = props.defaultValue, onChange = props.onChange;
    var _a = (0, react_1.useState)(''), searchValue = _a[0], setSearchValue = _a[1];
    var _b = (0, react_1.useState)(false), toggleOption = _b[0], setToggleOption = _b[1];
    var _c = (0, react_1.useState)(defaultValue ? defaultValue : []), selectedValues = _c[0], setSelectedValues = _c[1];
    var _d = (0, react_1.useState)(false), isBottom = _d[0], setIsBottom = _d[1];
    var _e = (0, react_1.useState)(false), isTop = _e[0], setIsTop = _e[1];
    var selectRef = (0, react_1.useRef)(null);
    var optionsListRef = (0, react_1.useRef)(null);
    var optionsContainerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        //khi scroll thì call api mới để 
        var onScroll = function () {
            var container = optionsContainerRef.current;
            var list = optionsListRef.current;
            if (!container || !list)
                return;
            if (container.scrollTop == 0) {
                setIsTop(true);
            }
            if (container.scrollTop + container.clientHeight >= list.scrollHeight) {
                setIsBottom(true);
            }
        };
        var container = optionsContainerRef.current;
        var list = optionsListRef.current;
        if (!container || !list)
            return;
        console.log("container", container);
        container.removeEventListener('scroll', onScroll);
        container.addEventListener('scroll', onScroll, { passive: true });
        //click ra ngoài thì đóng option
        var handleClickOutside = function (event) {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setToggleOption(false);
            }
        };
        //gán sự khiện khi click ngoài
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
            container.removeEventListener('scroll', onScroll);
        };
    }, []);
    (0, react_1.useEffect)(function () {
        if (isBottom) {
            setIsBottom(false);
            setIsTop(false);
            onSearch && onSearch(searchValue, false, true);
        }
        else if (isTop) {
            setIsBottom(false);
            setIsTop(false);
            onSearch && onSearch(searchValue, true, false);
        }
    }, [isBottom, isTop]);
    //khi có thay đổi giá trị setvalue và gửi về component cha
    (0, react_1.useEffect)(function () {
        onChange && onChange(selectedValues);
    }, [selectedValues]);
    //khi search thay đổi thì gửi giá trị về component cha để tiến hành gọi api
    var handleInputChange = function (event) {
        var search = event.target.value;
        setSearchValue(search);
        onSearch && onSearch(search, false, false);
    };
    //khi chọn option
    var handleOptionClick = function (event) {
        var selected = event.currentTarget.getAttribute('data-select');
        if (event.currentTarget.classList.contains("active")) {
            event.currentTarget.classList.remove("active");
            setSelectedValues(selectedValues.filter(function (item) { return item[value] != selected; }));
        }
        else {
            event.currentTarget.classList.add("active");
            var selectedData_1 = data.filter(function (item) { return item.id == selected; });
            setSelectedValues(function (prevSelectedValues) { return __spreadArray(__spreadArray([], prevSelectedValues, true), [selectedData_1[0]], false); });
        }
    };
    var createOption = function (data, text) {
        var isSelected = selectedValues.some(function (item) { return item[value] == data; });
        return ((0, jsx_runtime_1.jsx)("li", { className: isSelected ? "active" : "", onClick: handleOptionClick, "data-select": data, children: text }, data));
    };
    var handleRemoveSelected = function (event) {
        event.stopPropagation();
        var id = event.currentTarget.getAttribute('data-id');
        setSelectedValues(selectedValues.filter(function (item) { return item[value] != id; }));
    };
    var createOptionSelected = function (text, key) {
        return ((0, jsx_runtime_1.jsxs)("span", { className: "chip", children: [text, (0, jsx_runtime_1.jsx)("button", { style: { border: "none", borderRadius: "50%" }, type: 'button', className: "close-icon", "data-id": key, onClick: handleRemoveSelected, children: "\u00D7" })] }, key));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { ref: selectRef, className: 'custom-select', children: [(0, jsx_runtime_1.jsx)("div", { style: props.style, className: "chips select-input", onClick: function () { return setToggleOption(function (prevToggleOption) { return !prevToggleOption; }); }, children: selectedValues.length > 0 ? selectedValues.map(function (option) { return (createOptionSelected(option[title], option[value])); }) : (0, jsx_runtime_1.jsx)("span", { children: placeholder ? placeholder : 'Select option' }) }), toggleOption && (0, jsx_runtime_1.jsx)("input", { type: "text", className: 'search-input form-control', placeholder: "Search...", onChange: handleInputChange, value: searchValue }), (0, jsx_runtime_1.jsx)("div", { ref: optionsContainerRef, style: { display: toggleOption ? "block" : "none" }, className: 'options-container', children: (0, jsx_runtime_1.jsx)("ul", { ref: optionsListRef, className: 'options-list', children: data.map(function (option) { return (createOption(option[value], option[title])); }) }) })] }));
};
exports.default = SelectSearchData;
