import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import './selectSearchData.css'

type functionType = (value: any, top: boolean, bottom: boolean) => void;
type functionChangeType = (value: any[]) => void;

interface Props {
  data: any[];
  title: string;
  value: string;
  placeholder?: string;
  onSearch?: functionType;
  style?: CSSProperties | undefined;
  defaultValue?: any[];
  onChange?: functionChangeType;
}

const SelectSearchData: React.FC<Props> = (props) => {
  const { data, title, value, placeholder, onSearch, defaultValue, onChange } = props;

  const [searchValue, setSearchValue] = useState<string>('');

  const [toggleOption, setToggleOption] = useState<boolean>(false);

  const [selectedValues, setSelectedValues] = useState<any[]>(defaultValue ? defaultValue : []);

  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [isTop, setIsTop] = useState<boolean>(false);


  const selectRef = useRef<HTMLDivElement>(null);
  const optionsListRef = useRef<HTMLUListElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    //khi scroll thì call api mới để 
    const onScroll = () => {
      const container = optionsContainerRef.current;
      const list = optionsListRef.current;
      if (!container || !list) return;

      if (container.scrollTop == 0) {
        setIsTop(true);
      }

      if (container.scrollTop + container.clientHeight >= list.scrollHeight) {
        setIsBottom(true);
      }
    };

    const container = optionsContainerRef.current;
    const list = optionsListRef.current;

    if (!container || !list) return;

    console.log("container", container);

    container.removeEventListener('scroll', onScroll);
    container.addEventListener('scroll', onScroll, { passive: true });

    //click ra ngoài thì đóng option
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    if (isBottom) {
      setIsBottom(false);
      setIsTop(false);
      onSearch && onSearch(searchValue, false, true);
    } else if (isTop) {
      setIsBottom(false);
      setIsTop(false);
      onSearch && onSearch(searchValue, true, false);
    }
  }, [isBottom, isTop]);

  //khi có thay đổi giá trị setvalue và gửi về component cha
  useEffect(() => {
    onChange && onChange(selectedValues);
  }, [selectedValues])

  //khi search thay đổi thì gửi giá trị về component cha để tiến hành gọi api
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = event.target.value;
    setSearchValue(search);
    onSearch && onSearch(search, false, false);
  }

  //khi chọn option
  const handleOptionClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    const selected = event.currentTarget.getAttribute('data-select');
    if (event.currentTarget.classList.contains("active")) {
      event.currentTarget.classList.remove("active");
      setSelectedValues(selectedValues.filter(item => item[value] != selected));
    } else {
      event.currentTarget.classList.add("active");
      const selectedData = data.filter(item => item.id == selected);
      setSelectedValues(prevSelectedValues => [...prevSelectedValues, selectedData[0]]);
    }
  }

  const createOption = (data: any, text: any) => {
    const isSelected = selectedValues.some(item => item[value] == data);
    return (
      <li
        className={isSelected ? "active" : ""}
        onClick={handleOptionClick} key={data}
        data-select={data}>
        {text}
      </li>
    );
  }

  const handleRemoveSelected = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    const id = event.currentTarget.getAttribute('data-id');
    setSelectedValues(selectedValues.filter(item => item[value] != id));
  }

  const createOptionSelected = (text: any, key: any) => {
    return (
      <span key={key} className="chip">
        {text}
        <button style={{ border: "none", borderRadius: "50%" }} type='button' className="close-icon" data-id={key} onClick={handleRemoveSelected}>×</button>
      </span>
    );
  }

  return (
    <div ref={selectRef} className='custom-select'>
      <div
        style={props.style}
        className="chips select-input"
        onClick={() => setToggleOption(prevToggleOption => !prevToggleOption)}
      >
        {selectedValues.length > 0 ? selectedValues.map((option) => (
          createOptionSelected(option[title], option[value])
        )) : <span>{placeholder ? placeholder : 'Select option'}</span>}
      </div>
      {toggleOption && <input
        type="text"
        className='search-input form-control'
        placeholder="Search..."
        onChange={handleInputChange}
        value={searchValue}
      />}
      <div ref={optionsContainerRef} style={{ display: toggleOption ? "block" : "none" }} className='options-container'>
        <ul ref={optionsListRef} className='options-list'>
          {data.map((option) => (
            createOption(option[value], option[title])
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SelectSearchData;
