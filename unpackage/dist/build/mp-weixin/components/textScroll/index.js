(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/textScroll/index"],{6713:function(t,n,e){},"987e":function(t,n,e){"use strict";var u;e.d(n,"b",(function(){return r})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return u}));var r=function(){var t=this,n=t.$createElement;t._self._c},i=[]},d2f1:function(t,n,e){"use strict";var u=e("6713"),r=e.n(u);r.a},e507:function(t,n,e){"use strict";e.r(n);var u=e("f5d9"),r=e.n(u);for(var i in u)"default"!==i&&function(t){e.d(n,t,(function(){return u[t]}))}(i);n["default"]=r.a},f357:function(t,n,e){"use strict";e.r(n);var u=e("987e"),r=e("e507");for(var i in r)"default"!==i&&function(t){e.d(n,t,(function(){return r[t]}))}(i);e("d2f1");var o,a=e("f0c5"),c=Object(a["a"])(r["default"],u["b"],u["c"],!1,null,null,null,!1,u["a"],o);n["default"]=c.exports},f5d9:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={props:{text:{type:String,defual:function(){return""}}},computed:{},data:function(){return{styleName:{}}},mounted:function(){this.animation()},methods:{animation:function(){var n=this,e=t.createSelectorQuery().in(n).select("#srcoll-item");t.getSystemInfo({success:function(t){e.fields({size:!0,scrollOffset:!0},(function(e){var u="16s";if(e){var r,i=Number(e.width);r=i<t.windowWidth+40?Math.round(i/20):Math.round(i/28),u=r+"s"}n.styleName={"animation-duration":u}})).exec()}})}}};n.default=e}).call(this,e("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/textScroll/index-create-component',
    {
        'components/textScroll/index-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("f357"))
        })
    },
    [['components/textScroll/index-create-component']]
]);
