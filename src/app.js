'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import AutoresizeTextarea from './autoresize_textarea.jsx';

let content = `The coconut palm (also, cocoanut), Cocos nucifera, is a member of the family Arecaceae (palm family). It is the only accepted species in the genus Cocos.[2] The term coconut can refer to the entire coconut palm, the seed, or the fruit, which, botanically, is a drupe, not a nut. The spelling cocoanut is an archaic form of the word.[3] The term is derived from 16th-century Portuguese and Spanish coco, meaning "head" or "skull",[4] from the three small holes on the coconut shell that resemble human facial features.`;


ReactDOM.render(<AutoresizeTextarea style={{width: 300}} value={content}></AutoresizeTextarea>,  document.getElementById('container'));