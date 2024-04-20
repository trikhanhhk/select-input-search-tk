"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
require("./selectSearchData.css");
const SelectSearchData = (props) => {
    const { data, title, value, placeholder, onSearch, defaultValue, onChange } = props;
    const [searchValue, setSearchValue] = (0, react_1.useState)('');
    const [toggleOption, setToggleOption] = (0, react_1.useState)(false);
    const [selectedValues, setSelectedValues] = (0, react_1.useState)(defaultValue ? defaultValue : []);
    const [isBottom, setIsBottom] = (0, react_1.useState)(false);
    const [isTop, setIsTop] = (0, react_1.useState)(false);
    const selectRef = (0, react_1.useRef)(null);
    const optionsListRef = (0, react_1.useRef)(null);
    const optionsContainerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        //khi scroll thì call api mới để 
        const onScroll = () => {
            const container = optionsContainerRef.current;
            const list = optionsListRef.current;
            if (!container || !list)
                return;
            if (container.scrollTop == 0) {
                setIsTop(true);
            }
            if (container.scrollTop + container.clientHeight >= list.scrollHeight) {
                setIsBottom(true);
            }
        };
        const container = optionsContainerRef.current;
        const list = optionsListRef.current;
        if (!container || !list)
            return;
        console.log("container", container);
        container.removeEventListener('scroll', onScroll);
        container.addEventListener('scroll', onScroll, { passive: true });
        //click ra ngoài thì đóng option
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setToggleOption(false);
            }
        };
        //gán sự khiện khi click ngoài
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            container.removeEventListener('scroll', onScroll);
        };
    }, []);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        onChange && onChange(selectedValues);
    }, [selectedValues]);
    //khi search thay đổi thì gửi giá trị về component cha để tiến hành gọi api
    const handleInputChange = (event) => __awaiter(void 0, void 0, void 0, function* () {
        const search = event.target.value;
        setSearchValue(search);
        onSearch && onSearch(search, false, false);
    });
    //khi chọn option
    const handleOptionClick = (event) => {
        const selected = event.currentTarget.getAttribute('data-select');
        if (event.currentTarget.classList.contains("active")) {
            event.currentTarget.classList.remove("active");
            setSelectedValues(selectedValues.filter(item => item[value] != selected));
        }
        else {
            event.currentTarget.classList.add("active");
            const selectedData = data.filter(item => item.id == selected);
            setSelectedValues(prevSelectedValues => [...prevSelectedValues, selectedData[0]]);
        }
    };
    const createOption = (data, text) => {
        const isSelected = selectedValues.some(item => item[value] == data);
        return (<li className={isSelected ? "active" : ""} onClick={handleOptionClick} key={data} data-select={data}>
        {text}
      </li>);
    };
    const handleRemoveSelected = (event) => {
        event.stopPropagation();
        const id = event.currentTarget.getAttribute('data-id');
        setSelectedValues(selectedValues.filter(item => item[value] != id));
    };
    const createOptionSelected = (text, key) => {
        return (<span key={key} className="chip">
        {text}
        <button style={{ border: "none", borderRadius: "50%" }} type='button' className="close-icon" data-id={key} onClick={handleRemoveSelected}>×</button>
      </span>);
    };
    return (<div ref={selectRef} className='custom-select'>
      <div style={props.style} className="chips select-input" onClick={() => setToggleOption(prevToggleOption => !prevToggleOption)}>
        {selectedValues.length > 0 ? selectedValues.map((option) => (createOptionSelected(option[title], option[value]))) : <span>{placeholder ? placeholder : 'Select option'}</span>}
      </div>
      {toggleOption && <input type="text" className='search-input form-control' placeholder="Search..." onChange={handleInputChange} value={searchValue}/>}
      <div ref={optionsContainerRef} style={{ display: toggleOption ? "block" : "none" }} className='options-container'>
        <ul ref={optionsListRef} className='options-list'>
          {data.map((option) => (createOption(option[value], option[title])))}
        </ul>
      </div>
    </div>);
};
exports.default = SelectSearchData;
