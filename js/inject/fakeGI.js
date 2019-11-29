var webgl = document.createElement('canvas').getContext('webgl');
var extensionDebugRendererInfo = webgl.getExtension('WEBGL_debug_renderer_info')
var vendorKey = extensionDebugRendererInfo.UNMASKED_VENDOR_WEBGL
var rendererKey = extensionDebugRendererInfo.UNMASKED_RENDERER_WEBGL
// console.log('Vendor key: ', vendorKey, ' => Fake GI Vendor')
// console.log('Renderer key', rendererKey, ' => Fake GI Renderer')

var content = " \
String = function () { \
if (arguments[0] === eval) { \
  return { \
    length: 37 \
  } \
}; \
return arguments[0].toString(); \
}; \
eval.toString = function(){ \
  return { \
    length: 37 \
  } \
}; \
var document = window.document || document; \
document.createElement = function () { \
  var el = document.createElementNS('http://www.w3.org/1999/xhtml', arguments[0]); \
  if (arguments[0] === 'canvas') { \
    var gl = el.getContext('webgl'); \
    el.getContext = function () { \
      if (arguments[0] === 'webgl' || arguments[0] === 'experimental-webgl') { \
        var gpFunc = gl.getParameter; \
        gl.getParameter = function () { \
          if (arguments[0] === " + vendorKey + ") { \
            return 'Apple Inc.'; \
          } else if (arguments[0] === " + rendererKey + ") { \
            return 'Apple GPU'; \
          }; \
          return document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas').getContext('webgl').getParameter.apply(this, arguments); \
        }; \
        return gl; \
      } \
      return document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas').getContext('2d'); \
    }; \
  }; \
  return el; \
}; \
"
var script = document.createElement('script');
script.textContent = content;
document.documentElement.appendChild(script);
