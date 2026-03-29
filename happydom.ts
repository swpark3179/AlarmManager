import { GlobalWindow } from 'happy-dom';
const window = new GlobalWindow();
globalThis.window = window;
globalThis.document = window.document;
