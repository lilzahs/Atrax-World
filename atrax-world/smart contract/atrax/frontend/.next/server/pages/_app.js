/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/providers/WalletProviders.jsx":
/*!**************************************************!*\
  !*** ./components/providers/WalletProviders.jsx ***!
  \**************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ WalletProviders)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/wallet-adapter-react */ \"@solana/wallet-adapter-react\");\n/* harmony import */ var _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/wallet-adapter-react-ui */ \"@solana/wallet-adapter-react-ui\");\n/* harmony import */ var _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @solana/wallet-adapter-wallets */ \"@solana/wallet-adapter-wallets\");\n/* harmony import */ var _lib_config__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../lib/config */ \"./lib/config.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__]);\n([_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__, _solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__, _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nfunction WalletProviders({ children }) {\n    const endpoint = _lib_config__WEBPACK_IMPORTED_MODULE_5__.RPC_ENDPOINT;\n    const wallets = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>[\n            new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__.PhantomWalletAdapter(),\n            new _solana_wallet_adapter_wallets__WEBPACK_IMPORTED_MODULE_4__.SolflareWalletAdapter({\n                network: _lib_config__WEBPACK_IMPORTED_MODULE_5__.NETWORK\n            })\n        ], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.ConnectionProvider, {\n        endpoint: endpoint,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react__WEBPACK_IMPORTED_MODULE_2__.WalletProvider, {\n            wallets: wallets,\n            autoConnect: true,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_solana_wallet_adapter_react_ui__WEBPACK_IMPORTED_MODULE_3__.WalletModalProvider, {\n                children: children\n            }, void 0, false, {\n                fileName: \"/Users/doandothanhdanh/Desktop/zah project/Atrax-World/atrax-world/smart contract/atrax/frontend/components/providers/WalletProviders.jsx\",\n                lineNumber: 17,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/Users/doandothanhdanh/Desktop/zah project/Atrax-World/atrax-world/smart contract/atrax/frontend/components/providers/WalletProviders.jsx\",\n            lineNumber: 16,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/doandothanhdanh/Desktop/zah project/Atrax-World/atrax-world/smart contract/atrax/frontend/components/providers/WalletProviders.jsx\",\n        lineNumber: 15,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL3Byb3ZpZGVycy9XYWxsZXRQcm92aWRlcnMuanN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBdUM7QUFDMkM7QUFDWjtBQUN1QjtBQUNwQztBQUUxQyxTQUFTUyxnQkFBZ0IsRUFBRUMsUUFBUSxFQUFFO0lBQ2xELE1BQU1DLFdBQVdKLHFEQUFZQTtJQUM3QixNQUFNSyxVQUFVWCw4Q0FBT0EsQ0FDckIsSUFBTTtZQUFDLElBQUlJLGdGQUFvQkE7WUFBSSxJQUFJQyxpRkFBcUJBLENBQUM7Z0JBQUVPLFNBQVNMLGdEQUFPQTtZQUFDO1NBQUcsRUFDbkYsRUFBRTtJQUdKLHFCQUNFLDhEQUFDTiw0RUFBa0JBO1FBQUNTLFVBQVVBO2tCQUM1Qiw0RUFBQ1Isd0VBQWNBO1lBQUNTLFNBQVNBO1lBQVNFLFdBQVc7c0JBQzNDLDRFQUFDVixnRkFBbUJBOzBCQUFFTTs7Ozs7Ozs7Ozs7Ozs7OztBQUk5QiIsInNvdXJjZXMiOlsid2VicGFjazovL2F0cmF4LXN0cmVhbWluZy8uL2NvbXBvbmVudHMvcHJvdmlkZXJzL1dhbGxldFByb3ZpZGVycy5qc3g/ZGRjNSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IENvbm5lY3Rpb25Qcm92aWRlciwgV2FsbGV0UHJvdmlkZXIgfSBmcm9tICdAc29sYW5hL3dhbGxldC1hZGFwdGVyLXJlYWN0JztcbmltcG9ydCB7IFdhbGxldE1vZGFsUHJvdmlkZXIgfSBmcm9tICdAc29sYW5hL3dhbGxldC1hZGFwdGVyLXJlYWN0LXVpJztcbmltcG9ydCB7IFBoYW50b21XYWxsZXRBZGFwdGVyLCBTb2xmbGFyZVdhbGxldEFkYXB0ZXIgfSBmcm9tICdAc29sYW5hL3dhbGxldC1hZGFwdGVyLXdhbGxldHMnO1xuaW1wb3J0IHsgUlBDX0VORFBPSU5ULCBORVRXT1JLIH0gZnJvbSAnLi4vLi4vbGliL2NvbmZpZyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdhbGxldFByb3ZpZGVycyh7IGNoaWxkcmVuIH0pIHtcbiAgY29uc3QgZW5kcG9pbnQgPSBSUENfRU5EUE9JTlQ7XG4gIGNvbnN0IHdhbGxldHMgPSB1c2VNZW1vKFxuICAgICgpID0+IFtuZXcgUGhhbnRvbVdhbGxldEFkYXB0ZXIoKSwgbmV3IFNvbGZsYXJlV2FsbGV0QWRhcHRlcih7IG5ldHdvcms6IE5FVFdPUksgfSldLFxuICAgIFtdXG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q29ubmVjdGlvblByb3ZpZGVyIGVuZHBvaW50PXtlbmRwb2ludH0+XG4gICAgICA8V2FsbGV0UHJvdmlkZXIgd2FsbGV0cz17d2FsbGV0c30gYXV0b0Nvbm5lY3Q+XG4gICAgICAgIDxXYWxsZXRNb2RhbFByb3ZpZGVyPntjaGlsZHJlbn08L1dhbGxldE1vZGFsUHJvdmlkZXI+XG4gICAgICA8L1dhbGxldFByb3ZpZGVyPlxuICAgIDwvQ29ubmVjdGlvblByb3ZpZGVyPlxuICApO1xufVxuXG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VNZW1vIiwiQ29ubmVjdGlvblByb3ZpZGVyIiwiV2FsbGV0UHJvdmlkZXIiLCJXYWxsZXRNb2RhbFByb3ZpZGVyIiwiUGhhbnRvbVdhbGxldEFkYXB0ZXIiLCJTb2xmbGFyZVdhbGxldEFkYXB0ZXIiLCJSUENfRU5EUE9JTlQiLCJORVRXT1JLIiwiV2FsbGV0UHJvdmlkZXJzIiwiY2hpbGRyZW4iLCJlbmRwb2ludCIsIndhbGxldHMiLCJuZXR3b3JrIiwiYXV0b0Nvbm5lY3QiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/providers/WalletProviders.jsx\n");

/***/ }),

/***/ "./lib/config.js":
/*!***********************!*\
  !*** ./lib/config.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   ATRAX_CONFIG_PDA: () => (/* binding */ ATRAX_CONFIG_PDA),\n/* harmony export */   ATRAX_PROGRAM_ID: () => (/* binding */ ATRAX_PROGRAM_ID),\n/* harmony export */   DEV_WALLET: () => (/* binding */ DEV_WALLET),\n/* harmony export */   NETWORK: () => (/* binding */ NETWORK),\n/* harmony export */   RPC_ENDPOINT: () => (/* binding */ RPC_ENDPOINT)\n/* harmony export */ });\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ \"@solana/web3.js\");\n/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_solana_web3_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _idl_atrax_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../idl/atrax.json */ \"./idl/atrax.json\");\n\n\nconst NETWORK = process.env.NEXT_PUBLIC_NETWORK || \"devnet\";\nconst RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || (0,_solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.clusterApiUrl)(NETWORK);\nconst ATRAX_PROGRAM_ID = process.env.NEXT_PUBLIC_ATRAX_PROGRAM_ID || _idl_atrax_json__WEBPACK_IMPORTED_MODULE_1__ && _idl_atrax_json__WEBPACK_IMPORTED_MODULE_1__.address || \"\";\n// Compute Config PDA from program id if not provided\nfunction computeConfigPda(programIdStr) {\n    try {\n        const programId = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(programIdStr);\n        const seed = typeof TextEncoder !== \"undefined\" ? new TextEncoder().encode(\"config\") : Buffer.from(\"config\");\n        const [pda] = _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey.findProgramAddressSync([\n            seed\n        ], programId);\n        return pda.toBase58();\n    } catch (_) {\n        return \"\";\n    }\n}\nconst ATRAX_CONFIG_PDA = process.env.NEXT_PUBLIC_ATRAX_CONFIG_PDA || computeConfigPda(ATRAX_PROGRAM_ID);\nconst DEV_WALLET = process.env.NEXT_PUBLIC_DEV_WALLET || \"\";\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvY29uZmlnLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQTJEO0FBQ3ZCO0FBRTdCLE1BQU1HLFVBQVVDLFFBQVFDLEdBQUcsQ0FBQ0MsbUJBQW1CLElBQUksU0FBUztBQUM1RCxNQUFNQyxlQUFlSCxRQUFRQyxHQUFHLENBQUNHLHdCQUF3QixJQUFJUiw4REFBYUEsQ0FBQ0csU0FBUztBQUVwRixNQUFNTSxtQkFBbUJMLFFBQVFDLEdBQUcsQ0FBQ0ssNEJBQTRCLElBQUtSLDRDQUFHQSxJQUFJQSxvREFBVyxJQUFLLEdBQUc7QUFFdkcscURBQXFEO0FBQ3JELFNBQVNVLGlCQUFpQkMsWUFBWTtJQUNwQyxJQUFJO1FBQ0YsTUFBTUMsWUFBWSxJQUFJYixzREFBU0EsQ0FBQ1k7UUFDaEMsTUFBTUUsT0FBTyxPQUFPQyxnQkFBZ0IsY0FBYyxJQUFJQSxjQUFjQyxNQUFNLENBQUMsWUFBWUMsT0FBT0MsSUFBSSxDQUFDO1FBQ25HLE1BQU0sQ0FBQ0MsSUFBSSxHQUFHbkIsc0RBQVNBLENBQUNvQixzQkFBc0IsQ0FBQztZQUFDTjtTQUFLLEVBQUVEO1FBQ3ZELE9BQU9NLElBQUlFLFFBQVE7SUFDckIsRUFBRSxPQUFPQyxHQUFHO1FBQ1YsT0FBTztJQUNUO0FBQ0Y7QUFFTyxNQUFNQyxtQkFBbUJwQixRQUFRQyxHQUFHLENBQUNvQiw0QkFBNEIsSUFBSWIsaUJBQWlCSCxrQkFBa0I7QUFDeEcsTUFBTWlCLGFBQWF0QixRQUFRQyxHQUFHLENBQUNzQixzQkFBc0IsSUFBSSxHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXRyYXgtc3RyZWFtaW5nLy4vbGliL2NvbmZpZy5qcz8wNmM1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNsdXN0ZXJBcGlVcmwsIFB1YmxpY0tleSB9IGZyb20gJ0Bzb2xhbmEvd2ViMy5qcyc7XG5pbXBvcnQgaWRsIGZyb20gJy4uL2lkbC9hdHJheC5qc29uJztcblxuZXhwb3J0IGNvbnN0IE5FVFdPUksgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19ORVRXT1JLIHx8ICdkZXZuZXQnO1xuZXhwb3J0IGNvbnN0IFJQQ19FTkRQT0lOVCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1JQQ19FTkRQT0lOVCB8fCBjbHVzdGVyQXBpVXJsKE5FVFdPUkspO1xuXG5leHBvcnQgY29uc3QgQVRSQVhfUFJPR1JBTV9JRCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0FUUkFYX1BST0dSQU1fSUQgfHwgKGlkbCAmJiBpZGwuYWRkcmVzcykgfHwgJyc7XG5cbi8vIENvbXB1dGUgQ29uZmlnIFBEQSBmcm9tIHByb2dyYW0gaWQgaWYgbm90IHByb3ZpZGVkXG5mdW5jdGlvbiBjb21wdXRlQ29uZmlnUGRhKHByb2dyYW1JZFN0cikge1xuICB0cnkge1xuICAgIGNvbnN0IHByb2dyYW1JZCA9IG5ldyBQdWJsaWNLZXkocHJvZ3JhbUlkU3RyKTtcbiAgICBjb25zdCBzZWVkID0gdHlwZW9mIFRleHRFbmNvZGVyICE9PSAndW5kZWZpbmVkJyA/IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZSgnY29uZmlnJykgOiBCdWZmZXIuZnJvbSgnY29uZmlnJyk7XG4gICAgY29uc3QgW3BkYV0gPSBQdWJsaWNLZXkuZmluZFByb2dyYW1BZGRyZXNzU3luYyhbc2VlZF0sIHByb2dyYW1JZCk7XG4gICAgcmV0dXJuIHBkYS50b0Jhc2U1OCgpO1xuICB9IGNhdGNoIChfKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBBVFJBWF9DT05GSUdfUERBID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfQVRSQVhfQ09ORklHX1BEQSB8fCBjb21wdXRlQ29uZmlnUGRhKEFUUkFYX1BST0dSQU1fSUQpO1xuZXhwb3J0IGNvbnN0IERFVl9XQUxMRVQgPSBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19ERVZfV0FMTEVUIHx8ICcnO1xuIl0sIm5hbWVzIjpbImNsdXN0ZXJBcGlVcmwiLCJQdWJsaWNLZXkiLCJpZGwiLCJORVRXT1JLIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX05FVFdPUksiLCJSUENfRU5EUE9JTlQiLCJORVhUX1BVQkxJQ19SUENfRU5EUE9JTlQiLCJBVFJBWF9QUk9HUkFNX0lEIiwiTkVYVF9QVUJMSUNfQVRSQVhfUFJPR1JBTV9JRCIsImFkZHJlc3MiLCJjb21wdXRlQ29uZmlnUGRhIiwicHJvZ3JhbUlkU3RyIiwicHJvZ3JhbUlkIiwic2VlZCIsIlRleHRFbmNvZGVyIiwiZW5jb2RlIiwiQnVmZmVyIiwiZnJvbSIsInBkYSIsImZpbmRQcm9ncmFtQWRkcmVzc1N5bmMiLCJ0b0Jhc2U1OCIsIl8iLCJBVFJBWF9DT05GSUdfUERBIiwiTkVYVF9QVUJMSUNfQVRSQVhfQ09ORklHX1BEQSIsIkRFVl9XQUxMRVQiLCJORVhUX1BVQkxJQ19ERVZfV0FMTEVUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./lib/config.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/global.css */ \"./styles/global.css\");\n/* harmony import */ var _styles_global_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_global_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _solana_wallet_adapter_react_ui_styles_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/wallet-adapter-react-ui/styles.css */ \"./node_modules/@solana/wallet-adapter-react-ui/styles.css\");\n/* harmony import */ var _solana_wallet_adapter_react_ui_styles_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_solana_wallet_adapter_react_ui_styles_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_providers_WalletProviders__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/providers/WalletProviders */ \"./components/providers/WalletProviders.jsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_providers_WalletProviders__WEBPACK_IMPORTED_MODULE_3__]);\n_components_providers_WalletProviders__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_providers_WalletProviders__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/doandothanhdanh/Desktop/zah project/Atrax-World/atrax-world/smart contract/atrax/frontend/pages/_app.js\",\n            lineNumber: 8,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/doandothanhdanh/Desktop/zah project/Atrax-World/atrax-world/smart contract/atrax/frontend/pages/_app.js\",\n        lineNumber: 7,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUE4QjtBQUNzQjtBQUNrQjtBQUV2RCxTQUFTQyxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ3BELHFCQUNFLDhEQUFDSCw2RUFBZUE7a0JBQ2QsNEVBQUNFO1lBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7QUFHOUIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdHJheC1zdHJlYW1pbmcvLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuLi9zdHlsZXMvZ2xvYmFsLmNzcyc7XG5pbXBvcnQgJ0Bzb2xhbmEvd2FsbGV0LWFkYXB0ZXItcmVhY3QtdWkvc3R5bGVzLmNzcyc7XG5pbXBvcnQgV2FsbGV0UHJvdmlkZXJzIGZyb20gJy4uL2NvbXBvbmVudHMvcHJvdmlkZXJzL1dhbGxldFByb3ZpZGVycyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICByZXR1cm4gKFxuICAgIDxXYWxsZXRQcm92aWRlcnM+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9XYWxsZXRQcm92aWRlcnM+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiV2FsbGV0UHJvdmlkZXJzIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/global.css":
/*!***************************!*\
  !*** ./styles/global.css ***!
  \***************************/
/***/ (() => {



/***/ }),

/***/ "@solana/web3.js":
/*!**********************************!*\
  !*** external "@solana/web3.js" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@solana/web3.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "@solana/wallet-adapter-react":
/*!***********************************************!*\
  !*** external "@solana/wallet-adapter-react" ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react");;

/***/ }),

/***/ "@solana/wallet-adapter-react-ui":
/*!**************************************************!*\
  !*** external "@solana/wallet-adapter-react-ui" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-react-ui");;

/***/ }),

/***/ "@solana/wallet-adapter-wallets":
/*!*************************************************!*\
  !*** external "@solana/wallet-adapter-wallets" ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@solana/wallet-adapter-wallets");;

/***/ }),

/***/ "./idl/atrax.json":
/*!************************!*\
  !*** ./idl/atrax.json ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = /*#__PURE__*/JSON.parse('{"address":"35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC","metadata":{"name":"atrax","version":"0.1.0","spec":"0.1.0","description":"Created with Anchor"},"instructions":[{"name":"buy_item","discriminator":[80,82,193,201,216,27,70,184],"accounts":[{"name":"payer","writable":true,"signer":true},{"name":"dev_wallet","writable":true},{"name":"config"},{"name":"system_program","address":"11111111111111111111111111111111"}],"args":[{"name":"_item_id","type":"u16"},{"name":"amount","type":"u64"}]},{"name":"claim_profit","discriminator":[234,73,53,22,182,46,83,104],"accounts":[{"name":"claimer","writable":true,"signer":true}],"args":[{"name":"_amount","type":"u64"}]},{"name":"donate","discriminator":[121,186,218,211,73,70,196,180],"accounts":[{"name":"donor","writable":true,"signer":true},{"name":"streamer","writable":true},{"name":"dev_wallet","writable":true},{"name":"config"},{"name":"system_program","address":"11111111111111111111111111111111"}],"args":[{"name":"amount","type":"u64"}]},{"name":"initialize","discriminator":[29,178,185,164,148,247,216,78],"accounts":[{"name":"config","writable":true,"pda":{"seeds":[{"kind":"const","value":[99,111,110,102,105,103]}]}},{"name":"admin","signer":true},{"name":"system_program","address":"11111111111111111111111111111111"}],"args":[{"name":"dev_wallet","type":"pubkey"},{"name":"fee_bps","type":"u16"}]},{"name":"initialize_land","discriminator":[123,121,93,112,147,208,99,216],"accounts":[{"name":"owner","writable":true,"signer":true},{"name":"land","writable":true,"pda":{"seeds":[{"kind":"const","value":[108,97,110,100]},{"kind":"account","path":"owner"}]}},{"name":"system_program","address":"11111111111111111111111111111111"}],"args":[{"name":"land_id","type":"u64"}]},{"name":"trade_item","discriminator":[43,1,67,54,163,119,21,100],"accounts":[{"name":"buyer","writable":true,"signer":true},{"name":"seller","writable":true},{"name":"dev_wallet","writable":true},{"name":"config"},{"name":"system_program","address":"11111111111111111111111111111111"}],"args":[{"name":"_item_id","type":"u16"},{"name":"amount","type":"u64"}]},{"name":"transfer_land","discriminator":[83,16,230,202,65,32,41,73],"accounts":[{"name":"owner","writable":true,"signer":true},{"name":"land","writable":true,"pda":{"seeds":[{"kind":"const","value":[108,97,110,100]},{"kind":"account","path":"owner"}]}}],"args":[{"name":"land_id","type":"u64"},{"name":"new_owner","type":"pubkey"}]},{"name":"update_admin","discriminator":[161,176,40,213,60,184,179,228],"accounts":[{"name":"config","writable":true,"pda":{"seeds":[{"kind":"const","value":[99,111,110,102,105,103]}]}},{"name":"admin","signer":true,"relations":["config"]}],"args":[{"name":"new_admin","type":"pubkey"}]},{"name":"update_config","discriminator":[29,158,252,191,10,83,219,99],"accounts":[{"name":"config","writable":true,"pda":{"seeds":[{"kind":"const","value":[99,111,110,102,105,103]}]}},{"name":"admin","signer":true,"relations":["config"]}],"args":[{"name":"new_dev_wallet","type":"pubkey"},{"name":"new_fee_bps","type":"u16"}]}],"accounts":[{"name":"Config","discriminator":[155,12,170,224,30,250,204,130]},{"name":"LandAccount","discriminator":[22,117,128,89,2,71,202,215]}],"events":[{"name":"AdminUpdated","discriminator":[69,82,49,171,43,3,80,161]},{"name":"ConfigInitialized","discriminator":[181,49,200,156,19,167,178,91]},{"name":"ConfigUpdated","discriminator":[40,241,230,122,11,19,198,194]},{"name":"DonationEvent","discriminator":[43,125,2,48,193,140,25,191]},{"name":"LandTransferEvent","discriminator":[25,233,161,130,24,3,59,189]},{"name":"ShopPurchaseEvent","discriminator":[33,165,50,113,86,211,70,130]},{"name":"TradeEvent","discriminator":[189,219,127,211,78,230,97,238]}],"errors":[{"code":6000,"name":"InvalidAmount","msg":"Amount must be greater than zero"},{"code":6001,"name":"FeeTooHigh","msg":"Fee exceeds 100% (10000 bps)"},{"code":6002,"name":"InvalidDevWallet","msg":"Invalid developer wallet provided"},{"code":6003,"name":"Unauthorized","msg":"Unauthorized action"},{"code":6004,"name":"MathOverflow","msg":"Math overflow"},{"code":6005,"name":"LandNotInitialized","msg":"Land account is not initialized"},{"code":6006,"name":"InvalidLandId","msg":"Provided land id does not match record"}],"types":[{"name":"AdminUpdated","type":{"kind":"struct","fields":[{"name":"new_admin","type":"pubkey"}]}},{"name":"ConfigInitialized","type":{"kind":"struct","fields":[{"name":"admin","type":"pubkey"},{"name":"dev_wallet","type":"pubkey"},{"name":"fee_bps","type":"u16"}]}},{"name":"ConfigUpdated","type":{"kind":"struct","fields":[{"name":"dev_wallet","type":"pubkey"},{"name":"fee_bps","type":"u16"}]}},{"name":"DonationEvent","type":{"kind":"struct","fields":[{"name":"donor","type":"pubkey"},{"name":"streamer","type":"pubkey"},{"name":"amount","type":"u64"},{"name":"fee_bps","type":"u16"}]}},{"name":"LandTransferEvent","type":{"kind":"struct","fields":[{"name":"land_id","type":"u64"},{"name":"new_owner","type":"pubkey"}]}},{"name":"ShopPurchaseEvent","type":{"kind":"struct","fields":[{"name":"payer","type":"pubkey"},{"name":"amount","type":"u64"}]}},{"name":"TradeEvent","type":{"kind":"struct","fields":[{"name":"buyer","type":"pubkey"},{"name":"seller","type":"pubkey"},{"name":"amount","type":"u64"}]}}]}');

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/@solana"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();