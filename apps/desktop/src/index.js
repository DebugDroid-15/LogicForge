import { jsx as _jsx } from "react/jsx-runtime";
import { createRoot } from 'react-dom/client';
import { MainApp } from './components/MainApp.js';
const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(_jsx(MainApp, {}));
}
//# sourceMappingURL=index.js.map