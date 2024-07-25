var ue={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Be=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t},ft=function(e){const t=[];let n=0,r=0;for(;n<e.length;){const i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){const a=e[n++];t[r++]=String.fromCharCode((i&31)<<6|a&63)}else if(i>239&&i<365){const a=e[n++],s=e[n++],c=e[n++],l=((i&7)<<18|(a&63)<<12|(s&63)<<6|c&63)-65536;t[r++]=String.fromCharCode(55296+(l>>10)),t[r++]=String.fromCharCode(56320+(l&1023))}else{const a=e[n++],s=e[n++];t[r++]=String.fromCharCode((i&15)<<12|(a&63)<<6|s&63)}}return t.join("")},Me={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){const a=e[i],s=i+1<e.length,c=s?e[i+1]:0,l=i+2<e.length,o=l?e[i+2]:0,u=a>>2,f=(a&3)<<4|c>>4;let d=(c&15)<<2|o>>6,h=o&63;l||(h=64,s||(d=64)),r.push(n[u],n[f],n[d],n[h])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Be(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):ft(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){const a=n[e.charAt(i++)],c=i<e.length?n[e.charAt(i)]:0;++i;const o=i<e.length?n[e.charAt(i)]:64;++i;const f=i<e.length?n[e.charAt(i)]:64;if(++i,a==null||c==null||o==null||f==null)throw Error();const d=a<<2|c>>4;if(r.push(d),o!==64){const h=c<<4&240|o>>2;if(r.push(h),f!==64){const b=o<<6&192|f;r.push(b)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},ht=function(e){const t=Be(e);return Me.encodeByteArray(t,!0)},$e=function(e){return ht(e).replace(/\./g,"")},pt=function(e){try{return Me.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function gt(){const e=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof e=="object"&&e.id!==void 0}function Pe(){return typeof indexedDB=="object"}function ke(){return new Promise((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var a;t(((a=i.error)===null||a===void 0?void 0:a.message)||"")}}catch(n){t(n)}})}function mt(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}function bt(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yt=()=>bt().__FIREBASE_DEFAULTS__,wt=()=>{if(typeof process>"u"||typeof ue>"u")return;const e=ue.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},It=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&pt(e[1]);return t&&JSON.parse(t)},vt=()=>{try{return yt()||wt()||It()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},Et=()=>{var e;return(e=vt())===null||e===void 0?void 0:e.config};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const St="FirebaseError";class O extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=St,Object.setPrototypeOf(this,O.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,F.prototype.create)}}class F{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){const r=n[0]||{},i=`${this.service}/${t}`,a=this.errors[t],s=a?At(a,r):"Error",c=`${this.serviceName}: ${s} (${i}).`;return new O(i,c,r)}}function At(e,t){return e.replace(Tt,(n,r)=>{const i=t[r];return i!=null?String(i):`<${r}?>`})}const Tt=/\{\$([^}]+)}/g;function P(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const i of n){if(!r.includes(i))return!1;const a=e[i],s=t[i];if(de(a)&&de(s)){if(!P(a,s))return!1}else if(a!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function de(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ct=1e3,Dt=2,Ot=4*60*60*1e3,Rt=.5;function fe(e,t=Ct,n=Dt){const r=t*Math.pow(n,e),i=Math.round(Rt*r*(Math.random()-.5)*2);return Math.min(Ot,r+i)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(e){return e&&e._delegate?e._delegate:e}class v{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const E="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const r=new _t;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){var n;const r=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),i=(n=t==null?void 0:t.optional)!==null&&n!==void 0?n:!1;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(a){if(i)return null;throw a}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if($t(t))try{this.getOrInitializeService({instanceIdentifier:E})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const a=this.getOrInitializeService({instanceIdentifier:i});r.resolve(a)}catch{}}}}clearInstance(t=E){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=E){return this.instances.has(t)}getOptions(t=E){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[a,s]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(a);r===c&&s.resolve(i)}return i}onInit(t,n){var r;const i=this.normalizeInstanceIdentifier(n),a=(r=this.onInitCallbacks.get(i))!==null&&r!==void 0?r:new Set;a.add(t),this.onInitCallbacks.set(i,a);const s=this.instances.get(i);return s&&t(s,i),()=>{a.delete(t)}}invokeOnInitCallbacks(t,n){const r=this.onInitCallbacks.get(n);if(r)for(const i of r)try{i(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Mt(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=E){return this.component?this.component.multipleInstances?t:E:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Mt(e){return e===E?void 0:e}function $t(e){return e.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pt{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new Bt(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var p;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(p||(p={}));const kt={debug:p.DEBUG,verbose:p.VERBOSE,info:p.INFO,warn:p.WARN,error:p.ERROR,silent:p.SILENT},Nt=p.INFO,Lt={[p.DEBUG]:"log",[p.VERBOSE]:"log",[p.INFO]:"info",[p.WARN]:"warn",[p.ERROR]:"error"},Ft=(e,t,...n)=>{if(t<e.logLevel)return;const r=new Date().toISOString(),i=Lt[t];if(i)console[i](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Le{constructor(t){this.name=t,this._logLevel=Nt,this._logHandler=Ft,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in p))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?kt[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,p.DEBUG,...t),this._logHandler(this,p.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,p.VERBOSE,...t),this._logHandler(this,p.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,p.INFO,...t),this._logHandler(this,p.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,p.WARN,...t),this._logHandler(this,p.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,p.ERROR,...t),this._logHandler(this,p.ERROR,...t)}}const jt=(e,t)=>t.some(n=>e instanceof n);let he,pe;function xt(){return he||(he=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Ht(){return pe||(pe=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Fe=new WeakMap,Q=new WeakMap,je=new WeakMap,z=new WeakMap,ae=new WeakMap;function Ut(e){const t=new Promise((n,r)=>{const i=()=>{e.removeEventListener("success",a),e.removeEventListener("error",s)},a=()=>{n(y(e.result)),i()},s=()=>{r(e.error),i()};e.addEventListener("success",a),e.addEventListener("error",s)});return t.then(n=>{n instanceof IDBCursor&&Fe.set(n,e)}).catch(()=>{}),ae.set(t,e),t}function Vt(e){if(Q.has(e))return;const t=new Promise((n,r)=>{const i=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",s),e.removeEventListener("abort",s)},a=()=>{n(),i()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",a),e.addEventListener("error",s),e.addEventListener("abort",s)});Q.set(e,t)}let ee={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return Q.get(e);if(t==="objectStoreNames")return e.objectStoreNames||je.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return y(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function zt(e){ee=e(ee)}function Wt(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const r=e.call(W(this),t,...n);return je.set(r,t.sort?t.sort():[t]),y(r)}:Ht().includes(e)?function(...t){return e.apply(W(this),t),y(Fe.get(this))}:function(...t){return y(e.apply(W(this),t))}}function qt(e){return typeof e=="function"?Wt(e):(e instanceof IDBTransaction&&Vt(e),jt(e,xt())?new Proxy(e,ee):e)}function y(e){if(e instanceof IDBRequest)return Ut(e);if(z.has(e))return z.get(e);const t=qt(e);return t!==e&&(z.set(e,t),ae.set(t,e)),t}const W=e=>ae.get(e);function xe(e,t,{blocked:n,upgrade:r,blocking:i,terminated:a}={}){const s=indexedDB.open(e,t),c=y(s);return r&&s.addEventListener("upgradeneeded",l=>{r(y(s.result),l.oldVersion,l.newVersion,y(s.transaction))}),n&&s.addEventListener("blocked",()=>n()),c.then(l=>{a&&l.addEventListener("close",()=>a()),i&&l.addEventListener("versionchange",()=>i())}).catch(()=>{}),c}const Gt=["get","getKey","getAll","getAllKeys","count"],Kt=["put","add","delete","clear"],q=new Map;function ge(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(q.get(t))return q.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=Kt.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Gt.includes(n)))return;const a=async function(s,...c){const l=this.transaction(s,i?"readwrite":"readonly");let o=l.store;return r&&(o=o.index(c.shift())),(await Promise.all([o[n](...c),i&&l.done]))[0]};return q.set(t,a),a}zt(e=>({...e,get:(t,n,r)=>ge(t,n)||e.get(t,n,r),has:(t,n)=>!!ge(t,n)||e.has(t,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Jt(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function Jt(e){const t=e.getComponent();return(t==null?void 0:t.type)==="VERSION"}const te="@firebase/app",me="0.8.2";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const A=new Le("@firebase/app"),Xt="@firebase/app-compat",Zt="@firebase/analytics-compat",Qt="@firebase/analytics",en="@firebase/app-check-compat",tn="@firebase/app-check",nn="@firebase/auth",rn="@firebase/auth-compat",an="@firebase/database",sn="@firebase/database-compat",on="@firebase/functions",cn="@firebase/functions-compat",ln="@firebase/installations",un="@firebase/installations-compat",dn="@firebase/messaging",fn="@firebase/messaging-compat",hn="@firebase/performance",pn="@firebase/performance-compat",gn="@firebase/remote-config",mn="@firebase/remote-config-compat",bn="@firebase/storage",yn="@firebase/storage-compat",wn="@firebase/firestore",In="@firebase/firestore-compat",vn="firebase";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ne="[DEFAULT]",En={[te]:"fire-core",[Xt]:"fire-core-compat",[Qt]:"fire-analytics",[Zt]:"fire-analytics-compat",[tn]:"fire-app-check",[en]:"fire-app-check-compat",[nn]:"fire-auth",[rn]:"fire-auth-compat",[an]:"fire-rtdb",[sn]:"fire-rtdb-compat",[on]:"fire-fn",[cn]:"fire-fn-compat",[ln]:"fire-iid",[un]:"fire-iid-compat",[dn]:"fire-fcm",[fn]:"fire-fcm-compat",[hn]:"fire-perf",[pn]:"fire-perf-compat",[gn]:"fire-rc",[mn]:"fire-rc-compat",[bn]:"fire-gcs",[yn]:"fire-gcs-compat",[wn]:"fire-fst",[In]:"fire-fst-compat","fire-js":"fire-js",[vn]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const k=new Map,re=new Map;function _n(e,t){try{e.container.addComponent(t)}catch(n){A.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function T(e){const t=e.name;if(re.has(t))return A.debug(`There were multiple attempts to register component ${t}.`),!1;re.set(t,e);for(const n of k.values())_n(n,e);return!0}function j(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sn={"no-app":"No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()","bad-app-name":"Illegal App name: '{$appName}","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}."},w=new F("app","Firebase",Sn);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(t,n,r){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new v("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw w.create("app-deleted",{appName:this._name})}}function Tn(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const r=Object.assign({name:ne,automaticDataCollectionEnabled:!1},t),i=r.name;if(typeof i!="string"||!i)throw w.create("bad-app-name",{appName:String(i)});if(n||(n=Et()),!n)throw w.create("no-options");const a=k.get(i);if(a){if(P(n,a.options)&&P(r,a.config))return a;throw w.create("duplicate-app",{appName:i})}const s=new Pt(i);for(const l of re.values())s.addComponent(l);const c=new An(n,r,s);return k.set(i,c),c}function Cn(e=ne){const t=k.get(e);if(!t&&e===ne)return Tn();if(!t)throw w.create("no-app",{appName:e});return t}function I(e,t,n){var r;let i=(r=En[e])!==null&&r!==void 0?r:e;n&&(i+=`-${n}`);const a=i.match(/\s|\//),s=t.match(/\s|\//);if(a||s){const c=[`Unable to register library "${i}" with version "${t}":`];a&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),a&&s&&c.push("and"),s&&c.push(`version name "${t}" contains illegal characters (whitespace or "/")`),A.warn(c.join(" "));return}T(new v(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dn="firebase-heartbeat-database",On=1,M="firebase-heartbeat-store";let G=null;function He(){return G||(G=xe(Dn,On,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(M)}}}).catch(e=>{throw w.create("idb-open",{originalErrorMessage:e.message})})),G}async function Rn(e){var t;try{return(await He()).transaction(M).objectStore(M).get(Ue(e))}catch(n){if(n instanceof O)A.warn(n.message);else{const r=w.create("idb-get",{originalErrorMessage:(t=n)===null||t===void 0?void 0:t.message});A.warn(r.message)}}}async function be(e,t){var n;try{const i=(await He()).transaction(M,"readwrite");return await i.objectStore(M).put(t,Ue(e)),i.done}catch(r){if(r instanceof O)A.warn(r.message);else{const i=w.create("idb-set",{originalErrorMessage:(n=r)===null||n===void 0?void 0:n.message});A.warn(i.message)}}}function Ue(e){return`${e.name}!${e.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn=1024,Mn=30*24*60*60*1e3;class $n{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new kn(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=ye();if(this._heartbeatsCache===null&&(this._heartbeatsCache=await this._heartbeatsCachePromise),!(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r)))return this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(i=>{const a=new Date(i.date).valueOf();return Date.now()-a<=Mn}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache===null||this._heartbeatsCache.heartbeats.length===0)return"";const t=ye(),{heartbeatsToSend:n,unsentEntries:r}=Pn(this._heartbeatsCache.heartbeats),i=$e(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function ye(){return new Date().toISOString().substring(0,10)}function Pn(e,t=Bn){const n=[];let r=e.slice();for(const i of e){const a=n.find(s=>s.agent===i.agent);if(a){if(a.dates.push(i.date),we(n)>t){a.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),we(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class kn{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Pe()?ke().then(()=>!0).catch(()=>!1):!1}async read(){return await this._canUseIndexedDBPromise?await Rn(this.app)||{heartbeats:[]}:{heartbeats:[]}}async overwrite(t){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return be(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){var n;if(await this._canUseIndexedDBPromise){const i=await this.read();return be(this.app,{lastSentHeartbeatDate:(n=t.lastSentHeartbeatDate)!==null&&n!==void 0?n:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...t.heartbeats]})}else return}}function we(e){return $e(JSON.stringify({version:2,heartbeats:e})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nn(e){T(new v("platform-logger",t=>new Yt(t),"PRIVATE")),T(new v("heartbeat",t=>new $n(t),"PRIVATE")),I(te,me,e),I(te,me,"esm2017"),I("fire-js","")}Nn("");const Ve="@firebase/installations",se="0.5.15";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ze=1e4,We=`w:${se}`,qe="FIS_v2",Ln="https://firebaseinstallations.googleapis.com/v1",Fn=60*60*1e3,jn="installations",xn="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hn={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},C=new F(jn,xn,Hn);function Ge(e){return e instanceof O&&e.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ke({projectId:e}){return`${Ln}/projects/${e}/installations`}function Ye(e){return{token:e.token,requestStatus:2,expiresIn:Vn(e.expiresIn),creationTime:Date.now()}}async function Je(e,t){const r=(await t.json()).error;return C.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function Xe({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function Un(e,{refreshToken:t}){const n=Xe(e);return n.append("Authorization",zn(t)),n}async function Ze(e){const t=await e();return t.status>=500&&t.status<600?e():t}function Vn(e){return Number(e.replace("s","000"))}function zn(e){return`${qe} ${e}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wn({appConfig:e,heartbeatServiceProvider:t},{fid:n}){const r=Ke(e),i=Xe(e),a=t.getImmediate({optional:!0});if(a){const o=await a.getHeartbeatsHeader();o&&i.append("x-firebase-client",o)}const s={fid:n,authVersion:qe,appId:e.appId,sdkVersion:We},c={method:"POST",headers:i,body:JSON.stringify(s)},l=await Ze(()=>fetch(r,c));if(l.ok){const o=await l.json();return{fid:o.fid||n,registrationStatus:2,refreshToken:o.refreshToken,authToken:Ye(o.authToken)}}else throw await Je("Create Installation",l)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(e){return new Promise(t=>{setTimeout(t,e)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qn(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gn=/^[cdef][\w-]{21}$/,ie="";function Kn(){try{const e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;const n=Yn(e);return Gn.test(n)?n:ie}catch{return ie}}function Yn(e){return qn(e).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(e){return`${e.appName}!${e.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const et=new Map;function tt(e,t){const n=x(e);nt(n,t),Jn(n,t)}function nt(e,t){const n=et.get(e);if(n)for(const r of n)r(t)}function Jn(e,t){const n=Xn();n&&n.postMessage({key:e,fid:t}),Zn()}let S=null;function Xn(){return!S&&"BroadcastChannel"in self&&(S=new BroadcastChannel("[Firebase] FID Change"),S.onmessage=e=>{nt(e.data.key,e.data.fid)}),S}function Zn(){et.size===0&&S&&(S.close(),S=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qn="firebase-installations-database",er=1,D="firebase-installations-store";let K=null;function oe(){return K||(K=xe(Qn,er,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(D)}}})),K}async function N(e,t){const n=x(e),i=(await oe()).transaction(D,"readwrite"),a=i.objectStore(D),s=await a.get(n);return await a.put(t,n),await i.done,(!s||s.fid!==t.fid)&&tt(e,t.fid),t}async function rt(e){const t=x(e),r=(await oe()).transaction(D,"readwrite");await r.objectStore(D).delete(t),await r.done}async function H(e,t){const n=x(e),i=(await oe()).transaction(D,"readwrite"),a=i.objectStore(D),s=await a.get(n),c=t(s);return c===void 0?await a.delete(n):await a.put(c,n),await i.done,c&&(!s||s.fid!==c.fid)&&tt(e,c.fid),c}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ce(e){let t;const n=await H(e.appConfig,r=>{const i=tr(r),a=nr(e,i);return t=a.registrationPromise,a.installationEntry});return n.fid===ie?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function tr(e){const t=e||{fid:Kn(),registrationStatus:0};return it(t)}function nr(e,t){if(t.registrationStatus===0){if(!navigator.onLine){const i=Promise.reject(C.create("app-offline"));return{installationEntry:t,registrationPromise:i}}const n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=rr(e,n);return{installationEntry:n,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:ir(e)}:{installationEntry:t}}async function rr(e,t){try{const n=await Wn(e,t);return N(e.appConfig,n)}catch(n){throw Ge(n)&&n.customData.serverCode===409?await rt(e.appConfig):await N(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function ir(e){let t=await Ie(e.appConfig);for(;t.registrationStatus===1;)await Qe(100),t=await Ie(e.appConfig);if(t.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await ce(e);return r||n}return t}function Ie(e){return H(e,t=>{if(!t)throw C.create("installation-not-found");return it(t)})}function it(e){return ar(e)?{fid:e.fid,registrationStatus:0}:e}function ar(e){return e.registrationStatus===1&&e.registrationTime+ze<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sr({appConfig:e,heartbeatServiceProvider:t},n){const r=or(e,n),i=Un(e,n),a=t.getImmediate({optional:!0});if(a){const o=await a.getHeartbeatsHeader();o&&i.append("x-firebase-client",o)}const s={installation:{sdkVersion:We,appId:e.appId}},c={method:"POST",headers:i,body:JSON.stringify(s)},l=await Ze(()=>fetch(r,c));if(l.ok){const o=await l.json();return Ye(o)}else throw await Je("Generate Auth Token",l)}function or(e,{fid:t}){return`${Ke(e)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function le(e,t=!1){let n;const r=await H(e.appConfig,a=>{if(!at(a))throw C.create("not-registered");const s=a.authToken;if(!t&&ur(s))return a;if(s.requestStatus===1)return n=cr(e,t),a;{if(!navigator.onLine)throw C.create("app-offline");const c=fr(a);return n=lr(e,c),c}});return n?await n:r.authToken}async function cr(e,t){let n=await ve(e.appConfig);for(;n.authToken.requestStatus===1;)await Qe(100),n=await ve(e.appConfig);const r=n.authToken;return r.requestStatus===0?le(e,t):r}function ve(e){return H(e,t=>{if(!at(t))throw C.create("not-registered");const n=t.authToken;return hr(n)?Object.assign(Object.assign({},t),{authToken:{requestStatus:0}}):t})}async function lr(e,t){try{const n=await sr(e,t),r=Object.assign(Object.assign({},t),{authToken:n});return await N(e.appConfig,r),n}catch(n){if(Ge(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await rt(e.appConfig);else{const r=Object.assign(Object.assign({},t),{authToken:{requestStatus:0}});await N(e.appConfig,r)}throw n}}function at(e){return e!==void 0&&e.registrationStatus===2}function ur(e){return e.requestStatus===2&&!dr(e)}function dr(e){const t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+Fn}function fr(e){const t={requestStatus:1,requestTime:Date.now()};return Object.assign(Object.assign({},e),{authToken:t})}function hr(e){return e.requestStatus===1&&e.requestTime+ze<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pr(e){const t=e,{installationEntry:n,registrationPromise:r}=await ce(t);return r?r.catch(console.error):le(t).catch(console.error),n.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gr(e,t=!1){const n=e;return await mr(n),(await le(n,t)).token}async function mr(e){const{registrationPromise:t}=await ce(e);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function br(e){if(!e||!e.options)throw Y("App Configuration");if(!e.name)throw Y("App Name");const t=["projectId","apiKey","appId"];for(const n of t)if(!e.options[n])throw Y(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function Y(e){return C.create("missing-app-config-values",{valueName:e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const st="installations",yr="installations-internal",wr=e=>{const t=e.getProvider("app").getImmediate(),n=br(t),r=j(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Ir=e=>{const t=e.getProvider("app").getImmediate(),n=j(t,st).getImmediate();return{getId:()=>pr(n),getToken:i=>gr(n,i)}};function vr(){T(new v(st,wr,"PUBLIC")),T(new v(yr,Ir,"PRIVATE"))}vr();I(Ve,se);I(Ve,se,"esm2017");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L="analytics",Er="firebase_id",_r="origin",Sr=60*1e3,Ar="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",ot="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const g=new Le("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ct(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function Tr(e,t){const n=document.createElement("script");n.src=`${ot}?l=${e}&id=${t}`,n.async=!0,document.head.appendChild(n)}function Cr(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function Dr(e,t,n,r,i,a){const s=r[i];try{if(s)await t[s];else{const l=(await ct(n)).find(o=>o.measurementId===i);l&&await t[l.appId]}}catch(c){g.error(c)}e("config",i,a)}async function Or(e,t,n,r,i){try{let a=[];if(i&&i.send_to){let s=i.send_to;Array.isArray(s)||(s=[s]);const c=await ct(n);for(const l of s){const o=c.find(f=>f.measurementId===l),u=o&&t[o.appId];if(u)a.push(u);else{a=[];break}}}a.length===0&&(a=Object.values(t)),await Promise.all(a),e("event",r,i||{})}catch(a){g.error(a)}}function Rr(e,t,n,r){async function i(a,s,c){try{a==="event"?await Or(e,t,n,s,c):a==="config"?await Dr(e,t,n,r,s,c):a==="consent"?e("consent","update",c):e("set",s)}catch(l){g.error(l)}}return i}function Br(e,t,n,r,i){let a=function(...s){window[r].push(arguments)};return window[i]&&typeof window[i]=="function"&&(a=window[i]),window[i]=Rr(a,e,t,n),{gtagCore:a,wrappedGtag:window[i]}}function Mr(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(ot)&&n.src.includes(e))return n;return null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.'},m=new F("analytics","Analytics",$r);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pr=30,kr=1e3;class Nr{constructor(t={},n=kr){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const lt=new Nr;function Lr(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function Fr(e){var t;const{appId:n,apiKey:r}=e,i={method:"GET",headers:Lr(r)},a=Ar.replace("{app-id}",n),s=await fetch(a,i);if(s.status!==200&&s.status!==304){let c="";try{const l=await s.json();!((t=l.error)===null||t===void 0)&&t.message&&(c=l.error.message)}catch{}throw m.create("config-fetch-failed",{httpStatus:s.status,responseMessage:c})}return s.json()}async function jr(e,t=lt,n){const{appId:r,apiKey:i,measurementId:a}=e.options;if(!r)throw m.create("no-app-id");if(!i){if(a)return{measurementId:a,appId:r};throw m.create("no-api-key")}const s=t.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new Ur;return setTimeout(async()=>{c.abort()},Sr),ut({appId:r,apiKey:i,measurementId:a},s,c,t)}async function ut(e,{throttleEndTimeMillis:t,backoffCount:n},r,i=lt){var a,s;const{appId:c,measurementId:l}=e;try{await xr(r,t)}catch(o){if(l)return g.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${(a=o)===null||a===void 0?void 0:a.message}]`),{appId:c,measurementId:l};throw o}try{const o=await Fr(e);return i.deleteThrottleMetadata(c),o}catch(o){const u=o;if(!Hr(u)){if(i.deleteThrottleMetadata(c),l)return g.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${l} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:c,measurementId:l};throw o}const f=Number((s=u==null?void 0:u.customData)===null||s===void 0?void 0:s.httpStatus)===503?fe(n,i.intervalMillis,Pr):fe(n,i.intervalMillis),d={throttleEndTimeMillis:Date.now()+f,backoffCount:n+1};return i.setThrottleMetadata(c,d),g.debug(`Calling attemptFetch again in ${f} millis`),ut(e,d,r,i)}}function xr(e,t){return new Promise((n,r)=>{const i=Math.max(t-Date.now(),0),a=setTimeout(n,i);e.addEventListener(()=>{clearTimeout(a),r(m.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function Hr(e){if(!(e instanceof O)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class Ur{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function Vr(e,t,n,r,i){if(i&&i.global){e("event",n,r);return}else{const a=await t,s=Object.assign(Object.assign({},r),{send_to:a});e("event",n,s)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zr(){var e;if(Pe())try{await ke()}catch(t){return g.warn(m.create("indexeddb-unavailable",{errorInfo:(e=t)===null||e===void 0?void 0:e.toString()}).message),!1}else return g.warn(m.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function Wr(e,t,n,r,i,a,s){var c;const l=jr(e);l.then(h=>{n[h.measurementId]=h.appId,e.options.measurementId&&h.measurementId!==e.options.measurementId&&g.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${h.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(h=>g.error(h)),t.push(l);const o=zr().then(h=>{if(h)return r.getId()}),[u,f]=await Promise.all([l,o]);Mr(a)||Tr(a,u.measurementId),i("js",new Date);const d=(c=s==null?void 0:s.config)!==null&&c!==void 0?c:{};return d[_r]="firebase",d.update=!0,f!=null&&(d[Er]=f),i("config",u.measurementId,d),u.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(t){this.app=t}_delete(){return delete B[this.app.options.appId],Promise.resolve()}}let B={},Ee=[];const _e={};let J="dataLayer",Gr="gtag",Se,dt,Ae=!1;function Kr(){const e=[];if(gt()&&e.push("This is a browser extension environment."),mt()||e.push("Cookies are not available."),e.length>0){const t=e.map((r,i)=>`(${i+1}) ${r}`).join(" "),n=m.create("invalid-analytics-context",{errorInfo:t});g.warn(n.message)}}function Yr(e,t,n){Kr();const r=e.options.appId;if(!r)throw m.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)g.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw m.create("no-api-key");if(B[r]!=null)throw m.create("already-exists",{id:r});if(!Ae){Cr(J);const{wrappedGtag:a,gtagCore:s}=Br(B,Ee,_e,J,Gr);dt=a,Se=s,Ae=!0}return B[r]=Wr(e,Ee,_e,t,Se,J,n),new qr(e)}function ai(e=Cn()){e=Ne(e);const t=j(e,L);return t.isInitialized()?t.getImmediate():Jr(e)}function Jr(e,t={}){const n=j(e,L);if(n.isInitialized()){const i=n.getImmediate();if(P(t,n.getOptions()))return i;throw m.create("already-initialized")}return n.initialize({options:t})}function Xr(e,t,n,r){e=Ne(e),Vr(dt,B[e.app.options.appId],t,n,r).catch(i=>g.error(i))}const Te="@firebase/analytics",Ce="0.8.3";function Zr(){T(new v(L,(t,{options:n})=>{const r=t.getProvider("app").getImmediate(),i=t.getProvider("installations-internal").getImmediate();return Yr(r,i,n)},"PUBLIC")),T(new v("analytics-internal",e,"PRIVATE")),I(Te,Ce),I(Te,Ce,"esm2017");function e(t){try{const n=t.getProvider(L).getImmediate();return{logEvent:(r,i,a)=>Xr(n,r,i,a)}}catch(n){throw m.create("interop-component-reg-failed",{reason:n})}}}Zr();var Qr="firebase",ei="9.12.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */I(Qr,ei,"app");try{self["workbox:window:7.0.0"]&&_()}catch{}function De(e,t){return new Promise(function(n){var r=new MessageChannel;r.port1.onmessage=function(i){n(i.data)},e.postMessage(t,[r.port2])})}function ti(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function Oe(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function ni(e,t){var n;if(typeof Symbol>"u"||e[Symbol.iterator]==null){if(Array.isArray(e)||(n=function(i,a){if(i){if(typeof i=="string")return Oe(i,a);var s=Object.prototype.toString.call(i).slice(8,-1);return s==="Object"&&i.constructor&&(s=i.constructor.name),s==="Map"||s==="Set"?Array.from(i):s==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)?Oe(i,a):void 0}}(e))||t){n&&(e=n);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}return(n=e[Symbol.iterator]()).next.bind(n)}try{self["workbox:core:7.0.0"]&&_()}catch{}var X=function(){var e=this;this.promise=new Promise(function(t,n){e.resolve=t,e.reject=n})};function Z(e,t){var n=location.href;return new URL(e,n).href===new URL(t,n).href}var R=function(e,t){this.type=e,Object.assign(this,t)};function $(e,t,n){return n?t?t(e):e:(e&&e.then||(e=Promise.resolve(e)),t?e.then(t):e)}function ri(){}var ii={type:"SKIP_WAITING"};function Re(e,t){return e&&e.then?e.then(ri):Promise.resolve()}var si=function(e){var t,n;function r(c,l){var o,u;return l===void 0&&(l={}),(o=e.call(this)||this).nn={},o.tn=0,o.rn=new X,o.en=new X,o.on=new X,o.un=0,o.an=new Set,o.cn=function(){var f=o.fn,d=f.installing;o.tn>0||!Z(d.scriptURL,o.sn.toString())||performance.now()>o.un+6e4?(o.vn=d,f.removeEventListener("updatefound",o.cn)):(o.hn=d,o.an.add(d),o.rn.resolve(d)),++o.tn,d.addEventListener("statechange",o.ln)},o.ln=function(f){var d=o.fn,h=f.target,b=h.state,U=h===o.vn,V={sw:h,isExternal:U,originalEvent:f};!U&&o.mn&&(V.isUpdate=!0),o.dispatchEvent(new R(b,V)),b==="installed"?o.wn=self.setTimeout(function(){b==="installed"&&d.waiting===h&&o.dispatchEvent(new R("waiting",V))},200):b==="activating"&&(clearTimeout(o.wn),U||o.en.resolve(h))},o.dn=function(f){var d=o.hn,h=d!==navigator.serviceWorker.controller;o.dispatchEvent(new R("controlling",{isExternal:h,originalEvent:f,sw:d,isUpdate:o.mn})),h||o.on.resolve(d)},o.gn=(u=function(f){var d=f.data,h=f.ports,b=f.source;return $(o.getSW(),function(){o.an.has(b)&&o.dispatchEvent(new R("message",{data:d,originalEvent:f,ports:h,sw:b}))})},function(){for(var f=[],d=0;d<arguments.length;d++)f[d]=arguments[d];try{return Promise.resolve(u.apply(this,f))}catch(h){return Promise.reject(h)}}),o.sn=c,o.nn=l,navigator.serviceWorker.addEventListener("message",o.gn),o}n=e,(t=r).prototype=Object.create(n.prototype),t.prototype.constructor=t,t.__proto__=n;var i,a,s=r.prototype;return s.register=function(c){var l=(c===void 0?{}:c).immediate,o=l!==void 0&&l;try{var u=this;return function(f,d){var h=f();return h&&h.then?h.then(d):d(h)}(function(){if(!o&&document.readyState!=="complete")return Re(new Promise(function(f){return window.addEventListener("load",f)}))},function(){return u.mn=!!navigator.serviceWorker.controller,u.yn=u.pn(),$(u.bn(),function(f){u.fn=f,u.yn&&(u.hn=u.yn,u.en.resolve(u.yn),u.on.resolve(u.yn),u.yn.addEventListener("statechange",u.ln,{once:!0}));var d=u.fn.waiting;return d&&Z(d.scriptURL,u.sn.toString())&&(u.hn=d,Promise.resolve().then(function(){u.dispatchEvent(new R("waiting",{sw:d,wasWaitingBeforeRegister:!0}))}).then(function(){})),u.hn&&(u.rn.resolve(u.hn),u.an.add(u.hn)),u.fn.addEventListener("updatefound",u.cn),navigator.serviceWorker.addEventListener("controllerchange",u.dn),u.fn})})}catch(f){return Promise.reject(f)}},s.update=function(){try{return this.fn?Re(this.fn.update()):void 0}catch(c){return Promise.reject(c)}},s.getSW=function(){return this.hn!==void 0?Promise.resolve(this.hn):this.rn.promise},s.messageSW=function(c){try{return $(this.getSW(),function(l){return De(l,c)})}catch(l){return Promise.reject(l)}},s.messageSkipWaiting=function(){this.fn&&this.fn.waiting&&De(this.fn.waiting,ii)},s.pn=function(){var c=navigator.serviceWorker.controller;return c&&Z(c.scriptURL,this.sn.toString())?c:void 0},s.bn=function(){try{var c=this;return function(l,o){try{var u=l()}catch(f){return o(f)}return u&&u.then?u.then(void 0,o):u}(function(){return $(navigator.serviceWorker.register(c.sn,c.nn),function(l){return c.un=performance.now(),l})},function(l){throw l})}catch(l){return Promise.reject(l)}},i=r,(a=[{key:"active",get:function(){return this.en.promise}},{key:"controlling",get:function(){return this.on.promise}}])&&ti(i.prototype,a),r}(function(){function e(){this.Pn=new Map}var t=e.prototype;return t.addEventListener=function(n,r){this.Sn(n).add(r)},t.removeEventListener=function(n,r){this.Sn(n).delete(r)},t.dispatchEvent=function(n){n.target=this;for(var r,i=ni(this.Sn(n.type));!(r=i()).done;)(0,r.value)(n)},t.Sn=function(n){return this.Pn.has(n)||this.Pn.set(n,new Set),this.Pn.get(n)},e}());export{ai as g,Tn as i,Xr as l,si as v};
