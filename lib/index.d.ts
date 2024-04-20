import React, { CSSProperties } from 'react';
import './selectSearchData.css';
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
declare const SelectSearchData: React.FC<Props>;
export default SelectSearchData;
