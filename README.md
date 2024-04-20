# select-input-search-tk

## Introduction
SelectSearchData is a React component that allows you to create a search input with a customizable selection list.

## Installation
To use SelectSearchData, you can install it via npm or yarn:

```bash
npm install select-search-input-tk
```
or

```bash
yarn add select-search-input-tk
```

## Usage
### Import
```javascript
import SelectSearchData from 'select-search-input-tk';
import 'select-search-input-tk/lib/selectSearchData.css';
```

### Props
| Prop             | Type          | Description                                 |
|------------------|---------------|---------------------------------------------|
| data             | any[]         | The selection data list                     |
| title            | string        | The property of each data item              |
| value            | string        | The value of the property to determine the selected item |
| placeholder      | string        | Placeholder for the search input            |
| onSearch         | functionType  | Callback triggered when search is performed |
| style            | CSSProperties | CSS style for the component                 |
| defaultValue     | any[]         | Default value                               |
| onChange         | functionChangeType | Callback triggered when value is changed |

### Example
```javascript
<SelectSearchData
  data={data}
  title="name"
  value="id"
  placeholder="Search..."
  onSearch={(value, top, bottom) => console.log(value, top, bottom)}
  style={{ width: '300px' }}
  defaultValue={[]}
  onChange={(values) => console.log(values)}
/>
```

## Version
1.0.5

## Author
tk0038

## License
ISC
