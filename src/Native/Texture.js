// eslint-disable-next-line no-unused-vars, camelcase
var _elm_community$webgl$Native_Texture = function () {

  var NEAREST = 9728;
  var LINEAR = 9729;
  var CLAMP_TO_EDGE = 33071;

  function guid() {
    // eslint-disable-next-line camelcase
    return _elm_lang$core$Native_Utils.guid();
  }

  function load(magnify, mininify, horizontalWrap, verticalWrap, flipY, url) {
    // eslint-disable-next-line camelcase
    var Scheduler = _elm_lang$core$Native_Scheduler;
    var isMipmap = mininify !== NEAREST && mininify !== LINEAR;
    return Scheduler.nativeBinding(function (callback) {
      var img = new Image();
      function createTexture(gl) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magnify);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mininify);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, horizontalWrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, verticalWrap);
        if (isMipmap) {
          gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        return tex;
      }
      img.onload = function () {
        var width = img.width;
        var height = img.height;
        var widthPowerOfTwo = (width & (width - 1)) === 0;
        var heightPowerOfTwo = (height & (height - 1)) === 0;
        var isSizeValid = (widthPowerOfTwo && heightPowerOfTwo) || (
          !isMipmap
          && horizontalWrap === CLAMP_TO_EDGE
          && verticalWrap === CLAMP_TO_EDGE
        );
        if (isSizeValid) {
          callback(Scheduler.succeed({
            ctor: 'Texture',
            id: guid(),
            createTexture: createTexture,
            width: width,
            height: height
          }));
        } else {
          callback(Scheduler.fail({
            ctor: 'SizeError',
            _0: width,
            _1: height
          }));
        }
      };
      img.onerror = function () {
        callback(Scheduler.fail({ ctor: 'LoadError' }));
      };
      if (url.slice(0, 5) !== 'data:') {
        img.crossOrigin = 'Anonymous';
      }
      img.src = url;
    });
  }

  function fromElement(magnify, mininify, horizontalWrap, verticalWrap, flipY, dynamicVal, elementId) {
    // eslint-disable-next-line camelcase
    var Scheduler = _elm_lang$core$Native_Scheduler;
    var isMipmap = mininify !== NEAREST && mininify !== LINEAR;
    var useInterval = (dynamicVal > 0);
    var useRAF = (dynamicVal < 0);
    var isDynamic = useInterval || useRAF;
    return Scheduler.nativeBinding(function (callback) {
      var wrapper = document.getElementById(elementId);
      if ((typeof wrapper === 'undefined' || wrapper === null) ||
          (typeof wrapper.firstChild === 'undefined' || wrapper.firstChild === null)) {
        callback(Scheduler.fail({
          ctor: 'ElementNotFoundError',
          _0: elementId
        }));
        return;
      }
      var element = wrapper.firstChild;
      function createTexture(gl) {
        var tex = gl.createTexture();
        try {
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                gl.UNSIGNED_BYTE, element);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magnify);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mininify);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, horizontalWrap);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, verticalWrap);
          if (isMipmap) {
            gl.generateMipmap(gl.TEXTURE_2D);
          }
          gl.bindTexture(gl.TEXTURE_2D, null);
          if (isDynamic) {
            function updateTexture () {
              gl.bindTexture(gl.TEXTURE_2D, tex);
              gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
              gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                    gl.UNSIGNED_BYTE, element);
              gl.bindTexture(gl.TEXTURE_2D, null);
            }
            if (useInterval) {
              setInterval(updateTexture, dynamicVal);
            } else {
              var updater = function() {
                updateTexture();
                requestAnimationFrame(updater);
              };
              requestAnimationFrame(updater);
            }
          }
        } catch (err) {
          if (window.console && window.console.error) window.console.error(err);
        }
        return tex;
      }
      var elementRect = element.getBoundingClientRect();
      var width = element.width;
      var height = element.height;
      var widthPowerOfTwo = (width & (width - 1)) === 0;
      var heightPowerOfTwo = (height & (height - 1)) === 0;
      var isSizeValid = (widthPowerOfTwo && heightPowerOfTwo) || (
        !isMipmap
        && horizontalWrap === CLAMP_TO_EDGE
        && verticalWrap === CLAMP_TO_EDGE
      );
      if (isSizeValid) {
        callback(Scheduler.succeed({
          ctor: 'Texture',
          id: guid(),
          createTexture: createTexture,
          width: width,
          height: height
        }));
      } else {
        callback(Scheduler.fail({
          ctor: 'SizeError',
          _0: width,
          _1: height
        }));
      }
    });
  }

  function size(texture) {
    // eslint-disable-next-line camelcase
    return _elm_lang$core$Native_Utils.Tuple2(texture.width, texture.height);
  }

  return {
    size: size,
    load: F6(load),
    fromElement: F7(fromElement)
  };

}();
