"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vm_1 = __importDefault(require("vm"));
var fs_1 = __importDefault(require("fs"));
var react_1 = __importDefault(require("react"));
var server_1 = __importDefault(require("react-dom/server"));
var jsdom_1 = require("jsdom");
var path_1 = require("path");
var core_1 = __importDefault(require("@babel/core"));
var preset_react_1 = __importDefault(require("@babel/preset-react"));
var rollup_1 = require("rollup");
var plugin_babel_1 = __importDefault(require("@rollup/plugin-babel"));
var plugin_node_resolve_1 = __importDefault(require("@rollup/plugin-node-resolve"));
var ink_1 = require("ink");
var rootId = 'rolledup-root';
var newDom = function () {
    var dom = new jsdom_1.JSDOM(undefined, {
        url: 'http://localhost',
    });
    var root = dom.window.document.createElement('div');
    root.id = rootId;
    dom.window.document.body.appendChild(root);
    return dom;
};
var newCtx = function (window) { return function (code) { return vm_1.default.runInNewContext(code, __assign(__assign({}, window), { window: window, globalThis: window, ReactDOMServer: server_1.default,
    React: react_1.default }), {
    filename: 'vssr-generated.js',
}); }; };
var exampleDir = path_1.join(__dirname, 'examples');
var demo = function () {
    var demoStr = fs_1.default.readFileSync(path_1.join(exampleDir, 'demo.js')).toString();
    var dom = newDom();
    var ctx = newCtx(dom.window)(demoStr);
    dom.window.document.getElementById(rootId).innerHTML = ctx;
    fs_1.default.writeFileSync(path_1.join(exampleDir, 'demo.html'), dom.serialize());
};
var jsxDemo = function () {
    var code = core_1.default.transformSync(fs_1.default.readFileSync(path_1.join(exampleDir, 'jsxdemo.jsx')).toString(), {
        presets: [
            preset_react_1.default
        ]
    }).code;
    var dom = newDom();
    var ctx = newCtx(dom.window)(code);
    dom.window.document.getElementById(rootId).innerHTML = ctx;
    fs_1.default.writeFileSync(path_1.join(exampleDir, 'jsxdemo.html'), dom.serialize());
};
var rollupDemo = function () { return __awaiter(void 0, void 0, void 0, function () {
    var proj, outputFilePath, build, code, dom, ctx;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                proj = path_1.join(exampleDir, 'proj');
                outputFilePath = path_1.join(proj, 'dist', 'index.html');
                return [4 /*yield*/, rollup_1.rollup({
                        input: path_1.join(proj, 'index.js'),
                        plugins: [
                            plugin_node_resolve_1.default({
                                extensions: ['jsx', 'js'],
                            }),
                            plugin_babel_1.default({
                                babelHelpers: 'bundled',
                                cwd: proj,
                                extensions: ['jsx', 'js'],
                            }),
                        ]
                    })];
            case 1:
                build = _a.sent();
                return [4 /*yield*/, build.generate({
                        dir: path_1.join(proj, 'dist'),
                        format: 'cjs',
                    })];
            case 2:
                code = (_a.sent()).output[0].code;
                dom = newDom();
                ctx = newCtx(dom.window)(code);
                dom.window.document.getElementById(rootId).innerHTML = ctx;
                fs_1.default.writeFileSync(outputFilePath, dom.serialize());
                return [2 /*return*/];
        }
    });
}); };
var Cli = function () {
    return (react_1.default.createElement(ink_1.Box, { borderStyle: "round", borderColor: "magentaBright" },
        react_1.default.createElement(ink_1.Text, null, "Hello World")));
};
ink_1.render(react_1.default.createElement(Cli, null));
