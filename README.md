###自适应高度Textarea

组件根据内容会自适应高度

####何时使用

Textarea控件在初始化时内容可变，需要根据内容自动调整高度并全部显示。

####如何使用

    import React from 'react';
    import ReactDOM from 'react-dom';
    import AutoresizeTextarea from './autoresize_textarea.jsx';
    
    ReactDOM.render(<AutoresizeTextarea>填充内容...</AutoresizeTextarea>, document.querySelector('body'));
    
    
    
这里AutoresizeTextarea的路径根据项目具体路径而定。

####API

#### 属性

属性名称  | 类型 | 默认值 | 可选值
------------- | ------------- | --------| -------------
value  | string | Please enter your content. |  textarea内容
style  | object   | null| 常用style样式，如{width: 200, height: 200}
