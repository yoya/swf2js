/**
 * swf2js (version 0.1.7)
 * web: https://github.com/ienaga/swf2js/
 * readMe: https://github.com/ienaga/swf2js/blob/master/README.md
 * contact: ienagatoshiyuki@facebook.com
 *
 * Copyright (c) 2013 Toshiyuki Ienaga. Licensed under the MIT License.
 * コピーも改変もご自由にどうぞ。
 */
(function(window) {
    // local cache
    var _window = window;
    var _document = _window.document;
    var _Math = Math;
    var _min = _Math.min;
    var _max = _Math.max;
    var _floor = _Math.floor;
    var _pow = _Math.pow;
    var _random = _Math.random;
    var _void = void 0;
    var _String = String;
    var _fromCharCode = _String.fromCharCode;
    var _parseInt = parseInt;
    var _parseFloat = parseFloat;
    var _isNaN = isNaN;
    var _xmlHttpRequest = new XMLHttpRequest();
    var _Image = Image;
    var _Audio = Audio;
    var _setInterval = setInterval;
    var _clearInterval = clearInterval;
    var _Date = Date;
    var _decodeURIComponent = decodeURIComponent;

    // local function cache
    var _init = init;
    var _changeColor = changeColor;
    var _drawVector = drawVector;
    var _mask = mask;
    var _draw = draw;
    var _rollBackColor = rollBackColor;
    var _render = render;
    var _buffer = buffer;
    var _onEnterFrame = onEnterFrame;
    var _clearMain = clearMain;
    var _setBuffer = setBuffer;
    var _handleMessage = handleMessage;
    var _clearPre = clearPre;
    var _setStyle = setStyle;
    var _action = action;
    var _putFrame = putFrame;
    var _renderBtn = renderBtn;
    var _drawBtn = drawBtn;
    var _changeScreenSize = changeScreenSize;
    var _getGradientLogic = getGradientLogic;
    var _generateColor = generateColor;
    var _clone = clone;
    var _parse = parse;
    var _decodeToShiftJis = decodeToShiftJis;
    var _getAnimationClassVariable = getAnimationClassVariable;
    var _setSwfHeader = setSwfHeader;
    var _resetObj = resetObj;
    var _generateText = generateText;
    var _base64encode = base64encode;
    var _parseJpegData = parseJpegData;
    var _unzip = unzip;
    var _buildHuffTable = buildHuffTable;
    var _decodeSymbol = decodeSymbol;
    var _deleteCss = deleteCss;
    var _getTextByte = getTextByte;
    var _isFontInstalled = isFontInstalled;

    // canvas
    var _renderCanvas = renderCanvas;
    var _setCanvasArray = setCanvasArray;
    var _getCanvasArray = getCanvasArray;
    var _generateRGBA = generateRGBA;
    var _setMoveTo = setMoveTo;
    var _setQuadraticCurveTo = setQuadraticCurveTo;
    var _setLineTo = setLineTo;
    var _setTransform = setTransform;
    var _setSetTransform = setSetTransform;
    var _setBeginPath = setBeginPath;
    var _setSave = setSave;
    var _setRestore = setRestore;
    var _setClosePath = setClosePath;
    var _setFillStyle = setFillStyle;
    var _setStrokeStyle = setStrokeStyle;
    var _setFill = setFill;
    var _setStroke = setStroke;
    var _setLineWidth = setLineWidth;
    var _setLineCap = setLineCap;
    var _setLineJoin = setLineJoin;
    var _setClip = setClip;
    var _setRotate = setRotate;
    var _setDrawImage = setDrawImage;
    var _setScale = setScale;
    var _setImage = setImage;
    var _setFont = setFont;
    var _setTextAlign = setTextAlign;
    var _setFillText= setFillText;

    // params
    var intervalId = 0;
    var setWidth = 0;
    var setHeight = 0;
    var renderMode = 'canvas';
    var baseCanvas, context, preContext;
    var messageName = "zero-timeout-message";
    var canvasArray = [];
    var cacheArray = [];
    var bitMapData = [];
    var layer = [];
    var btnLayer = [];
    var touchCtx = [];
    var FontData = [];
    var sounds = [];
    var imgLoadCount = 0;
    var imgLoadCompCount = 0;
    var timeouts = 0;
    var devicePixelRatio = _window.devicePixelRatio || 1;
    var scale = 1;
    var width = 0;
    var height = 0;
    var touchId = 0;
    var touchClass = {};
    var currentPosition = {x:0, y:0};
    var startDate = new _Date();
    var isTouch = false;
    var touchFlag = false;
    var isBtnAction = false;
    var isLoad = false;
    var jpegTables = null;
    var signature = '';
    var version = 0;
    var isSpriteSheet = false;
    var base64Array = [];
    var spriteArray = [];
    var totalFrame = 0;

    /**
     * init
     */
    function init()
    {
        // PCで確認する用
        // SP=true, PC=false
        isTouch = ('ontouchstart' in _window);
        if (isTouch) {
            // SP
            var startEvent = 'touchstart';
            var moveEvent  = 'touchmove';
            var endEvent   = 'touchend';
        } else {
            // PC
            var startEvent = 'mousedown';
            var moveEvent  = 'mousemove';
            var endEvent   = 'mouseup';
        }

        // base canvas
        baseCanvas = _document.createElement('canvas');

        // div
        var div = _document.getElementById('swf2js');
        width  = (setWidth > 0) ? setWidth : _window.innerWidth;
        height = (setHeight > 0) ? setHeight : _window.innerHeight;
        var minSize = _min(width, height);
        var style = div.style;
        _setStyle(style, 'position', 'relative');
        _setStyle(style, 'top', '0');
        _setStyle(style, 'left', (width / 2) - (minSize / 2) +'px');
        _setStyle(style, 'width', minSize + 'px');
        _setStyle(style, 'height', minSize + 'px');
        _setStyle(style, '-webkit-user-select', 'none');

        // 子要素を削除
        var childNodes = div.childNodes;
        var len = childNodes.length;
        if (len) {
            for (var i = len; i--;) {
                div.removeChild(childNodes[i]);
            }
        }

        // css loading
        var css = '<style>';
        css += '#swf2js_loading {\n';
        css += 'z-index: 999;\n';
        css += 'position: absolute;\n';
        css += 'top: '+ (48 - _floor((30/height) * 100)) +'%;\n';
        css += 'left: '+ (52 - _floor((30/width) * 100)) +'%;\n';
        css += 'width: 50px;\n';
        css += 'height: 50px;\n';
        css += 'border-radius: 50px;\n';
        css += 'border: 8px solid #dcdcdc;\n';
        css += 'border-right-color: transparent;\n';
        css += 'box-sizing: border-box;\n';
        css += '-webkit-animation: spin 1s infinite linear;\n';
        css += '} \n';

        css += '@-webkit-keyframes spin {\n';
        css += '0% { -webkit-transform: rotate(0deg); opacity: 0.4; }\n';
        css += '50% { -webkit-transform: rotate(180deg); opacity: 1;}\n';
        css += '100% { -webkit-transform: rotate(360deg); opacity: 0.4; }\n';
        css += '} \n';


        css += '</style>';
        div.innerHTML = css;

        var loadingDiv = _document.createElement('div');
        loadingDiv.id = 'swf2js_loading';
        div.appendChild(loadingDiv);

        // main canvasをセット
        var canvas = baseCanvas.cloneNode(false);
        context = canvas.getContext('2d');
        style = canvas.style;
        _setStyle(style, 'zIndex', 0);
        _setStyle(style, 'zoom', 100 / devicePixelRatio + '%');
        _setStyle(style, 'position', 'absolute');
        _setStyle(style, 'top', 0);
        _setStyle(canvas, 'width', width * devicePixelRatio);
        _setStyle(canvas, 'height', height * devicePixelRatio);

        // タッチイベントの登録
        canvas.addEventListener(startEvent, touchStart, false);
        canvas.addEventListener(moveEvent, touchMove, false);
        canvas.addEventListener(endEvent, touchEnd, false);

        // divに設置
        div.appendChild(canvas);

        // pre canvas
        var preCanvas = baseCanvas.cloneNode(false);
        preContext = preCanvas.getContext('2d');

        return true;
    }

    /**
     * onresize
     */
    _window.onresize = function()
    {
        if (!isSpriteSheet) {
            // リサイズ開始
            _changeScreenSize();

            // buffer
            _setBuffer();
        }
    }

    /**
     * changeScreenSize
     */
    function changeScreenSize()
    {
        var _layer = player.layer;
        if (!(_layer instanceof AnimationClass)) {
            return false;
        }

        var screenWidth  = (setWidth > 0) ? setWidth : _window.innerWidth;
        var screenHeight = (setHeight > 0) ? setHeight : _window.innerHeight;

        var canvasWidth  = _layer._width;
        var canvasHeight = _layer._height;
        var minSize = _min(screenWidth, screenHeight);

        // 条件に合わせてリサイズ
        if(canvasWidth > canvasHeight){
            scale = screenWidth / canvasWidth * devicePixelRatio;
            width  = canvasWidth * scale;
            height = canvasHeight * scale;
        } else if (canvasWidth == canvasHeight) {
            scale  = minSize / canvasWidth * devicePixelRatio;
            width  = canvasWidth  * scale;
            height = canvasHeight * scale;
        } else {
            scale = _min(
                (screenWidth / canvasWidth) * devicePixelRatio,
                (screenHeight / canvasHeight) * devicePixelRatio
            );
            width  = canvasWidth * scale;
            height = canvasHeight * scale;
        }

        // divの設定
        var div = _document.getElementById('swf2js');
        var style = div.style;
        var setWidthPx = width / devicePixelRatio;
        var setHeightPx = height / devicePixelRatio;
        _setStyle(style, 'width', setWidthPx + 'px');
        _setStyle(style, 'height', setHeightPx + 'px');
        _setStyle(style, 'top', '0');
        _setStyle(style, 'left',
            ((screenWidth / 2) - (setWidthPx / 2)) + 'px'
        );

        // main
        var canvas = context.canvas;
        _setStyle(canvas, 'width', width);
        _setStyle(canvas, 'height', height);

        // pre
        var preCanvas = preContext.canvas;
        _setStyle(preCanvas, 'width', width);
        _setStyle(preCanvas, 'height', height);
    }

    /**
     * setBuffer
     */
    function setBuffer()
    {
        timeouts++;
        _window.postMessage(messageName, '*');
    }

    /**
     * handleMessage
     * @param event
     */
    function handleMessage(event)
    {
        if (event.source == _window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts) {
                timeouts--;
                _buffer();
            }
        }
    }
    // handleMessage
    _window.addEventListener('message', _handleMessage, true);

    /**
     * player
     * @type {{playStartFlag: boolean, Xmax: number, Ymax: number, Xmin: number, Ymin: number, layer: {}, frameCount: number, fps: number, fileLength: number, frameRate: number, frame: number}}
     */
    var player = {
        playStartFlag: false,
        Xmax: 0,
        Ymax: 0,
        Xmin: 0,
        Ymin: 0,
        layer: {},
        frame: 1,
        frameCount: 0,
        frameRate: 0,
        fps: 0,
        fileLength: 0
    };

    /**
     * BitIO
     * @constructor
     */
    var BitIO = function(){};

    /**
     * prototype
     */
    BitIO.prototype = {
        // params
        data: null,
        bit_offset: 0,
        byte_offset: 0,
        bit_buffer: null,

        /**
         * 取得したswfデータをセット
         * @param swf
         */
        setData: function(swf)
        {
            var buff = [];
            var bo = 0;
            for (var i = swf.length; i--;) {
                buff[buff.length] = _fromCharCode(swf.charCodeAt(bo++) & 0xff);
            }
            this.data = buff.join('');
        },

        /**
         * ヘッダーのシグネチャバイト
         * @returns {number}
         */
        getHeaderSignature: function()
        {
            var _this = this;
            var buff = [];
            for (var i = 3; i--;) {
                buff[buff.length] =
                    _fromCharCode(_this.getUI8());
            }
            return buff.join('');
        },

        /**
         * バージョン情報
         * @returns {number}
         */
        getVersion: function()
        {
            return this.getUI8();
        },

        /**
         * byte_offsetをカウントアップしてbit_offsetを初期化
         */
        byteAlign: function()
        {
            var _this = this;
            if (_this.bit_offset) {
                _this.byte_offset += ((_this.bit_offset + 7) / 8) | 0;
                _this.bit_offset = 0;
            }
        },

        /**
         * getData
         * @param n
         * @returns {string}
         */
        getData: function(n)
        {
            var _this = this;
            _this.byteAlign();
            var bo  = _this.byte_offset;
            var ret = _this.data.substr(bo, n);
            _this.byte_offset = bo + n;
            return ret;
        },

        /**
         * DataUntil
         * @param value
         * @param isJis
         * @returns {string}
         */
        getDataUntil: function(value, isJis)
        {
            var _this = this;

            _this.byteAlign();
            var bo = _this.byte_offset;
            var offset = 0;
            if (!value || value == null) {
                offset = -1;
            } else {
                offset = _this.data.indexOf(value, bo);
            }

            var n = 0;
            if (offset == -1) {
                n = _this.data.length - bo;
            } else {
                n = offset - bo;
            }

            _this.byte_offset = bo + n;
            if (value != null) {
                var len = value.length;
                if ((offset != -1) && len) {
                    _this.byte_offset += len;
                }
            }

            if (isJis == undefined) {
                isJis = true;
            }

            var ret = _this.data.substr(bo, n);
            if (value != null) {
                var rLen = ret.length;
                var array = [];
                for (var i = 0; i < rLen; i++) {
                    var code = ret.charCodeAt(i) & 0xff;
                    if (code == 10 || code == 13) {
                        array[array.length] = '@LFCR';
                    } else if (code < 32) {
                        continue;
                    } else {
                        array[array.length] = '%' + code.toString(16);
                    }
                }

                ret = (isJis)
                    ? _decodeToShiftJis(array.join(''))
                    : array.join('');

                if (ret.substr(-5) == '@LFCR') {
                    ret.slice(0, -5);
                }
            }

            return ret;
        },

        /**
         * byte_offsetのカウントアップ調整
         */
        byteCarry: function()
        {
            var _this = this;
            if (_this.bit_offset > 7) {
                _this.byte_offset += ((_this.bit_offset + 7) / 8) | 0;
                _this.bit_offset &= 0x07;
            } else {
                while (_this.bit_offset < 0) {
                    _this.byte_offset--;
                    _this.bit_offset += 8;
                }
            }
        },

        /**
         * 次以降のフィールドで使われるビット長を取得
         * @param n
         * @returns {number}
         */
        getUIBits: function(n)
        {
            var value = 0;
            var _this = this;
            while (n--) {
                value <<= 1;
                value |= _this.getUIBit();
            }
            return value;
        },

        /**
         * getUIBitsで指定されたbitの個別取得
         * @returns {number}
         */
        getUIBit: function()
        {
            var _this = this;
            _this.byteCarry();
            return (_this.data.charCodeAt(_this.byte_offset)
                >> (7 - _this.bit_offset++)) & 0x1;
        },

        /**
         * 符号付き整数
         * @param n
         * @returns {number}
         */
        getSIBits: function(n)
        {
            var _this = this;
            var value = _this.getUIBits(n);
            var msb = value & (0x1 << (n-1));
            if (msb) {
                var bitMask = (2 * msb) - 1;
                return  - (value ^ bitMask) - 1;
            }
            return value;
        },

        /**
         * 符号無し 8-bit 整数
         * @returns {number}
         */
        getUI8: function()
        {
            var _this = this;
            _this.byteAlign();
            return _this.data.charCodeAt(_this.byte_offset++) & 0xff;
        },

        /**
         * 符号無し 16-bit 整数
         * @returns {number}
         */
        getUI16: function()
        {
            var _this = this;
            _this.byteAlign();
            var data = _this.data;
            return (data.charCodeAt(_this.byte_offset++) & 0xff |
                    (data.charCodeAt(_this.byte_offset++) & 0xff) << 8);
        },

        /**
         *
         * @returns {number}
         */
        getUI16BE: function()
        {
            var _this = this;
            _this.byteAlign();
            var data = _this.data;
            return (((data.charCodeAt(_this.byte_offset++) & 0xff) << 8) |
                    (data.charCodeAt(_this.byte_offset++) & 0xff));
        },


        /**
         * 符号無し 32-bit 整数
         * @returns {number}
         */
        getUI32: function()
        {
            var _this = this;
            _this.byteAlign();
            var data = _this.data;
            return (data.charCodeAt(_this.byte_offset++) & 0xff |
                    (data.charCodeAt(_this.byte_offset++) & 0xff |
                     (data.charCodeAt(_this.byte_offset++) & 0xff |
                      (data.charCodeAt(_this.byte_offset++) & 0xff)
                      << 8) << 8) << 8);
        },

        /**
         * 符号無し 16-bit 整数
         * @param data
         * @returns {number}
         */
        toUI16: function(data)
        {
            return  (data.charCodeAt(0) & 0xff)
                + ((data.charCodeAt(1) & 0xff) << 8);
        },

        /**
         * toSI16LE
         * @param data
         * @returns {number}
         */
        toSI16LE: function(data)
        {
            var _this = this;
            var value = _this.toUI16(data);
            if (value < 0x8000) {
                return value;
            }
            return value - 0x10000;
        },

        /**
         * increment
         * @param byteInt
         * @param bitInt
         */
        incrementOffset: function(byteInt, bitInt)
        {
            var _this = this;
            _this.byte_offset += byteInt;
            _this.bit_offset += bitInt;
            _this.byteCarry();
        },

        /**
         * setOffset
         * @param byteInt
         * @param bitInt
         */
        setOffset: function(byteInt, bitInt)
        {
            var _this = this;
            _this.byte_offset = byteInt;
            _this.bit_offset = bitInt;
        },

        /**
         * getEncodedU32
         * @returns {number}
         */
        getEncodedU32: function()
        {
            var _this = this;
            var value = 0;
            for (var i = 0; i < 5; i++) {
                var num = _this.data.charCodeAt(_this.byte_offset++) & 0xff;
                value = value | ((num & 0x7f) << (7 * i));
                if (!(num & 0x80)) {
                    break;
                }
            }
            return value;
        },

        /**
         * readUB
         * @param n
         * @returns {number}
         */
        readUB: function(n)
        {
            var _this = this;
            var value = 0;
            for (var i = 0; i < n; i++) {
                if(_this.bit_offset == 8){
                    _this.bit_buffer = _this.readNumber(1);
                    _this.bit_offset = 0;
                }

                value |= (_this.bit_buffer
                    & (0x01 << _this.bit_offset++) ? 1 : 0) << i;
            }

            return value;
        },

        /**
         * readNumber
         * @returns {number}
         */
        readNumber: function(n)
        {
            var _this = this;
            var value = 0;
            var o = _this.byte_offset;
            var i = o + n;
            while(i > o){
                value = (value << 8) | _this.data.charCodeAt(--i);
            }

            _this.byte_offset += n;
            return value;
        },

        /**
         * readString
         * @param n
         * @returns {string}
         */
        readString: function(n)
        {
            var _this = this;
            var chars = [];
            var data = _this.data;
            var bo = _this.byte_offset;
            var i = (n != undefined)
                ? n
                : data.length - bo;

            while (i--) {
                chars[chars.length] =
                    _fromCharCode(data.charCodeAt(bo++) & 0xff);
            }

            _this.byte_offset = bo;
            return chars.join('');
        },

        /**
         * 圧縮swf対応
         * @returns {*}
         */
        deCompress: function()
        {
            var _this = bitio;
            var compressed = _this.data;
            var bo = _this.byte_offset;
            _this.data = compressed.substr(0, bo)
                + _unzip(compressed, true);

            _this.byte_offset = bo;
        }
    };
    var bitio = new BitIO();

    /**
     * SwfTag
     */
    var SwfTag = function(){};

    /**
     * prototype
     */
    SwfTag.prototype = {
        parse: function()
        {
            var _this = this;
            var frameCount = player.frameCount;
            var dataLength = player.fileLength;

            // parse tag
            var tags = _this.parseTags(dataLength, frameCount, 0);

            var sLen = sounds.length;
            if (sLen) {
                var canvas = _document.getElementById('swf2js');
                canvas.addEventListener('click', function ()
                {
                    canvas.removeEventListener('click', arguments.callee, false);
                    for (var i = sLen; i--;) {
                        var sound = sounds[i];
                        if (sound == undefined) {
                            continue;
                        }
                        sound.Audio.load();
                    }
                }, false);
            }

            // build
            layer[0] = undefined;
            _this.build(tags, true);
        },

        /**
         * build
         * @param tags
         * @param isFirst
         */
        build: function(tags, isFirst)
        {
            var _this = swftag;
            var _build = _this.build;
            var _showFrame = _this.showFrame;
            var _buttonBuild = _this.buttonBuild;

            var len = tags.length;
            for (var frame = 1; frame < len; frame++) {
                var tag = tags[frame];
                if (tag == undefined) {
                    continue;
                }

                var sprite = tag.sprite;
                if (sprite instanceof Array) {
                    var sLen = sprite.length;
                    for (var s = 0; s < sLen; s++) {
                        var sTags = sprite[s];
                        if (sTags == undefined) {
                            continue;
                        }
                        _build(sTags, false);
                    }
                }

                if (tag.frameCount == 0) {
                    tag.frameCount = 1;
                }

                _showFrame(
                    tag.frame,
                    tag.frameCount,
                    tag.spriteID,
                    tag.cTags,
                    tag.removeObj,
                    tag.actionScript,
                    tag.label,
                    tag.soundCtrls
                );

                // Button Build
                var btnLayer = tag.btnLayer;
                var btnLength = btnLayer.length;
                if (btnLength) {
                    for (var i = btnLength; i--;) {
                        var ButtonId = btnLayer[i];
                        var btnClass = layer[ButtonId];
                        _buttonBuild(btnClass.ButtonCharacters);
                    }
                }

                if (isFirst && tag.spriteID == 0 && frame == 1) {
                    // set
                    var _layer = layer[0];
                    var Xmax = player.Xmax;
                    var Xmin = (player.Xmin > 0)
                        ? player.Xmin
                        : player.Xmin * -1;

                    var Ymax = player.Ymax;
                    var Ymin = (player.Ymin > 0)
                        ? player.Ymin
                        : player.Ymin * -1;

                    _layer._width = Xmax - Xmin;
                    _layer._height = Ymax - Ymin;

                    delete _layer.Xmax;
                    delete _layer.Xmin;
                    delete _layer.Ymax;
                    delete _layer.Ymin;

                    player.layer = _layer;

                    // Canvasの画面サイズを調整
                    _changeScreenSize();

                    // reset
                    if (imgLoadCount == 0
                        || imgLoadCount == imgLoadCompCount
                    ) {
                        isLoad = true;
                    }

                    if (isLoad) {
                        isLoad = false;
                        _buffer();
                        _deleteCss();
                        isLoad = true;
                    }

                    // 描画開始
                    _swf2js.play();
                    intervalId = _setInterval(_onEnterFrame, player.fps);
                }
            }
        },

        /**
         * generateDefaultTagObj
         * @param frame
         * @param frameCount
         * @param spriteID
         * @returns {{ }}
         */
        generateDefaultTagObj: function (frame, frameCount, spriteID)
        {
            return {
                frame: frame,
                frameCount: frameCount,
                spriteID: spriteID,
                cTags: [],
                removeObj: [],
                actionScript: [],
                label: [],
                sprite: [],
                btnLayer: [],
                soundCtrls: []
            }
        },

        /**
         * parseTags
         * @param dataLength
         * @param frameCount
         * @param spriteID
         * @returns {Array}
         */
        parseTags: function(dataLength, frameCount, spriteID)
        {
            var _this = swftag;
            var _parseTag = _this.parseTag;
            var _addTag = _this.addTag;
            var _generateDefaultTagObj = _this.generateDefaultTagObj;
            var frame = 1;
            var tags = [];
            var tagType = 0;

            // default set
            tags[frame] = _generateDefaultTagObj(
                frame,
                frameCount,
                spriteID
            );

            while (bitio.byte_offset < dataLength) {
                var tagStartOffset = bitio.byte_offset;
                if (tagStartOffset + 2 > dataLength) {
                    break;
                }

                var tagLength = bitio.getUI16();
                tagType = tagLength >> 6;

                // long形式
                var length = tagLength & 0x3f;

                if (length == 0x3f) {
                    if (tagStartOffset + 6 > dataLength) {
                        bitio.byte_offset = tagStartOffset;
                        bitio.bit_offset = 0;
                        break;
                    }
                    length = bitio.getUI32();
                }
                var tagDataStartOffset = bitio.byte_offset;
                if (tagType == 1) {
                    frame++;
                    if (dataLength > tagDataStartOffset + 2) {
                        tags[frame] = _generateDefaultTagObj(
                            frame,
                            frameCount,
                            spriteID
                        );
                    }
                }

                var tag = _parseTag(tagType, length);
                var o = bitio.byte_offset - tagDataStartOffset;
                if (o != length) {
                    if (o < length) {
                        var eat = (length - o);
                        if (eat > 0) {
                            bitio.byte_offset += eat;
                        }
                    }
                }

                if (tag != null) {
                    tags = _addTag(tagType, tags, tag, frame);
                }
                bitio.bit_offset = 0;
            }

            return tags;
        },

        /**
         * parseTag
         * @param tagType
         * @param dataLength
         * @returns {*}
         */
        parseTag: function(tagType, dataLength)
        {
            var _this = swftag;
            var obj = null;

            switch (tagType) {
                case 0: // End
                    break;
                case 1: // ShowFrame
                    break;
                case 2:  // DefineShape
                case 22: // DefineShape2
                case 32: // DefineShape3
                case 83: // DefineShape4
                    if (dataLength < 10) {
                        bitio.byte_offset + dataLength;
                    } else {
                        _this.parseDefineShape(tagType);
                    }
                    break;
                case 9:  // BackgroundColor
                    setBackgroundColor();
                    break;
                case 10: // DefineFont
                case 48: // DefineFont2
                    _this.parseDefineFont(tagType);
                    break;
                case 11: // DefineText
                case 33: // DefineText2
                    _this.parseDefineText(tagType);
                    break;
                case 4: // PlaceObject
                case 26: // PlaceObject2
                case 70: //PlaceObject3
                    obj = _this.parsePlaceObject(tagType, dataLength);
                    break;
                case 37: // DefineEditText
                    _this.parseDefineEditText();
                    break;
                case 39: // DefineSprite
                    obj = _this.parseDefineSprite(
                        bitio.byte_offset + dataLength
                    );
                    break;
                case 12: // DoAction
                    obj = _this.parseDoAction(dataLength, undefined);
                    break;
                case 5: // RemoveObject
                case 28: // RemoveObject2
                    obj =  _this.parseRemoveObject(tagType);
                    break;
                case 7: // DefineButton
                case 34: // DefineButton2
                    obj =  _this.parseDefineButton(tagType, dataLength);
                    break;
                case 43: // FrameLabel
                    obj =  _this.parseFrameLabel();
                    break;
                case 88: // DefineFontName
                    _this.parseDefineFontName();
                    break;
                case 20: // DefineBitsLossless
                case 36: // DefineBitsLossless2
                    _this.parseDefineBitsLossLess(tagType, dataLength);
                    break;
                case 6: // DefineBits
                case 21: // DefineBitsJPEG2
                case 35: // DefineBitsJPEG3
                case 90: // DefineBitsJPEG4
                    _this.parseDefineBits(tagType, dataLength, jpegTables);
                    jpegTables = null;
                    break;
                case 8: // JPEGTables
                    jpegTables = _this.parseJPEGTables(dataLength);
                    break;
                case 56: // ExportAssets
                    _this.parseExportAssets(dataLength);
                    break;
                case 46: // DefineMorphShape
                case 84: // DefineMorphShape2
                    _this.parseDefineMorphShape(tagType);
                    break;
                case 40: // NameCharacter
                    var NameCharacterValue = bitio.getDataUntil("\0");
                    break;
                case 24: // Protect
                    bitio.byteAlign();
                    break;
                case 64: // EnableDebugger2
                    var Reserved = bitio.getUI16(); // Always 0
                    var Password = bitio.getDataUntil('\0');
                    break;
                case 69: // FileAttributes
                    var Reserved = bitio.getUIBit(); // Must be 0
                    var UseDirectBlit = bitio.getUIBit();
                    var UseGPU = bitio.getUIBit();
                    var HasMetadata = bitio.getUIBit();
                    var ActionScropt3 = bitio.getUIBit();
                    var Reserved2 = bitio.getUIBits(3); // Must be 0
                    var UseNetwork = bitio.getUIBit();
                    var Reserved3 = bitio.getUIBits(24); // Must be 0
                    break;
                case 77: // MetaData
                    var MetaData = bitio.getDataUntil('\0');
                    break;
                case 86: // DefineSceneAndFrameLabelData
                    obj = _this.parseDefineSceneAndFrameLabelData();
                    break;
                case 18: // SoundStreamHead
                case 45: // SoundStreamHead2
                    obj = _this.parseSoundStreamHead(tagType);
                    break;
                case 72: // DoABC
                case 82: // DoABC2
                    obj = _this.parseDoABC(tagType, dataLength);
                    break;
                case 76: // SymbolClass
                    obj = _this.parseSymbolClass();
                    break;
                case 14: // DefineSound
                    _this.parseDefineSound(dataLength);
                    break;
                case 15: // StartSound
                case 89: // StartSound2
                    obj = _this.parseStartSound(tagType);
                    break;
                // TODO
                case 3:  // FreeCharacter
                case 13: // DefineFontInfo
                case 16: // StopSound
                case 17: // DefineButtonSound
                case 19: // SoundStreamBlock
                case 23: // DefineButtonCxform
                case 25: // PathsArePostScript
                case 29: // SyncFrame
                case 31: // FreeAll
                case 38: // DefineVideo
                case 41: // ProductInfo
                case 42: // DefineTextFormat
                case 44: // DefineBehavior
                case 47: // FrameTag
                case 49: // GenCommand
                case 50: // DefineCommandObj
                case 51: // CharacterSet
                case 52: // FontRef
                case 53: // DefineFunction
                case 54: // PlaceFunction
                case 55: // GenTagObject
                case 57: // ImportAssets
                case 58: // EnableDebugger
                case 59: // DoInitAction
                case 60: // DefineVideoStream
                case 61: // VideoFrame
                case 62: // DefineFontInfo2
                case 63: // DebugID
                case 65: // ScriptLimits
                case 66: // SetTabIndex
                case 71: // ImportAssets2
                case 73: // DefineFontAlignZones
                case 74: // CSMTextSettings
                case 75: // DefineFont3
                case 78: // DefineScalingGrid
                case 87: // DefineBinaryData
                case 91: // DefineFont4
                case 93: // EnableTelemetry
                    console.log('[base]未対応tagType -> ' + tagType);
                    break;
                case 27: // 27 (invalid)
                case 30: // 30 (invalid)
                case 67: // 67 (invalid)
                case 68: // 68 (invalid)
                case 79: // 79 (invalid)
                case 80: // 80 (invalid)
                case 81: // 81 (invalid)
                case 85: // 85 (invalid)
                case 92: // 92 (invalid)
                    break;
                default: // null
                    break;
            }

            return obj;
        },

        /**
         * addTag
         * @param tagType
         * @param tags
         * @param tag
         * @param frame
         * @returns {*}
         */
        addTag: function (tagType, tags, tag, frame) {
            var tagsArray = tags[frame];
            switch (tagType) {
                case 4:  // PlaceObject
                case 26: // PlaceObject2
                case 70: // PlaceObject3
                    var cTags = tagsArray.cTags;
                    tagsArray.cTags[cTags.length] = tag;
                    break;
                case 39: // DefineSprite
                    var sprite = tagsArray.sprite;
                    tagsArray.sprite[sprite.length] = tag;
                    break;
                case 12: // DoAction
                    var as = tagsArray.actionScript;
                    tagsArray.actionScript[as.length] = tag;
                    break;
                case 5: // RemoveObject
                case 28: // RemoveObject2
                    var removeObj = tagsArray.removeObj;
                    tagsArray.removeObj[removeObj.length] = tag;
                    break;
                case 43: // FrameLabel
                    var label = tagsArray.label;
                    tag.frame = frame;
                    tagsArray.label[label.length] = tag;
                    break;
                case 7: // DefineButton
                case 34: // DefineButton2
                    var btnLayer = tagsArray.btnLayer;
                    tagsArray.btnLayer[btnLayer.length] = tag;
                    break;
                case 15: // StartSound
                case 89: // StartSound2
                    var soundCtrls = tagsArray.soundCtrls;
                    tagsArray.soundCtrls[soundCtrls.length] = tag;
                    break;
            }

            return tags;
        },

        /**
         * showFrame
         * @param frame
         * @param FrameCount
         * @param SpriteID
         * @param cTags
         * @param removeObj
         * @param actionScript
         * @param label
         * @param soundCtrls
         */
        showFrame: function(
            frame, FrameCount, SpriteID, cTags,
            removeObj, actionScript, label, soundCtrls
        ) {
            // SpriteSheet用
            if (isSpriteSheet && frame > totalFrame) {
                totalFrame = frame;
            }

            // コピー対象外の配列
            var depthArray = [];

            // AnimationClass
            if (layer[SpriteID] == undefined) {
                var aClass = new AnimationClass();
                aClass.init(SpriteID, FrameCount);
                layer[SpriteID] = aClass;
            } else {
                var aClass = layer[SpriteID];
                if (aClass instanceof AnimationClass
                    && frame > aClass.frameCount
                ) {
                    aClass._totalframes = frame;
                    aClass.frameCount = frame;
                }
            }

            if (aClass instanceof AnimationClass) {
                // remove
                var len = removeObj.length;
                if (len) {
                    var removeFrame = frame-1;
                    var frameTags = aClass.frameTags[removeFrame];
                    if (frameTags != undefined) {
                        for (var i = len; i--;) {
                            var rObj = removeObj[i];
                            if (rObj == undefined) {
                                continue;
                            }

                            var depth = rObj.Depth;
                            var removeTags = frameTags[depth];
                            if (removeTags == undefined) {
                                continue;
                            }

                            if (rObj.CharacterId != undefined
                                && removeTags.CharacterId != rObj.CharacterId
                            ) {
                                continue;
                            }

                            depthArray[depth] = true;
                            var removeClass = removeTags.CloneData;
                            if (removeClass instanceof AnimationClass) {
                                aClass.setRemoveMap(frame, depth, removeClass);
                            }
                        }
                    }
                }

                // add
                var len = cTags.length;
                if (len) {
                    for (var i = len; i--;) {
                        var cTag = cTags[i];
                        if (cTag == undefined) {
                            continue;
                        }

                        // add
                        var depth = cTag.Depth;
                        depthArray[depth] = true;
                        aClass.addFrameTag(frame, cTag, false);

                        // name map
                        var name = cTag.Name;
                        if (name != undefined) {
                            var frameTags = aClass.frameTags[frame];
                            if (frameTags == undefined) {
                                continue;
                            }

                            var depthObj = frameTags[depth];
                            if (depthObj == undefined) {
                                continue;
                            }

                            var cloneData = depthObj.CloneData;
                            aClass.nameMap[name] = cloneData;
                        }
                    }
                }

                // label
                var len = label.length;
                if (len) {
                    for (var i = len; i--;) {
                        var obj = label[i];
                        aClass.setLabel(obj.label, obj.frame);
                    }
                }

                // action script
                var len = actionScript.length;
                if (len) {
                    for (var i = len; i--;) {
                        aClass.setActions(frame, actionScript[i]);
                    }
                }

                // soundCtrls
                var len = soundCtrls.length;
                if (len) {
                    for (var i = len; i--;) {
                        aClass.setSoundCtrls(frame, soundCtrls[i]);
                    }
                }

                // 何もなければ前回のをコピー
                var tags = layer[SpriteID].frameTags[frame - 1];
                if (tags instanceof Array) {
                    var len = tags.length;
                    for (var i = len; i--;) {
                        if (depthArray[i]) {
                            continue;
                        }

                        var tag = tags[i];
                        if (tag == undefined) {
                            continue;
                        }

                        aClass.addFrameTag(frame, tag ,true);
                    }
                }
            }
        },

        /**
         * parseDefineShape
         * @param tagType
         */
        parseDefineShape: function(tagType)
        {
            var _this = swftag;
            var characterId = bitio.getUI16();
            var shapeBounds = _this.rect();
            if (tagType == 83) {
                var EdgeBounds = _this.rect();
                var Reserved = bitio.getUIBits(5);
                var UsesFillWindingRule = bitio.getUIBit();
                var UsesNonScalingStrokes = bitio.getUIBit(1);
                var UsesScalingStrokes = bitio.getUIBit(1);
            }

            var shapes = _this.shapeWithStyle(tagType);
            _this.appendShapeTag(characterId, shapeBounds, shapes);
        },

        /**
         * rect
         * @returns {{Xmin: number, Xmax: number, Ymin: number, Ymax: number}}
         */
        rect: function()
        {
            bitio.byteAlign();
            var nBits = bitio.getUIBits(5);
            return {
                Xmin: bitio.getSIBits(nBits),
                Xmax: bitio.getSIBits(nBits),
                Ymin: bitio.getSIBits(nBits),
                Ymax: bitio.getSIBits(nBits)
            };
        },

        /**
         * shapeWithStyle
         * @param tagType
         * @returns {{fillStyles: {fillStyleCount: number, fillStyles: Array}, lineStyles: {lineStyleCount: number, lineStyles: Array}, NumFillBits: number, NumLineBits: number, ShapeRecords: Array}}
         */
        shapeWithStyle: function(tagType)
        {
            var _this = this;

            if (tagType == 46 || tagType == 84) {
                // MorphShape
                var fillStyles = null;
                var lineStyles = null;
            } else {
                var fillStyles = _this.fillStyleArray(tagType);
                var lineStyles = _this.lineStyleArray(tagType);
            }

            var numBits = bitio.getUI8();
            var NumFillBits = numBits >> 4;
            var NumLineBits = numBits & 0x0f;
            var ShapeRecords = _this.shapeRecords(tagType, {
                FillBits: NumFillBits,
                LineBits: NumLineBits
            });

            return {
                fillStyles: fillStyles,
                lineStyles: lineStyles,
                NumFillBits: NumFillBits,
                NumLineBits: NumLineBits,
                ShapeRecords: ShapeRecords
            };
        },

        /**
         * fillStyleArray
         * @param tagType
         * @returns {{fillStyleCount: number, fillStyles: Array}}
         */
        fillStyleArray: function(tagType)
        {
            var _this = this;
            var fillStyleCount = bitio.getUI8();
            if ((tagType > 2) && (fillStyleCount == 0xff)) {
                fillStyleCount = bitio.getUI16();
            }

            var fillStyles = [];
            for (var i = fillStyleCount; i--;) {
                fillStyles[fillStyles.length] = _this.fillStyle(tagType);
            }

            return {
                fillStyleCount: fillStyleCount,
                fillStyles: fillStyles
            };
        },

        /**
         * fillStyle
         * @param tagType
         * @returns {{}}
         */
        fillStyle: function(tagType)
        {
            var _this = this;
            var obj = {};
            var bitType = bitio.getUI8();
            obj.fillStyleType = bitType;

            switch (bitType) {
                // 単色塗り
                case 0x00:
                    if (tagType == 32 || tagType == 83) {
                        // DefineShape3
                        obj.Color = _this.rgba();
                    } else if (tagType == 46 || tagType == 84) {
                        // DefineMorphShape
                        obj.StartColor = _this.rgba();
                        obj.EndColor = _this.rgba();
                    } else {
                        // DefineShape1or2
                        obj.Color = _this.rgb();
                    }
                    break;
                // 線形グラデーション塗り
                case 0x10:
                // 円形グラデーション塗り
                case 0x12:
                    if (tagType == 46 || tagType == 84) {
                        obj.startGradientMatrix = _this.matrix();
                        obj.endGradientMatrix = _this.matrix();
                        obj.gradient = _this.gradient(tagType);
                    } else {
                        obj.gradientMatrix = _this.matrix();
                        obj.gradient = _this.gradient(tagType);
                    }
                    break;
                // 焦点付き円形グラデーション塗り (SWF 8 以降のみ)
                case 0x13:
                    obj.gradientMatrix = _this.matrix();
                    obj.gradient = _this.focalGradient();
                    break;
                // 繰り返しビットマップ塗り
                case 0x40:
                // クリッピングビットマップ塗り
                case 0x41:
                // スムーズでない繰り返しビットマップ塗り
                case 0x42:
                // スムーズでないクリッピングビットマップ塗り
                case 0x43:
                    obj.bitmapId = bitio.getUI16();
                    obj.cache = false;
                    if (tagType == 46 || tagType == 84) {
                        obj.startBitmapMatrix = _this.matrix();
                        obj.endBitmapMatrix = _this.matrix();
                    } else {
                        obj.bitmapMatrix = _this.matrix();
                    }

                    break;
            }
            return obj;
        },

        /**
         * rgb
         * @returns {{R: number, G: number, B: number}}
         */
        rgb: function()
        {
            return {
                R: bitio.getUI8(),
                G: bitio.getUI8(),
                B: bitio.getUI8()
            };
        },

        /**
         * rgba
         * @returns {{R: number, G: number, B: number, A: number}}
         */
        rgba: function()
        {
            return {
                R: bitio.getUI8(),
                G: bitio.getUI8(),
                B: bitio.getUI8(),
                A: bitio.getUI8() / 255
            };
        },

        /**
         * matrix
         * @returns {{HasScale: number, ScaleX: number, ScaleY: number, HasRotate: number, RotateSkew0: number, RotateSkew1: number, TranslateX: number, TranslateY: number}}
         */
        matrix: function()
        {
            bitio.byteAlign();
            var HasScale = bitio.getUIBit();
            var ScaleX = 1;
            var ScaleY = 1;
            if (HasScale) {
                var nScaleBits = bitio.getUIBits(5);
                ScaleX = bitio.getSIBits(nScaleBits) / 0x10000;
                ScaleY = bitio.getSIBits(nScaleBits) / 0x10000;
            }

            var HasRotate = bitio.getUIBit();
            var RotateSkew0 = 0;
            var RotateSkew1 = 0;
            if (HasRotate) {
                var nRotateBits = bitio.getUIBits(5);
                RotateSkew0 = bitio.getSIBits(nRotateBits) / 0x10000;
                RotateSkew1 = bitio.getSIBits(nRotateBits) / 0x10000;
            }

            var nTranslateBits = bitio.getUIBits(5);
            var TranslateX = bitio.getSIBits(nTranslateBits) / 20;
            var TranslateY = bitio.getSIBits(nTranslateBits) / 20;

            return {
                HasScale: HasScale,
                ScaleX: ScaleX,
                ScaleY: ScaleY,
                HasRotate: HasRotate,
                RotateSkew0: RotateSkew0,
                RotateSkew1: RotateSkew1,
                TranslateX: TranslateX,
                TranslateY: TranslateY
            };
        },

        /**
         * gradient
         * @param tagType
         * @returns {{SpreadMode: number, InterpolationMode: number, NumGradients: number, GradientRecords: Array}}
         */
        gradient: function(tagType)
        {
            bitio.byteAlign();
            var _this = this;
            var SpreadMode = bitio.getUIBits(2);
            var InterpolationMode = bitio.getUIBits(2);
            var NumGradients = bitio.getUIBits(4);

            var GradientRecords = [];
            for (var i = NumGradients; i--;) {
                GradientRecords[GradientRecords.length] =
                    _this.gradientRecord(tagType);
            }

            return {
                SpreadMode: SpreadMode,
                InterpolationMode: InterpolationMode,
                NumGradients: NumGradients,
                GradientRecords: GradientRecords
            };
        },

        /**
         * gradientRecord
         * @param tagType
         * @returns {{Ratio: number, Color: *}}
         */
        gradientRecord: function(tagType)
        {
            var _this = this;
            var Ratio = bitio.getUI8();
            if (tagType < 32) {
                // DefineShape1or2
                var Color = _this.rgb();
            } else {
                // DefineShape3or4
                var Color = _this.rgba();
            }

            return {
                Ratio: Ratio,
                Color: Color
            };
        },

        /**
         * focalGradient
         * @param tagType
         * @returns {{SpreadMode: number, InterpolationMode: number, NumGradients: number, GradientRecords: Array, FocalPoint: number}}
         */
        focalGradient: function()
        {
            bitio.byteAlign();
            var _this = this;
            var SpreadMode = bitio.getUIBits(2);
            var InterpolationMode = bitio.getUIBits(2);
            var numGradients = bitio.getUIBits(4);

            var gradientRecords = [];
            for (var i = numGradients; i--;) {
                gradientRecords[gradientRecords.length] =
                    _this.gradientRecord();
            }
            var FocalPoint = bitio.getUI8();

            return {
                SpreadMode: SpreadMode,
                InterpolationMode: InterpolationMode,
                NumGradients: numGradients,
                GradientRecords: gradientRecords,
                FocalPoint: FocalPoint
            };
        },

        /**
         * lineStyleArray
         * @param tagType
         * @returns {{lineStyleCount: number, lineStyles: Array}}
         */
        lineStyleArray: function(tagType)
        {
            var _this = this;
            var lineStyleCount = bitio.getUI8();
            if ((tagType > 2) && (lineStyleCount == 0xff)) {
                lineStyleCount = bitio.getUI16();
            }

            var array = [];
            for (var i = lineStyleCount; i--;) {
                array[array.length] = _this.lineStyles(tagType);
            }

            return {
                lineStyleCount: lineStyleCount,
                lineStyles: array
            };
        },

        /**
         * lineStyles
         * @param tagType
         * @returns {{Width: number, Color: ({R: number, G: number, B: number, A: number}|{R: number, G: number, B: number})}}
         */
        lineStyles: function(tagType)
        {
            var _this = this;
            var obj = {};
            if (tagType == 46 || tagType == 84) {
                obj = {
                    StartWidth: bitio.getUI16(),
                    EndWidth: bitio.getUI16(),
                    StartColor: _this.rgba(),
                    EndColor: _this.rgba()
                };
            } else {
                obj.Width = bitio.getUI16();
                if (tagType == 83) {
                    // DefineShape4
                    obj.StartCapStyle = bitio.getUIBits(2);
                    obj.JoinStyle = bitio.getUIBits(2);
                    obj.HasFillFlag = bitio.getUIBit();
                    obj.NoHScaleFlag = bitio.getUIBit();
                    obj.NoVScaleFlag = bitio.getUIBit();
                    obj.PixelHintingFlag = bitio.getUIBit();
                    obj.Reserved = bitio.getUIBits(5);
                    obj.NoClose = bitio.getUIBit();
                    obj.EndCapStyle = bitio.getUIBits(2);
                    if (obj.JoinStyle == 2) {
                        obj.MiterLimitFactor = bitio.getUI16();
                    }

                    obj.Color = _this.rgba();
                    if (obj.HasFillFlag == 1) {
                        obj.FillType = _this.fillStyle(tagType);
                    }
                } else if (tagType == 32) {
                    // DefineShape3
                    obj.Color = _this.rgba();
                } else {
                    // DefineShape1or2
                    obj.Color = _this.rgb();

                }
            }

            return obj;
        },

        /**
         * shapeRecords
         * @param tagType
         * @param currentNumBits
         * @returns {Array}
         */
        shapeRecords: function(tagType, currentNumBits)
        {
            var _this = this;
            var shapeRecords = [];
            currentPosition = {x:0, y:0};

            while (true) {
                var first6Bits = bitio.getUIBits(6);
                var shape = 0;

                if (first6Bits & 0x20) {
                    // Edge
                    var numBits = first6Bits & 0x0f;
                    if (first6Bits & 0x10) {
                        // StraigtEdge (11XXXX)
                        shape = _this.straightEdgeRecord(tagType, numBits);
                    } else {
                        // CurvedEdge (10XXXX)
                        shape = _this.curvedEdgeRecord(tagType, numBits);
                    }
                } else if (first6Bits) {
                    // ChangeStyle (0XXXXX)
                    shape =
                        _this.styleChangeRecord(tagType, first6Bits, currentNumBits);
                }

                shapeRecords[shapeRecords.length] = shape;
                if (!shape) {
                    bitio.byteAlign();
                    break;
                }
            }


            return shapeRecords;
        },

        /**
         * straightEdgeRecord
         * @param tagType
         * @param numBits
         * @returns {{ControlX: number, ControlY: number, AnchorX: number, AnchorY: number, isCurved: boolean, isChange: boolean}}
         */
        straightEdgeRecord: function(tagType, numBits)
        {
            var deltaX = 0;
            var deltaY = 0;
            var GeneralLineFlag = bitio.getUIBit();
            if (GeneralLineFlag) {
                deltaX = bitio.getSIBits(numBits + 2);
                deltaY = bitio.getSIBits(numBits + 2);
            } else {
                var VertLineFlag = bitio.getUIBit();
                if (VertLineFlag) {
                    deltaX = 0;
                    deltaY = bitio.getSIBits(numBits + 2);
                } else {
                    deltaX = bitio.getSIBits(numBits + 2);
                    deltaY = 0;
                }
            }

            var AnchorX = deltaX;
            var AnchorY = deltaY;
            if (tagType != 46 && tagType != 84) {
                AnchorX = currentPosition.x + deltaX;
                AnchorY = currentPosition.y + deltaY;
                currentPosition.x = AnchorX;
                currentPosition.y = AnchorY;
            }

            return {
                ControlX: 0,
                ControlY: 0,
                AnchorX: AnchorX,
                AnchorY: AnchorY,
                isCurved: false,
                isChange: false
            };
        },

        /**
         * curvedEdgeRecord
         * @param tagType
         * @param numBits
         * @returns {{ControlX: number, ControlY: number, AnchorX: number, AnchorY: number, isCurved: boolean, isChange: boolean}}
         */
        curvedEdgeRecord: function(tagType, numBits)
        {
            var controlDeltaX = bitio.getSIBits(numBits + 2);
            var controlDeltaY = bitio.getSIBits(numBits + 2);
            var anchorDeltaX = bitio.getSIBits(numBits + 2);
            var anchorDeltaY = bitio.getSIBits(numBits + 2);

            var ControlX  = controlDeltaX;
            var ControlY = controlDeltaY;
            var AnchorX = anchorDeltaX;
            var AnchorY = anchorDeltaY;
            if (tagType != 46 && tagType != 84) {
                ControlX  = currentPosition.x + controlDeltaX;
                ControlY = currentPosition.y + controlDeltaY;
                AnchorX = ControlX + anchorDeltaX;
                AnchorY = ControlY + anchorDeltaY;

                currentPosition.x = AnchorX;
                currentPosition.y = AnchorY;
            }

            return {
                ControlX: ControlX,
                ControlY: ControlY,
                AnchorX: AnchorX,
                AnchorY: AnchorY,
                isCurved: true,
                isChange: false
            };
        },

        /**
         * styleChangeRecord
         * @param tagType
         * @param changeFlag
         * @param currentNumBits
         * @returns {{}}
         */
        styleChangeRecord: function(tagType, changeFlag, currentNumBits)
        {
            var _this = this;
            var obj = {};
            obj.StateNewStyles = (changeFlag >> 4) & 1;
            obj.StateLineStyle = (changeFlag >> 3) & 1;
            obj.StateFillStyle1 = (changeFlag >> 2) & 1;
            obj.StateFillStyle0 = (changeFlag >> 1) & 1;
            obj.StateMoveTo =  changeFlag & 1;
            if (obj.StateMoveTo) {
                var moveBits = bitio.getUIBits(5);
                obj.MoveX = bitio.getSIBits(moveBits);
                obj.MoveY = bitio.getSIBits(moveBits);
                currentPosition.x = obj.MoveX;
                currentPosition.y = obj.MoveY;
            }

            if (obj.StateFillStyle0) {
                obj.FillStyle0 = bitio.getUIBits(currentNumBits.FillBits);
            }
            if (obj.StateFillStyle1) {
                obj.FillStyle1 = bitio.getUIBits(currentNumBits.FillBits);
            }
            if (obj.StateLineStyle) {
                obj.LineStyle = bitio.getUIBits(currentNumBits.LineBits);
            }
            if (obj.StateNewStyles) {
                obj.FillStyles = _this.fillStyleArray(tagType);
                obj.LineStyles = _this.lineStyleArray(tagType);
                var numBits = bitio.getUI8();
                currentNumBits.FillBits = obj.NumFillBits = numBits >> 4;
                currentNumBits.LineBits = obj.NumLineBits = numBits & 0x0f;
            }
            obj.isChange = true;
            return obj;
        },

        /**
         * appendShapeTag
         * @param characterId
         * @param shapeBounds
         * @param shapes
         */
        appendShapeTag: function(characterId, shapeBounds, shapes)
        {
            // フレームをセット
            var _this = this;
            layer[characterId] = {
                data: _this.vectorToCanvas(shapes),
                Xmax: shapeBounds.Xmax / 20,
                Xmin: shapeBounds.Xmin / 20,
                Ymax: shapeBounds.Ymax / 20,
                Ymin: shapeBounds.Ymin / 20
            };
        },

        /**
         * vectorToCanvas
         * @param shapes
         * @returns {*}
         */
        vectorToCanvas: function(shapes)
        {
            var _this = this;
            var i = 0;
            var depth = 0;
            var lineStyle = shapes.lineStyles.lineStyles;
            var fillStyle = shapes.fillStyles.fillStyles;
            var records = shapes.ShapeRecords;
            var AnchorX = 0;
            var AnchorY = 0;
            var ControlX = 0;
            var ControlY = 0;

            var canvasF0Array = [[]];
            var canvasF1Array = [[]];
            var canvasLArray = [[]];

            var fillFlag0 = false;
            var fillFlag1 = false;
            var lineFlag = false;

            var f0Idx = 0;
            var f1Idx = 0;

            var StartX = 0;
            var StartY = 0;

            // 重なり番号
            var stack = 0;

            while (true) {
                var record = records[i];
                if (records[i] == 0) {
                    break;
                }

                if (record.isChange) {
                    // 移動判定
                    if (record.StateMoveTo) {
                        StartX = record.MoveX / 20;
                        StartY = record.MoveY / 20;
                    } else {
                        StartX = AnchorX;
                        StartY = AnchorY;
                    }

                    // 新しい色をセット
                    var StateFillStyle0 = record.StateFillStyle0;
                    var FillStyle0 = record.FillStyle0;
                    var StateFillStyle1 = record.StateFillStyle1;
                    var FillStyle1 = record.FillStyle1;
                    var StateLineStyle = record.StateLineStyle;
                    var LineStyle = record.LineStyle;

                    if (record.StateNewStyles == 1) {
                        // fillStyle
                        if (record.NumFillBits > 0) {
                            var FillStyles = record.FillStyles;
                            fillStyle = FillStyles.fillStyles;
                        }

                        // lineStyle
                        if (record.NumLineBits > 0) {
                            var LineStyles = record.LineStyles;
                            lineStyle = LineStyles.lineStyles;
                        }

                        // fillFlag0
                        if (StateFillStyle0 == 1 && FillStyle0 == 0) {
                            fillFlag0 = false;
                        }

                        // fillFlag1
                        if (StateFillStyle1 == 1 && FillStyle1 == 0) {
                            fillFlag1 = false;
                        }

                        // lineFlag
                        if (StateLineStyle == 1 && LineStyle == 0) {
                            lineFlag = false;
                        }

                        // 上に加算
                        stack++;
                        canvasF0Array[stack] = [];
                        canvasF1Array[stack] = [];
                        canvasLArray[stack] = [];

                        AnchorX = 0;
                        AnchorY = 0;

                        i++;
                        continue;
                    }

                    // 深度
                    depth++;

                    // fill0
                    fillFlag0 = ((StateFillStyle0 > 0 && FillStyle0 > 0)
                        || (fillFlag0 && StateFillStyle0 == 0
                            && FillStyle0 == undefined)
                    );
                    if (fillFlag0) {
                        // 色の算出
                        var bitmapObj = null;
                        if (FillStyle0) {
                            f0Idx = (FillStyle0 - 1);
                            var f0ColorObj = fillStyle[f0Idx];
                            var fillStyleType = f0ColorObj.fillStyleType;
                            if (fillStyleType != 0x00
                                && fillStyleType != 0x10
                                && fillStyleType != 0x12
                            ) {
                                bitmapObj = f0ColorObj;
                            }
                        }

                        // 初期設定
                        var f0Base = canvasF0Array[stack];
                        if (f0Base[depth] == undefined) {
                            f0Base[depth] = {
                                StartX: StartX,
                                StartY: StartY,
                                Depth: depth,
                                ColorObj: f0ColorObj,
                                ColorIdx: f0Idx,
                                BitMapObj: bitmapObj,
                                isGradient:
                                    (fillStyleType == 0x10
                                        || fillStyleType == 0x12
                                    ),
                                cArray: [],
                                fArray: []
                            };

                            var f0cArray = f0Base[depth].fArray;
                            f0Base[depth].fArray =
                                _setMoveTo(f0cArray, StartX, StartY);
                        }
                    }

                    // fill1
                    fillFlag1 = ((StateFillStyle1 > 0 && FillStyle1 > 0)
                        || (fillFlag1 && StateFillStyle1 == 0
                        && FillStyle1 == undefined)
                    );
                    if (fillFlag1) {
                        // 色の算出
                        var bitmapObj = null;
                        if (FillStyle1) {
                            f1Idx = (FillStyle1 - 1);
                            var f1ColorObj = fillStyle[f1Idx];
                            var fillStyleType = f1ColorObj.fillStyleType;
                            if (fillStyleType != 0x00
                                && fillStyleType != 0x10
                                && fillStyleType != 0x12
                            ) {
                                bitmapObj = f1ColorObj;
                            }
                        }

                        // 初期設定
                        var f1Base = canvasF1Array[stack];
                        if (f1Base[depth] == undefined) {
                            f1Base[depth] = {
                                StartX: StartX,
                                StartY: StartY,
                                Depth: depth,
                                ColorObj: f1ColorObj,
                                ColorIdx: f1Idx,
                                BitMapObj: bitmapObj,
                                isGradient:
                                    (fillStyleType == 0x10
                                        || fillStyleType == 0x12
                                    ),
                                cArray: [],
                                fArray: []
                            };

                            var f1cArray = f1Base[depth].fArray;
                            f1Base[depth].fArray =
                                _setMoveTo(f1cArray, StartX, StartY);
                        }
                    }

                    // line
                    lineFlag  = ((StateLineStyle > 0 && LineStyle > 0)
                        || (lineFlag
                            && StateLineStyle == 0
                            && LineStyle == undefined
                        )
                    );
                    if (lineFlag) {
                        if (LineStyle) {
                            var nKey   = (LineStyle - 1);
                            var colorObj = lineStyle[nKey];
                            var Width  = lineStyle[nKey].Width / 20;
                        }

                        // 初期設定
                        if (Width > 0) {
                            var lBase = canvasLArray[stack];
                            if (lBase[depth] == undefined) {
                                lBase[depth] = {
                                    StartX: StartX,
                                    StartY: StartY,
                                    Depth: depth,
                                    Width:  Width,
                                    merge: false,
                                    ColorObj: colorObj,
                                    BitMapObj: null,
                                    cArray: [],
                                    fArray: []
                                };

                                var lcArray = lBase[depth].fArray;
                                lBase[depth].fArray =
                                    _setMoveTo(lcArray, StartX, StartY);
                            }
                        } else {
                            lineFlag = false;
                        }
                    }
                } else {
                    AnchorX  = record.AnchorX / 20;
                    AnchorY  = record.AnchorY / 20;
                    ControlX = record.ControlX / 20;
                    ControlY = record.ControlY / 20;

                    // 描画データ
                    var isCurved = record.isCurved;

                    // fill0
                    if (fillFlag0) {
                        var obj = canvasF0Array[stack][depth];
                        obj.EndX = AnchorX;
                        obj.EndY = AnchorY;
                        obj.cArray[obj.cArray.length] = {
                            isCurved: record.isCurved,
                            AnchorX:  AnchorX,
                            AnchorY:  AnchorY,
                            ControlX: ControlX,
                            ControlY: ControlY
                        };

                        var fArray = obj.fArray;
                        if (isCurved) {
                            fArray = _setQuadraticCurveTo(fArray,
                                ControlX, ControlY,
                                AnchorX, AnchorY
                            );
                        } else {
                            fArray = _setLineTo(fArray, AnchorX, AnchorY);
                        }
                    }

                    // fill1
                    if (fillFlag1) {
                        var obj = canvasF1Array[stack][depth];
                        obj.EndX = AnchorX;
                        obj.EndY = AnchorY;
                        obj.cArray[obj.cArray.length] = {
                            isCurved: record.isCurved,
                            AnchorX:  AnchorX,
                            AnchorY:  AnchorY,
                            ControlX: ControlX,
                            ControlY: ControlY
                        };

                        var fArray = obj.fArray;
                        if (isCurved) {
                            fArray = _setQuadraticCurveTo(fArray,
                                ControlX, ControlY,
                                AnchorX, AnchorY
                            );
                        } else {
                            fArray = _setLineTo(fArray, AnchorX, AnchorY);
                        }
                    }

                    // line
                    if (lineFlag) {
                        var obj = canvasLArray[stack][depth];
                        obj.EndX = AnchorX;
                        obj.EndY = AnchorY;
                        obj.cArray[obj.cArray.length] = {
                            isCurved: record.isCurved,
                            AnchorX:  AnchorX,
                            AnchorY:  AnchorY,
                            ControlX: ControlX,
                            ControlY: ControlY
                        };

                        var fArray = obj.fArray;
                        if (isCurved) {
                            fArray = _setQuadraticCurveTo(fArray,
                                ControlX, ControlY,
                                AnchorX, AnchorY
                            );
                        } else {
                            fArray = _setLineTo(fArray, AnchorX, AnchorY);
                        }
                    }
                }

                i++;
            }

            // 色でまとめる
            var F0Array = _this.generateForColor(canvasF0Array);
            var F1Array = _this.generateForColor(canvasF1Array);

            // 反転してマージ
            var len = F0Array.length;
            if (len) {
                for (var s = len; s--;) {
                    var f1ColorArray = F1Array[s];
                    if (f1ColorArray == undefined) {
                        continue;
                    }

                    var colorArray = F0Array[s];
                    var cLen = colorArray.length;
                    for (var c = cLen; c--;) {
                        var f1Colors = f1ColorArray[c];
                        if (f1Colors == undefined) {
                            continue;
                        }

                        var array = colorArray[c];
                        if (array == undefined) {
                            continue;
                        }

                        var aLen = array.length;
                        for (var d = aLen; d--;) {
                            var obj = array[d];
                            if (obj == undefined) {
                                continue;
                            }

                            if (f1Colors[d] == undefined) {
                                f1Colors[d] = _this.fillReverse(obj);
                                delete F0Array[s][c][d];
                            } else {
                                delete F1Array[s][c][d];
                                delete F0Array[s][c][d];
                            }
                        }
                    }
                }
            }

            // 座標調整
            _this.fillMerge(F0Array, canvasLArray);
            _this.fillMerge(F1Array, canvasLArray);

            // 色で集約
            var canvasArray = _this.bundle(F0Array, F1Array);

            // line
            var len = canvasLArray.length;
            for (var s = 0; s < len; s++) {
                if (canvasArray[s] == undefined) {
                    canvasArray[s] = [];
                }

                var array = canvasLArray[s];
                var aLen = array.length;
                for (var d = 0; d < aLen; d++) {
                    var obj = array[d];
                    if (obj == undefined
                        || obj == null
                        || obj.cArray == null
                    ) {
                        continue;
                    }

                    if (canvasArray[s][d] == undefined) {
                        canvasArray[s][d] = [];
                    }

                    // 初期情報
                    var objArray = obj.fArray;
                    objArray = _setLineWidth(objArray, obj.Width / 1.1);
                    objArray = _setLineCap(objArray);
                    objArray = _setLineJoin(objArray);
                    var color = _generateRGBA(obj.ColorObj.Color);
                    objArray = _setStrokeStyle(
                        objArray,
                        color.R, color.G, color.B, color.A, true);
                    objArray = _setBeginPath(objArray, true);
                    objArray = _setStroke(objArray);

                    obj.StartX = _void;
                    obj.StartY = _void;
                    obj.EndX = _void;
                    obj.EndY = _void;
                    obj.cArray = _void;
                    obj.merge = _void;

                    var l = canvasArray[s][d].length;
                    canvasArray[s][d][l] = obj;
                }
            }

            return canvasArray;
        },

        /**
         * bundle
         * @param fill0Array
         * @param fill1Array
         * @returns {Array}
         */
        bundle: function(fill0Array, fill1Array)
        {
            for (var r = 0; r < 2; r++) {
                if (r == 0) {
                    var fArray = fill0Array;
                } else {
                    var fArray = fill1Array;
                }

                var sLen = fArray.length;
                for (var s = 0; s < sLen; s++) {
                    var colorArray = fArray[s];
                    if (colorArray == undefined) {
                        continue;
                    }

                    var cLen = colorArray.length;
                    for (var key = 0; key < cLen; key++) {
                        var array = colorArray[key];
                        if (array == undefined) {
                            continue;
                        }

                        var depth = null;
                        var dLen = array.length;
                        for (var d = 0; d < dLen; d++) {
                            var obj = array[d];
                            if (obj == undefined) {
                                continue;
                            }

                            if (obj == null || obj.cArray == null) {
                                delete fArray[s][key][d];
                                continue;
                            }

                            if (obj.BitMapObj != null) {
                                continue;
                            }

                            if (depth == null) {
                                depth = obj.Depth;
                                continue;
                            }

                            var cArray = obj.cArray;
                            var length = cArray.length;
                            for (var i = 0; i < length; i++) {
                                var value = cArray[i];
                                if (value == undefined) {
                                    continue;
                                }

                                var len = array[depth].cArray.length;
                                array[depth].cArray[len] = value;
                            }

                            var fCArray = obj.fArray;
                            var length = fCArray.length;
                            for (var i = 0; i < length; i++) {
                                var value = fCArray[i];
                                if (value == undefined) {
                                    continue;
                                }

                                var baseArray = array[depth].fArray;
                                baseArray[baseArray.length] = value;
                            }

                            // 使ったので削除
                            delete fArray[s][key][d];
                        }
                    }
                }
            }

            var results = [];
            for (var r = 0; r < 2; r++) {
                if (r == 0) {
                    var fArray = fill0Array;
                } else {
                    var fArray = fill1Array;
                }

                var sLen = fArray.length;
                for (var s = 0; s < sLen; s++) {
                    var stackArray = fArray[s];
                    if (stackArray == undefined) {
                        continue;
                    }

                    if (results[s] == undefined) {
                        results[s] = [];
                    }

                    var cLen = stackArray.length;
                    for (var c = 0; c < cLen; c++) {
                        var array = stackArray[c];
                        if (array == undefined) {
                            continue;
                        }

                        var aLen = array.length;
                        for (var key = 0; key < aLen; key++) {
                            var obj = array[key];
                            if (obj == undefined) {
                                continue;
                            }

                            if (results[s][obj.Depth] == undefined) {
                                results[s][obj.Depth] = [];
                            }

                            var objArray = obj.fArray;
                            if (obj.isGradient) {
                                // Matrix
                                var ColorObj = obj.ColorObj;
                                var Matrix = ColorObj.gradientMatrix;
                                var gradientLogic =
                                    _getGradientLogic(obj, undefined);
                                var len = gradientLogic.length;

                                for (var i = len; i--;) {
                                    objArray.unshift(gradientLogic[i]);
                                }

                                objArray = _setBeginPath(objArray, true);
                                objArray = _setSave(objArray);
                                objArray = _setTransform(
                                    objArray,
                                    Matrix.ScaleX,
                                    Matrix.RotateSkew0,
                                    Matrix.RotateSkew1,
                                    Matrix.ScaleY,
                                    Matrix.TranslateX,
                                    Matrix.TranslateY
                                );

                                objArray = _setClosePath(objArray);
                                objArray = _setFill(objArray);
                                objArray = _setRestore(objArray);
                            } else if (obj.BitMapObj != null) {
                                var bitMapObj = obj.BitMapObj;
                                var Matrix = bitMapObj.bitmapMatrix;
                                var cid = bitMapObj.bitmapId;

                                objArray = _setImage(
                                    objArray, cid
                                );
                                objArray = _setBeginPath(objArray, true);

                                objArray = _setSave(objArray);
                                objArray = _setTransform(
                                    objArray,
                                    (Matrix.ScaleX / 20),
                                    Matrix.RotateSkew0,
                                    Matrix.RotateSkew1,
                                    (Matrix.ScaleY / 20),
                                    Matrix.TranslateX,
                                    Matrix.TranslateY
                                );
                                objArray = _setClosePath(objArray);
                                objArray = _setFill(objArray);
                                objArray = _setRestore(objArray);
                            } else {
                                var color =
                                    _generateRGBA(obj.ColorObj.Color);
                                objArray = _setFillStyle(
                                    objArray,
                                    color.R, color.G, color.B, color.A,
                                    true);
                                objArray = _setBeginPath(objArray, true);
                                objArray = _setClosePath(objArray);
                                objArray = _setFill(objArray);
                            }

                            obj.fArray = objArray;

                            var len = results[s][obj.Depth].length;
                            results[s][obj.Depth][len] = obj;

                            // 未使用のものは削除
                            obj.cArray = _void;
                            obj.StartX = _void;
                            obj.StartY = _void;
                            obj.EndX = _void;
                            obj.EndY = _void;
                            obj.ColorIdx = _void;
                            obj.Depth = _void;
                        }
                    }
                }
            }

            return results;
        },

        /**
         * generateForColor
         * @param fillArray
         * @returns {Array}
         */
        generateForColor: function(fillArray)
        {
            var array = [];
            var len = fillArray.length;
            for (var i = len; i--;) {
                var stackArray = fillArray[i];
                if (array[i] == undefined) {
                    array[i] = [];
                }

                var sLen = stackArray.length;
                for (var s = sLen; s--;) {
                    var obj = stackArray[s];
                    if (obj == undefined) {
                        continue;
                    }

                    var idx = obj.ColorIdx;
                    if (array[i][idx] == undefined) {
                        array[i][idx] = [];
                    }
                    array[i][idx][s] = obj;
                }
            }
            return array;
        },

        /**
         * fillMerge
         * @param fillArray
         * @param canvasLArray
         */
        fillMerge: function(fillArray, canvasLArray)
        {
            var _this = this;
            var sLen = fillArray.length;
            for (var s = 0; s < sLen; s++) {
                var colorArray = fillArray[s];
                var lineArray = canvasLArray[s];

                var cLen = colorArray.length;
                for (var c = 0; c < cLen; c++) {
                    var array = colorArray[c];
                    if (array == undefined) {
                        continue;
                    }

                    var preFill = [];
                    var aLen = array.length;
                    for (var key = 0; key < aLen; key++) {
                        var obj = array[key];
                        if (obj == undefined
                            || obj == null
                            || obj.cArray == null
                            || (obj.StartX == obj.EndX
                                && obj.StartY == obj.EndY)
                        ) {
                           continue;
                        }

                        preFill[preFill.length] = obj;
                    }

                    // preLine
                    var preLine = [];
                    if (lineArray != undefined) {
                        var len = lineArray.length;
                        for (var i = 0; i < len; i++) {
                            var obj = lineArray[i];
                            if (obj == undefined) {
                                continue;
                            }

                            preLine[preLine.length] = obj;
                        }
                    }
                    var lineLength = preLine.length;

                    var cArray = [];
                    var fArray = [];
                    var lArray = [];
                    var flArray = [];

                    var cfArray = [];
                    var cflArray = [];
                    var preCount = preFill.length;
                    if (preCount > 1) {
                        var base  = null;
                        var copy  = null;
                        var total = 0;
                        var count = 0;
                        var limit = 0;
                        var limitCount = 0;

                        while (true) {
                            count++;

                            // 判定元のobject
                            if (base == null) {
                                base  = preFill.shift();
                                total = preFill.length;

                                var sX = base.StartX;
                                var sY = base.StartY;
                                var eX = base.EndX;
                                var eY = base.EndY;

                                // 次が無ければ終了
                                if (total == 0) {
                                    break;
                                }
                            }

                            // 判定するobject
                            copy = preFill.shift();

                            // 開始・終了地点からそれぞれ判定してマージ
                            if (eX == copy.StartX && eY == copy.StartY) {
                                eX = copy.EndX;
                                eY = copy.EndY;

                                var copyArray = copy.cArray;
                                var len = copyArray.length;
                                for (var i = 0; i < len; i++) {
                                    cArray[cArray.length] = copyArray[i];
                                }

                                var copyFArray = copy.fArray;
                                copyFArray.shift();
                                copyFArray.shift();
                                copyFArray.shift();
                                var len = copyFArray.length;
                                for (var i = 0; i < len; i++) {
                                    cfArray[cfArray.length] = copyFArray[i];
                                }

                                // lineがあればマージ
                                var depth = copy.Depth;
                                if (lineLength > 0
                                    && lineArray[depth] != undefined
                                ) {
                                    var lObj = lineArray[depth];
                                    lObj.merge = true;

                                    var lineCArray = lObj.cArray;
                                    var len = lineCArray.length;
                                    for (var i = 0; i < len; i++) {
                                        lArray[lArray.length] = lineCArray[i];
                                    }

                                    var lineFArray = lObj.fArray;
                                    var len = lineFArray.length;
                                    for (var i = 0; i < len; i++) {
                                        cflArray[cflArray.length] =
                                            lineFArray[i];
                                    }
                                }

                                copy.cArray = null;
                                copy.fArray = null;
                                limit = 0;
                                count = 0;
                            } else if (total <= count &&
                                (eX == copy.EndX && eY == copy.EndY
                                || sX == copy.StartX && sY == copy.StartY)
                            ) {
                                eX = copy.StartX;
                                eY = copy.StartY;

                                _this.fillReverse(copy);
                                var copyArray = copy.cArray;
                                var len = copyArray.length;
                                for (var i = 0; i < len; i++) {
                                    cArray[cArray.length] = copyArray[i];
                                }

                                var copyFArray = copy.fArray;
                                copyFArray.shift();
                                copyFArray.shift();
                                copyFArray.shift();
                                var len = copyFArray.length;
                                for (var i = 0; i < len; i++) {
                                    cfArray[cfArray.length] = copyFArray[i];
                                }

                                // lineがあればマージ
                                var depth = copy.Depth;
                                if (lineLength > 0
                                    && lineArray[depth] != undefined
                                ) {
                                    var lObj = lineArray[depth];
                                    lObj.merge = true;
                                    _this.fillReverse(lObj);

                                    var lineCArray = lObj.cArray;
                                    var len = lineCArray.length;
                                    for (var i = 0; i < len; i++) {
                                        lArray[lArray.length] = lineCArray[i];
                                    }

                                    var lineFArray = lObj.fArray;
                                    var len = lineFArray.length;
                                    for (var i = 0; i < len; i++) {
                                        cflArray[cflArray.length] =
                                            lineFArray[i];
                                    }
                                }

                                copy.cArray = null;
                                copy.fArray = null;
                                limit = 0;
                                count = 0;
                            } else {
                                limit++;
                                if (limit > preCount) {
                                    limitCount++;
                                    preFill[preFill.length] = base;

                                    base = copy;
                                    sX = base.StartX;
                                    sY = base.StartY;
                                    eX = base.EndX;
                                    eY = base.EndY;
                                    limit = 0;
                                    count = 0;

                                    // limit
                                    if (limitCount > preCount) {
                                        break;
                                    }
                                } else {
                                    preFill[preFill.length] = copy;
                                }

                                copy = null;
                            }

                            // 判定が終了したらセットして初期化
                            if (sX == eX && sY == eY) {
                                var bCArray = base.cArray;
                                var len = cArray.length;
                                for (var i = 0; i < len; i++) {
                                    bCArray[bCArray.length] = cArray[i];
                                }

                                var bFArray = base.fArray;
                                var len = cfArray.length;
                                for (var i = 0; i < len; i++) {
                                    bFArray[bFArray.length] = cfArray[i];
                                }

                                // line
                                var len = lArray.length;
                                if (len) {
                                    var lObj = lineArray[base.Depth];
                                    if (lObj == undefined) {
                                        lObj = preLine.shift();
                                        lObj.merge = false;
                                    }

                                    var lCArray = lObj.cArray;
                                    for (var i = 0; i < len; i++) {
                                        lCArray[lCArray.length] = lArray[i];
                                    }

                                    var lFArray = lObj.fArray;
                                    var len = lFArray.length;
                                    for (var i = 0; i < len; i++) {
                                        lFArray[lFArray.length] = cflArray[i];
                                    }
                                }

                                // fill
                                cArray = [];
                                fArray = [];
                                cfArray = [];

                                // line
                                lArray = [];
                                flArray = [];
                                cflArray = [];

                                // params
                                count = 0;
                                limit = 0;
                                limitCount = 0;
                                base  = null;
                            }

                            // 終了
                            if (!preFill.length) {
                                break;
                            }
                        }
                    }
                }
            }
        },

        /**
         * fillReverse
         * @param obj
         * @returns {*}
         */
        fillReverse: function(obj)
        {
            var rsX = 0;
            var rsY = 0;
            var copyObj = obj;
            var rnX = copyObj.StartX;
            var rnY = copyObj.StartY;
            var cArray = copyObj.cArray;
            var len = cArray.length;
            var count = len;

            while (count--) {
                var shiftObj = cArray.shift();
                if (shiftObj == null) {
                    continue;
                }

                rsX = shiftObj.AnchorX;
                rsY = shiftObj.AnchorY;
                shiftObj.AnchorX = rnX;
                shiftObj.AnchorY = rnY;
                rnX = rsX;
                rnY = rsY;

                // set
                cArray[cArray.length] = shiftObj;
            }

            // 開始と終了地点を入れ替える
            var StartX = obj.StartX;
            var StartY = obj.StartY;
            var EndX   = obj.EndX;
            var EndY   = obj.EndY;

            obj.StartX = EndX;
            obj.StartY = EndY;
            obj.EndX   = StartX;
            obj.EndY   = StartY;

            // 描画の入れ替え
            var fCArray = [];
            fCArray = _setMoveTo(fCArray, obj.StartX, obj.StartY);

            // 並べ替え
            for (var i = len; i--;) {
                var data = cArray[i];
                if (data.isCurved) {
                    fCArray = _setQuadraticCurveTo(fCArray,
                        data.ControlX, data.ControlY,
                        data.AnchorX, data.AnchorY
                    );
                } else {
                    fCArray = _setLineTo(fCArray,
                        data.AnchorX, data.AnchorY
                    );
                }
            }
            obj.fArray = fCArray;

            return obj;
        },

        /**
         * parseDefineBitsLossLess
         * @param tagType
         * @param length
         */
        parseDefineBitsLossLess: function(tagType, length)
        {
            var startOffset = bitio.byte_offset;
            var cid = bitio.getUI16();
            var format = bitio.getUI8();
            var width = bitio.getUI16();
            var height = bitio.getUI16();

            var isAlpha = (tagType == 36);
            var colorTableSize = 0;
            if (format == 3) {
                colorTableSize = bitio.getUI8() + 1;
            }

            // unCompress
            var sub = bitio.byte_offset - startOffset;
            var compressed = bitio.getData(length - sub);
            var data = _unzip(compressed, false);

            // canvas
            var imageCanvas = baseCanvas.cloneNode(false);
            var imageContext = imageCanvas.getContext('2d');
            var imgData = imageContext.createImageData(width, height);
            var pxData = imgData.data;

            if (format == 5 && !isAlpha) {
                var idx = 0;
                var pxIdx = 0;
                for (var y = height; y--;) {
                    for (var x = width; x--;) {
                        idx++;
                        pxData[pxIdx++] = data[idx++];
                        pxData[pxIdx++] = data[idx++];
                        pxData[pxIdx++] = data[idx++];
                        pxData[pxIdx++] = 255;
                    }
                }
            } else {
                var bpp = (isAlpha) ? 4 : 3;
                var pxIdx = 0;
                var cmIdx = colorTableSize * bpp;
                var pad = (colorTableSize)
                    ? ((width + 3) & ~3) - width
                    : 0;

                for (var y = height; y--;) {
                    for (var x = width; x--;) {
                        var idx = (colorTableSize)
                            ? data[cmIdx++] * bpp
                            : cmIdx++ * bpp;

                        if(!isAlpha){
                            pxData[pxIdx++] = data[idx++];
                            pxData[pxIdx++] = data[idx++];
                            pxData[pxIdx++] = data[idx++];
                            idx++;
                            pxData[pxIdx++] = 255;
                        } else {
                            var alpha = (format == 3)
                                ? data[idx+3]
                                : data[idx++];

                            pxData[pxIdx++] = data[idx++] * 255 / alpha | 0;
                            pxData[pxIdx++] = data[idx++] * 255 / alpha | 0;
                            pxData[pxIdx++] = data[idx++] * 255 / alpha | 0;
                            pxData[pxIdx++] = alpha;

                            if (format == 3) {
                                idx++;
                            }
                        }
                    }
                    cmIdx += pad;
                }
            }

            imageCanvas.width = width;
            imageCanvas.height = height;
            imageContext.putImageData(imgData, 0, 0);
            bitMapData[cid] = imageContext;
            layer[cid] = imageContext;
        },

        /**
         * parseExportAssets
         * @param length
         * @returns {{}}
         */
        parseExportAssets: function(length)
        {
            var obj = {};
            obj.Count = bitio.getUI16();
            obj.Tag1 = bitio.getUI16();

            obj.Name = [];
            for (var i = obj.Count; i--;) {
                obj.Name[obj.Name.length] = bitio.getDataUntil("\0");
            }
            obj.TagN = bitio.getUI16();
            obj.NameN = bitio.getDataUntil("\0");
            return obj;
        },

        /**
         * parseJPEGTables
         * @param length
         * @returns {string}
         */
        parseJPEGTables: function(length)
        {
            return  bitio.getData(length);
        },

        /**
         * parseDefineBits
         * @param tagType
         * @param length
         * @param jpegTables
         */
        parseDefineBits: function(tagType, length, jpegTables)
        {
            var startOffset = bitio.byte_offset;
            var cid = bitio.getUI16();
            var sub = bitio.byte_offset - startOffset;

            var ImageDataLen = length - sub;
            if (tagType == 35 || tagType == 90) {
                ImageDataLen = bitio.getUI32();
            }

            if (tagType == 90) {
                var DeblockParam = bitio.getUI16();
            }

            var JPEGData = bitio.getData(ImageDataLen);
            var BitmapAlphaData = false;
            if (tagType == 35 || tagType == 90) {
                BitmapAlphaData =
                    bitio.getData(length - sub - ImageDataLen);
            }
            bitio.byte_offset = startOffset + length;

            // clone
            var imageCanvas = baseCanvas.cloneNode(false);
            var imageContext = imageCanvas.getContext('2d');

            // render
            imgLoadCount++;
            var imgObj = new _Image();
            imgObj.onload = function()
            {
                var _this = this;
                var width = _this.width;
                var height = _this.height;

                imageCanvas.width = width;
                imageCanvas.height = height;
                imageContext.drawImage(_this, 0, 0);

                // 半透明対応
                if (BitmapAlphaData) {
                    var data = _unzip(BitmapAlphaData, false);
                    var imgData = imageContext.getImageData(0, 0, width, height);
                    var pxData = imgData.data;
                    var pxIdx = 0;
                    var len = width * height * 4;
                    for (var i = 0; i < len; i++) {
                        pxData[pxIdx + 3] = data[i];
                        pxIdx += 4;
                    }
                    imageContext.putImageData(imgData, 0, 0);
                }
                bitMapData[cid] = imageContext;
                layer[cid] = imageContext;

                // 読み完了カウントアップ
                imgLoadCompCount++;
            }

            var base64 = "data:image/jpeg;base64,"
                + _base64encode(_parseJpegData(JPEGData, jpegTables));
            imgObj.src = base64;
        },

        /**
         * parseDefineFont
         * @returns {boolean}
         */
        parseDefineFont: function(tagType)
        {
            var _this = swftag;
            var obj = {};
            obj.FontId = bitio.getUI16();

            if (tagType == 48) {
                var fontFlags = bitio.getUI8();
                obj.FontFlagsHasLayout = (fontFlags >>> 7) & 1;
                obj.FontFlagsShiftJIS = (fontFlags >>> 6) & 1;
                obj.FontFlagsSmallText = (fontFlags >>> 5) & 1;
                obj.FontFlagsANSI = (fontFlags >>> 4) & 1;
                obj.FontFlagsWideOffsets = (fontFlags >>> 3) & 1;
                obj.FontFlagsWideCodes = (fontFlags >>> 2) & 1;
                obj.FontFlagsItalic = (fontFlags >>> 1) & 1;
                obj.FontFlagsBold  = (fontFlags) & 1;

                obj.LanguageCode = bitio.getUI8();

                obj.FontNameLen = bitio.getUI8();
                if (obj.FontNameLen) {
                    var startOffset = bitio.byte_offset;
                    var fontName =
                        _decodeToShiftJis(bitio.getData(obj.FontNameLen));
                    var switchName = fontName.substr(0, fontName.length - 1);

                    switch (switchName) {
                        case '_sans':
                            obj.FontName = 'sans-serif, Helvetica';
                            break;
                        case '_serif':
                            obj.FontName = 'sans-serif, Times, serif';
                            break;
                        case '_typewriter':
                            obj.FontName = 'monospace';
                            break;
                        default:
                            if (isTouch || !_isFontInstalled(fontName)) {
                                if (obj.FontFlagsBold) {
                                    obj.FontName = 'sans-serif, Futura-CondensedExtraBold';
                                } else  if (obj.FontFlagsItalic) {
                                    obj.FontName = 'sans-serif, Futura-MediumItalic';
                                } else {
                                    obj.FontName = 'sans-serif, Futura-Medium';
                                }
                            } else {
                                obj.FontName = fontName;
                            }
                            break;
                    }
                    bitio.byte_offset = startOffset + obj.FontNameLen;
                }

                var numGlyphs = bitio.getUI16();
                obj.NumGlyphs = numGlyphs;
                if (!numGlyphs) {
                    FontData[obj.FontId] = obj;
                    return false;
                }
            }

            // offset
            var offset = bitio.byte_offset;

            obj.OffsetTable = [];
            if (obj.FontFlagsWideOffsets) {
                for (var i = numGlyphs; i--;) {
                    var len = obj.OffsetTable.length;
                    obj.OffsetTable[len] = bitio.getUI32();
                }
                obj.CodeTableOffset = bitio.getUI32();
            } else {
                for (var i = numGlyphs; i--;) {
                    var len = obj.OffsetTable.length;
                    obj.OffsetTable[len] = bitio.getUI16();
                }
                obj.CodeTableOffset = bitio.getUI16();
            }

            // Shape
            obj.GlyphShapeTable = [];
            for (var i = 0; i < numGlyphs; i++) {
                bitio.setOffset(obj.OffsetTable[i] + offset, 0);

                var numBits = bitio.getUI8();
                var NumFillBits = numBits >> 4;
                var NumLineBits = numBits & 0x0f;

                var currentNumBits = {
                    FillBits: NumFillBits,
                    LineBits: NumLineBits
                };

                var len = obj.GlyphShapeTable.length;
                obj.GlyphShapeTable[len] =
                    _this.shapeRecords(tagType, currentNumBits);
            }

            if (tagType == 48) {
                // 文字情報
                bitio.setOffset(obj.CodeTableOffset + offset, 0);
                obj.CodeTable = [];
                if (obj.FontFlagsWideCodes) {
                    for (var i = numGlyphs; i--;) {
                        var len = obj.CodeTable.length;
                        obj.CodeTable[len] = bitio.getUI16();
                    }
                } else {
                    for (var i = numGlyphs; i--;) {
                        var len = obj.CodeTable.length;
                        obj.CodeTable[len] = bitio.getUI8();
                    }
                }

                if (obj.FontFlagsHasLayout) {
                    obj.FontAscent = bitio.getUI16();
                    obj.FontDescent = bitio.getUI16();
                    obj.FontLeading = bitio.getUI16();

                    obj.FontAdvanceTable = [];
                    for (var i = numGlyphs; i--;) {
                        var len = obj.FontAdvanceTable.length;
                        obj.FontAdvanceTable[len] = bitio.getUI16();
                    }

                    obj.FontBoundsTable = [];
                    for (var i = numGlyphs; i--;) {
                        var len = obj.FontBoundsTable.length;
                        obj.FontBoundsTable[len] = _this.rect();
                    }
                }
            }

            FontData[obj.FontId] = obj;
        },

        /**
         * parseDefineFontName
         */
        parseDefineFontName: function()
        {
            var FontId = bitio.getUI16();
            var FontName = bitio.getDataUntil("\0");
            var FontCopyright = bitio.getDataUntil("\0");
        },

        /**
         * parseDefineText
         * @param tagType
         */
        parseDefineText: function(tagType)
        {
            var _this = swftag;
            var characterId = bitio.getUI16();
            var Bounds = _this.rect();
            var Matrix = _this.matrix();
            var GlyphBits = bitio.getUI8();
            var AdvanceBits = bitio.getUI8();
            var TextRecords = _this.getTextRecords(
                tagType, GlyphBits, AdvanceBits
            );

            // AnimationClass
            var aClass = new AnimationClass();
            aClass.init(characterId, 1);

            aClass.Xmax = Bounds.Xmax / 20;
            aClass.Ymax = Bounds.Ymax / 20;
            aClass.Xmin = Bounds.Xmin / 20;
            aClass.Ymin = Bounds.Ymin / 20;

            var Xmax = aClass.Xmax;
            var Xmin = (aClass.Xmin > 0) ? aClass.Xmin : aClass.Xmin * -1;
            var Ymax = aClass.Ymax;
            var Ymin = (aClass.Ymin > 0) ? aClass.Ymin : aClass.Ymin * -1;
            aClass._width = Xmax - Xmin;
            aClass._height = Ymax - Ymin;

            aClass._x = Matrix.TranslateX;
            aClass._y = Matrix.TranslateY;

            aClass.frameTags[1] = [];
            var frameTags = aClass.frameTags[1];

            var len = TextRecords.length;
            var defineFont = {};
            var textColor = {};
            var textHeight = 0;
            var YOffset = 0;
            var XOffset = 0;
            var gAdvance = 0;

            for (var i = 0; i < len; i++) {
                var textRecord = TextRecords[i];

                // font master
                if (textRecord.FontId != undefined) {
                    gAdvance = 0;
                    defineFont = FontData[textRecord.FontId];
                }

                // text color
                if (textRecord.TextColor != undefined) {
                    textColor = textRecord.TextColor;
                }

                // text height
                if (textRecord.TextHeight != undefined) {
                    textHeight = textRecord.TextHeight;
                }

                var glyphEntries = textRecord.GlyphEntries;
                var count = textRecord.GlyphCount;
                var shapes = {};

                if (textRecord.StyleFlagsHasXOffset) {
                    XOffset = textRecord.XOffset;
                    gAdvance = 0;
                }

                if (textRecord.StyleFlagsHasYOffset) {
                    YOffset = textRecord.YOffset;
                }

                for (var g = 0; g < count; g++) {
                    var glyphEntry = glyphEntries[g];
                    var idx = glyphEntry.GlyphIndex;

                    shapes.ShapeRecords = defineFont.GlyphShapeTable[idx];
                    shapes.lineStyles = {
                        lineStyles: [{
                            Color: textColor,
                            lineStyleType:0
                        }]
                    };
                    shapes.fillStyles = {
                        fillStyles: [{
                            Color: textColor,
                            fillStyleType:0
                        }]
                    };

                    // Matrix
                    var mtx = {
                        HasRotate: Matrix.HasRotate,
                        HasScale: Matrix.HasScale,
                        RotateSkew0: Matrix.RotateSkew0,
                        RotateSkew1: Matrix.RotateSkew1,
                        ScaleX: textHeight / 51,
                        ScaleY: textHeight / 51,
                        TranslateX: Matrix.TranslateX + gAdvance + XOffset,
                        TranslateY: Matrix.TranslateY + YOffset
                    };

                    // tag
                    var tag = {
                        CharacterId: characterId,
                        Depth: g,
                        CloneData: {
                            data: _this.vectorToCanvas(shapes),
                            Xmax: Bounds.Xmax / 20,
                            Xmin: Bounds.Ymax / 20,
                            Ymax: Bounds.Xmin / 20,
                            Ymin: Bounds.Ymin / 20
                        },
                        PlaceFlagHasMatrix: 1,
                        Matrix: mtx,
                        PlaceFlagHasColorTransform: 0,
                        ColorTransform: undefined,
                        PlaceFlagHasClipDepth: 0,
                        ClipDepth: undefined,
                        PlaceFlagHasRatio: 0,
                        Ratio: 0
                    };

                    // push
                    frameTags[frameTags.length] = tag;

                    // x Advance
                    gAdvance += glyphEntry.GlyphAdvance;
                }
            }


            // set
            layer[characterId] = aClass;
        },

        /**
         * @param tagType
         * @param GlyphBits
         * @param AdvanceBits
         * @returns {Array}
         */
        getTextRecords: function(tagType, GlyphBits, AdvanceBits)
        {
            var _this = this;
            var array = [];
            while (bitio.getUI8() != 0) {
                // 1 byte back
                bitio.incrementOffset(-1, 0);

                var obj = {};
                obj.TextRecordType = bitio.getUIBits(1); // Always 1
                obj.StyleFlagsReserved = bitio.getUIBits(3); // Always 0.
                obj.StyleFlagsHasFont = bitio.getUIBits(1);
                obj.StyleFlagsHasColor = bitio.getUIBits(1);
                obj.StyleFlagsHasYOffset = bitio.getUIBits(1);
                obj.StyleFlagsHasXOffset = bitio.getUIBits(1);
                if (obj.StyleFlagsHasFont) {
                    obj.FontId = bitio.getUI16();
                }

                if (obj.StyleFlagsHasColor) {
                    if (tagType == 11) {
                        obj.TextColor = _this.rgb();
                    } else {
                        obj.TextColor = _this.rgba();
                    }
                }

                if (obj.StyleFlagsHasXOffset) {
                    obj.XOffset = bitio.getUI16() / 20;
                }

                if (obj.StyleFlagsHasYOffset) {
                    obj.YOffset = bitio.getUI16() / 20;
                }

                if (obj.StyleFlagsHasFont) {
                    obj.TextHeight = bitio.getUI16() / 20;
                }

                obj.GlyphCount = bitio.getUI8();
                obj.GlyphEntries = _this.getGlyphEntries(
                    obj.GlyphCount, GlyphBits, AdvanceBits
                );

                array[array.length] = obj;
            }

            return array;
        },

        /**
         * getGlyphEntries
         * @param count
         * @param GlyphBits
         * @param AdvanceBits
         * @returns {Array}
         */
        getGlyphEntries: function(count, GlyphBits, AdvanceBits)
        {
            var array = [];
            for (var i = count; i--;) {
                array[array.length] = {
                    GlyphIndex: bitio.getUIBits(GlyphBits),
                    GlyphAdvance: bitio.getSIBits(AdvanceBits) / 20
                };
            }
            return array;
        },

        /**
         * parseDefineEditText
         */
        parseDefineEditText: function()
        {
            var _this = swftag;
            var obj = {};

            obj.CharacterId = bitio.getUI16();
            obj.Bound = _this.rect();

            var flag1 = bitio.getUI8();
            obj.HasText = (flag1 >>> 7) & 1;
            obj.WordWrap = (flag1 >>> 6) & 1;
            obj.Multiline = (flag1 >>> 5) & 1;
            obj.Password = (flag1 >>> 4) & 1;
            obj.ReadOnly = (flag1 >>> 3) & 1;
            obj.HasTextColor = (flag1 >>> 2) & 1;
            obj.HasMaxLength = (flag1 >>> 1) & 1;
            obj.HasFont =  flag1 & 1;

            var flag2 = bitio.getUI8();
            obj.HasFontClass = (flag2 >>> 7) & 1;
            obj.AutoSize = (flag2 >>> 6) & 1;
            obj.HasLayout = (flag2 >>> 5) & 1;
            obj.NoSelect = (flag2 >>> 4) & 1;
            obj.Border = (flag2 >>> 3) & 1;
            obj.WasStatic = (flag2 >>> 2) & 1;
            obj.HTML = (flag2 >>> 1) & 1;
            obj.UseOutlines =  flag2 & 1;

            if (obj.HasFont) {
                obj.FontID = bitio.getUI16();
                if (obj.HasFontClass) {
                    obj.FontClass = bitio.getDataUntil("\0");
                }
                obj.FontHeight = bitio.getUI16() / 20;
            }

            if (obj.HasTextColor) {
                obj.TextColor = _this.rgba();
            }

            if (obj.HasMaxLength) {
                obj.MaxLength = bitio.getUI16();
            }

            if (obj.HasLayout) {
                obj.Align = bitio.getUI8();
                obj.LeftMargin  = bitio.getUI16() / 20;
                obj.RightMargin = bitio.getUI16() / 20;
                obj.Indent = bitio.getUI16() / 20;
                obj.Leading = bitio.getUI16() / 20;
            }

            var font = FontData[obj.FontID];
            obj.VariableName = bitio.getDataUntil("\0");

            obj.InitialText = '';
            if (obj.HasText) {
                var text = bitio.getDataUntil("\0");
                if (obj.HTML) {
                    console.log(text)
                } else {
                    obj.InitialText = text;
                }
            }

            var Bound = obj.Bound;
            layer[obj.CharacterId] = {
                data: {
                    isText: true,
                    obj: obj,
                    FontName: font.FontName,
                    isGradient: false,
                    ColorObj: obj.TextColor,
                    fArray: _generateText(obj, font.FontName, obj.InitialText)
                },
                Xmax: Bound.Xmax / 20,
                Xmin: Bound.Xmin / 20,
                Ymax: Bound.Ymax / 20,
                Ymin: Bound.Ymin / 20
            };
        },

        /**
         * parseDefineMorphShape
         * @param tagType
         */
        parseDefineMorphShape: function(tagType)
        {
            var _this = swftag;
            var obj = {};
            obj.isMorphShape = true;
            obj.CharacterId = bitio.getUI16();
            obj.StartBounds = _this.rect();
            obj.EndBounds = _this.rect();
            obj.Offset = bitio.getUI32();
            obj.MorphFillStyles = _this.fillStyleArray(tagType);
            obj.MorphLineStyles = _this.lineStyleArray(tagType);
            obj.StartEdges = _this.shapeWithStyle(tagType);

            if (obj.Offset != 0) {
                obj.EndEdges = _this.shapeWithStyle(tagType);

                // 差分を調整
                var startShapeRecords = obj.StartEdges.ShapeRecords;
                var endShapeRecords = obj.EndEdges.ShapeRecords;
                var fixStartRecords = [];
                var fixEndRecords = [];

                var len = _max(
                    startShapeRecords.length,
                    endShapeRecords.length
                );

                var startPosition = {x: 0, y: 0, dx: 0, dy: 0};
                var endPosition = {x: 0, y: 0, dx: 0, dy: 0};

                for (var i = 0; i < len; i++) {
                    var startRecord = startShapeRecords[i];
                    var endRecord = endShapeRecords[i];

                    if (endRecord != undefined) {
                        if (endRecord.StateMoveTo) {
                            endPosition.x = endRecord.MoveX;
                            endPosition.y = endRecord.MoveY;
                        } else if (!endRecord.isChange) {
                            endPosition.dx = endPosition.x + endRecord.AnchorX;
                            endPosition.dx = endPosition.x + endRecord.AnchorY;
                        }
                        fixEndRecords[fixEndRecords.length] = endRecord;
                    }

                    if (startRecord != undefined) {
                        if (startRecord.StateMoveTo) {
                            startPosition.x = startRecord.MoveX;
                            startPosition.y = startRecord.MoveY;
                        } else if (!startRecord.isChange) {
                            startPosition.dx = startPosition.x + startPosition.AnchorX;
                            startPosition.dy = startPosition.y + startPosition.AnchorY;
                        }
                        fixStartRecords[fixStartRecords.length] = startRecord;
                    }

                    if (startRecord == undefined) {
                        startRecord = {
                            isChange: false
                        };
                    }

                    if (endRecord == undefined) {
                        endRecord = {
                            isChange: false
                        };
                    }

                    switch (true) {
                        case (startRecord.StateMoveTo && !endRecord.StateMoveTo):
                            fixEndRecords.splice(
                                fixEndRecords.length - 1, 0, {
                                    MoveX: endPosition.dx,
                                    MoveY: endPosition.dy,
                                    StateMoveTo: 1,
                                    isChange: true
                                });
                            break;
                        case (!startRecord.StateMoveTo && endRecord.StateMoveTo):
                            fixStartRecords.splice(
                                fixStartRecords.length - 1, 0, {
                                    MoveX: startPosition.dx,
                                    MoveY: startPosition.dy,
                                    StateMoveTo: 1,
                                    isChange: true
                                });
                            break;
                        case (startRecord.isChange && !endRecord.isChange):
                            fixEndRecords.splice(
                                fixEndRecords.length - 2, 0, startRecord);
                            break;
                        case (!startRecord.isChange && endRecord.isChange):

                            break;
                    }
                }

                obj.StartEdges.ShapeRecords = fixStartRecords;
                obj.EndEdges.ShapeRecords = fixEndRecords;
            }

            layer[obj.CharacterId] = obj;
        },

        /**
         * generateMorphShape
         * @param cid
         * @param ratio
         * @returns {{data: *, Xmax: number, Xmin: number, Ymax: number, Ymin: number}}
         */
        generateMorphShape: function(cid, ratio)
        {
            var per = ratio / 65535;
            var newShapeRecords = [];

            var _this = swftag;
            var origin = layer[cid];
            var position = {x:0, y:0};

            var morphLineStyles = origin.MorphLineStyles;
            var lineStyles = morphLineStyles.lineStyles;
            var lineStyleCount = morphLineStyles.lineStyleCount;

            var morphFillStyles = origin.MorphFillStyles;
            var fillStyles = morphFillStyles.fillStyles;
            var fillStyleCount = morphFillStyles.fillStyleCount;

            var StartEdges = origin.StartEdges;
            var StartShapeRecords = StartEdges.ShapeRecords;

            var EndEdges = origin.EndEdges;
            var EndShapeRecords = EndEdges.ShapeRecords;

            // 型
            var shapes = {
                NumFillBits: StartEdges.NumFillBits,
                NumLineBits: StartEdges.NumLineBits,
                ShapeRecords: [],
                lineStyles: {
                    lineStyleCount: lineStyleCount,
                    lineStyles: []
                },
                fillStyles: {
                    fillStyleCount: fillStyleCount,
                    fillStyles: []
                }
            };

            var len = StartShapeRecords.length;
            for (var i = 0; i < len; i++) {
                var newRecord = {};
                var StartRecord = StartShapeRecords[i];
                var EndRecord = EndShapeRecords[i];

                if ((i+1) == len) {
                    newShapeRecords[i] = 0;
                    continue;
                }

                if (StartRecord.isChange) {
                    var MoveX = 0;
                    var MoveY = 0;
                    if (StartRecord.StateMoveTo == 1) {
                        if (EndRecord.MoveX == undefined) {
                            console.log(i)
                        }
                        MoveX = StartRecord.MoveX
                            + ((EndRecord.MoveX - StartRecord.MoveX)
                                * per);
                        MoveY = StartRecord.MoveY
                            + ((EndRecord.MoveY - StartRecord.MoveY)
                                * per);
                        position.x = MoveX;
                        position.y = MoveY;
                    }

                    newRecord = {
                        FillStyle0: StartRecord.FillStyle0,
                        FillStyle1: StartRecord.FillStyle1,
                        LineStyle: StartRecord.LineStyle,
                        MoveX: MoveX,
                        MoveY: MoveY,
                        StateFillStyle0: StartRecord.StateFillStyle0,
                        StateFillStyle1: StartRecord.StateFillStyle1,
                        StateLineStyle: StartRecord.StateLineStyle,
                        StateMoveTo: StartRecord.StateMoveTo,
                        StateNewStyles: StartRecord.StateNewStyles,
                        isChange: true
                    };
                } else {
                    var AnchorX = 0;
                    var AnchorY = 0;
                    var ControlX = 0;
                    var ControlY = 0;

                    var startAnchorX = StartRecord.AnchorX;
                    var startAnchorY = StartRecord.AnchorY;
                    var endAnchorX = EndRecord.AnchorX;
                    var endAnchorY = EndRecord.AnchorY;

                    var startControlX = StartRecord.ControlX;
                    var startControlY = StartRecord.ControlY;
                    var endControlX = EndRecord.ControlX;
                    var endControlY = EndRecord.ControlY;

                    if (per > 0 && per < 1
                        && StartRecord.isCurved != EndRecord.isCurved
                    ) {
                        if (!StartRecord.isCurved) {
                            startAnchorX = StartRecord.AnchorX / 2;
                            startAnchorY = StartRecord.AnchorY / 2;
                            startControlX = startAnchorX;
                            startControlY = startAnchorY;
                        }

                        if (!EndRecord.isCurved) {
                            endAnchorX = EndRecord.AnchorX / 2;
                            endAnchorY = EndRecord.AnchorY / 2;
                            endControlX = endAnchorX;
                            endControlY = endAnchorY;
                        }
                    }

                    ControlX = (startControlX + ((endControlX - startControlX)
                        * per)) + position.x;
                    ControlY = (startControlY + ((endControlY - startControlY)
                        * per)) + position.y;
                    AnchorX = (startAnchorX + ((endAnchorX - startAnchorX)
                        * per)) + ControlX;
                    AnchorY = (startAnchorY + ((endAnchorY - startAnchorY)
                        * per)) + ControlY;

                    position.x = AnchorX;
                    position.y = AnchorY;

                    newRecord = {
                        AnchorX: AnchorX,
                        AnchorY: AnchorY,
                        ControlX: ControlX,
                        ControlY: ControlY,
                        isChange: false,
                        isCurved: (StartRecord.isCurved || EndRecord.isCurved)
                    };
                }

                newShapeRecords[i] = newRecord;
            }
            shapes.ShapeRecords = newShapeRecords;

            for (var i = 0; i < lineStyleCount; i++) {
                var EndColor = lineStyles[i].EndColor;
                var StartColor = lineStyles[i].StartColor;
                var color = {
                    R: StartColor.R
                        + _floor((EndColor.R - StartColor.R) * per),
                    G: StartColor.G
                        + _floor((EndColor.G - StartColor.G) * per),
                    B: StartColor.B
                        + _floor((EndColor.B - StartColor.B) * per),
                    A: StartColor.A
                        + _floor((EndColor.A - StartColor.A) * per)
                };

                var EndWidth = lineStyles[i].EndWidth;
                var StartWidth = lineStyles[i].StartWidth;
                shapes.lineStyles.lineStyles[i] = {
                    Width: StartWidth
                        + _floor((EndWidth - StartWidth) * per),
                    Color: color
                };
            }

            for (var i = 0; i < fillStyleCount; i++) {
                var EndColor = fillStyles[i].EndColor;
                var StartColor = fillStyles[i].StartColor;
                var color = {
                    R: StartColor.R
                        + _floor((EndColor.R - StartColor.R) * per),
                    G: StartColor.G
                        + _floor((EndColor.G - StartColor.G) * per),
                    B: StartColor.B
                        + _floor((EndColor.B - StartColor.B) * per),
                    A: StartColor.A
                        + _floor((EndColor.A - StartColor.A) * per)
                };

                shapes.fillStyles.fillStyles[i] = {
                    Color: color,
                    fillStyleType: fillStyles[i].fillStyleType
                }
            }

            var EndBounds = origin.EndBounds;
            var StartBounds = origin.StartBounds;
            var bounds = {
                Xmax: StartBounds.Xmax
                    + ((EndBounds.Xmax - StartBounds.Xmax) * per),
                Xmin: StartBounds.Xmin
                    + ((EndBounds.Xmin - StartBounds.Xmin) * per),
                Ymax: StartBounds.Ymax
                    + ((EndBounds.Ymax - StartBounds.Ymax) * per),
                Ymin: StartBounds.Ymin
                    + ((EndBounds.Ymin - StartBounds.Ymin) * per)
            };

            return {
                data: _this.vectorToCanvas(shapes),
                Xmax: bounds.Xmax / 20,
                Xmin: bounds.Ymax / 20,
                Ymax: bounds.Xmin / 20,
                Ymin: bounds.Ymin / 20,
                isMorphShape: true
            };
        },

        /**
         * parseFrameLabel
         * @returns {{label: string, frame: *}}
         */
        parseFrameLabel: function()
        {
            return {
                label: bitio.getDataUntil("\0"),
                frame: 0
            };
        },

        /**
         * parseRemoveObject
         * @param tagType
         * @returns {*}
         */
        parseRemoveObject: function(tagType)
        {
            // RemoveObject
            if (tagType == 5) {
                return {
                    CharacterId: bitio.getUI16(),
                    Depth: bitio.getUI16()
                }
            }

            // RemoveObject2
            return {Depth: bitio.getUI16()}
        },

        /**
         * parseDefineButton
         * @param tagType
         * @param length
         * @return int
         */
        parseDefineButton: function(tagType, length)
        {
            var endOffset = bitio.byte_offset + length;
            var _this = swftag;
            var ButtonId = bitio.getUI16();

            var ActionOffset = 0;
            if (tagType != 7) {
                var ReservedFlags = bitio.getUIBits(7);// Always 0
                var TrackAsMenu = bitio.getUIBits(1);
                ActionOffset = bitio.getUI16();
            }

            // AnimationClass
            var aClass = new AnimationClass();
            aClass.init(ButtonId, 1);
            aClass.isButton = true;
            aClass.ButtonId = ButtonId;
            aClass.ButtonCharacters = _this.buttonCharacters(ButtonId);

            // actionScript
            if (tagType == 7) {
                aClass.setBtnActions(
                    _this.parseDoAction(length, undefined)
                );
                btnLayer[ButtonId] = aClass;
            } else if (ActionOffset > 0) {
                var btnActions = _this.buttonActions(length);

                // action scriptをセット
                aClass.setBtnActions(btnActions.ActionScript);

                // action scriptしてそれ以外をセット
                delete btnActions.ActionScript;
                aClass.ButtonActions = btnActions;

                // btn layerにセット
                btnLayer[ButtonId] = aClass;
            }

            // set layer
            layer[ButtonId] = aClass;

            // set
            bitio.byte_offset = endOffset;

            return ButtonId;
        },

        /**
         * buttonCharacters
         * @param ButtonId
         * @returns {Array}
         */
        buttonCharacters: function(ButtonId)
        {
            var _this = this;
            var array = [];
            var _clone = clone;

            while (bitio.getUI8() != 0) {
                // 1 byte back
                bitio.incrementOffset(-1, 0);

                var aClass = new AnimationClass();
                aClass.init(ButtonId, 1);
                aClass.frameTags[1] = _this.buttonRecord();

                // push
                array[array.length] = aClass;
            }

            return array;
        },

        /**
         *
         * @param btnCharacters
         */
        buttonBuild: function(btnCharacters)
        {
            for (var i = btnCharacters.length; i--;) {
                var aClass = btnCharacters[i];
                var tag = aClass.frameTags[1];
                tag.PlaceFlagHasMatrix = 1;
                tag.PlaceFlagHasColorTransform = 0;
                if (tag.ColorTransform != undefined) {
                    tag.PlaceFlagHasColorTransform = 1;
                }

                tag.PlaceFlagHasRatio = 0;
                tag.PlaceFlagHasClipDepth = 0;
                tag.CloneData = _clone(layer[tag.CharacterId]);
                var cloneData = tag.CloneData;
                if (cloneData instanceof AnimationClass) {
                    cloneData._x = tag.Matrix.TranslateX;
                    cloneData._y = tag.Matrix.TranslateY;
                    tag.Matrix.TranslateX = 0;
                    tag.Matrix.TranslateY = 0;
                }

                aClass.Xmin = _min(aClass.Xmin, cloneData.Xmin);
                aClass.Ymin = _min(aClass.Ymin, cloneData.Ymin);

                var addX = (cloneData.Xmin < 0)
                    ? cloneData.Xmin * -1
                    : cloneData.Xmin;
                var addY = (cloneData.Ymin < 0)
                    ? cloneData.Ymin * -1
                    : cloneData.Ymin;

                if (cloneData instanceof AnimationClass) {
                    addX += cloneData._x;
                    addY += cloneData._y;
                }

                aClass.Xmax = _max(
                    aClass.Xmax,
                    (cloneData.Xmin + cloneData.Xmax + addX)
                );
                aClass.Ymax = _max(
                    aClass.Ymax,
                    (cloneData.Ymin + cloneData.Ymax + addY)
                );
                aClass._width = (aClass.Xmax - aClass.Xmin);
                aClass._height = (aClass.Ymax - aClass.Ymin);
            }
        },

        /**
         *
         * @returns {{}}
         */
        buttonRecord: function()
        {
            var _this = this;
            var obj = {};

            obj.ButtonReserved = bitio.getUIBits(2);

            obj.ButtonHasBlendMode = bitio.getUIBits(1);
            obj.ButtonHasFilterList = bitio.getUIBits(1);

            obj.ButtonStateHitTest = bitio.getUIBits(1);
            obj.ButtonStateDown = bitio.getUIBits(1);
            obj.ButtonStateOver = bitio.getUIBits(1);
            obj.ButtonStateUp = bitio.getUIBits(1);

            obj.CharacterId = bitio.getUI16();
            obj.Depth = bitio.getUI16();
            obj.Matrix = _this.matrix();
            obj.ColorTransform = _this.colorTransform();

            if (obj.ButtonHasBlendMode) {
                obj.BlendMode = bitio.getUI8();
            }
            if (obj.ButtonHasFilterList) {
                obj.FilterList = null;
            }

            return obj;
        },

        /**
         * buttonActions
         * @param length
         * @returns {{}}
         */
        buttonActions: function(length)
        {
            var _this = this;
            var obj = {};

            obj.CondActionSize = bitio.getUI16();
            obj.CondIdleToOverDown = bitio.getUIBits(1);
            obj.CondOutDownToIdle = bitio.getUIBits(1);
            obj.CondOutDownToOverDown = bitio.getUIBits(1);
            obj.CondOverDownToOutDown = bitio.getUIBits(1);
            obj.CondOverDownToOverUp = bitio.getUIBits(1);
            obj.CondOverUpToOverDown = bitio.getUIBits(1);
            obj.CondOverUpToIdle = bitio.getUIBits(1);
            obj.CondIdleToOverUp = bitio.getUIBits(1);

            obj.CondKeyPress = bitio.getUIBits(7);
            obj.CondOverDownToIdle = bitio.getUIBits(1);

            // ActionScript
            obj.ActionScript =
                _this.parseDoAction(
                    length, obj.CondActionSize
                );

            return obj;
        },

        /**
         * parsePlaceObject
         * @param tagType
         * @returns {{}}
         */
        parsePlaceObject: function(tagType, length)
        {
            var _this = swftag;
            var obj = {};
            obj.tagType = tagType;
            var startOffset = bitio.byte_offset;

            if (tagType == 4) {
                obj.CharacterId = bitio.getUI16();
                obj.Depth = bitio.getUI16();
                obj.Matrix = _this.matrix();
                obj.ColorTransform = _this.colorTransform();
            } else {
                var placeFlag = bitio.getUI8();
                obj.PlaceFlagHasClipActions = (placeFlag >> 7) & 0x01;
                obj.PlaceFlagHasClipDepth = (placeFlag >> 6) & 0x01;
                obj.PlaceFlagHasName = (placeFlag >> 5) & 0x01;
                obj.PlaceFlagHasRatio = (placeFlag >> 4) & 0x01;
                obj.PlaceFlagHasColorTransform = (placeFlag >> 3) & 0x01;
                obj.PlaceFlagHasMatrix = (placeFlag >> 2) & 0x01;
                obj.PlaceFlagHasCharacter = (placeFlag >> 1) & 0x01;
                obj.PlaceFlagMove =  placeFlag & 0x01;

                // PlaceObject3
                if (tagType == 70) {
                    placeFlag = bitio.getUI8();
                    obj.Reserved = 0;
                    obj.PlaceFlagHasImage = (placeFlag >> 4) & 0x01;
                    obj.PlaceFlagHasClassName = (placeFlag >> 3) & 0x01;
                    obj.PlaceFlagHasCacheAsBitmap = (placeFlag >> 2) & 0x01;
                    obj.PlaceFlagHasBlendMode = (placeFlag >> 1) & 0x01;
                    obj.PlaceFlagHasFilterList = placeFlag & 0x01;
                }

                obj.Depth = bitio.getUI16();

                if (obj.PlaceFlagHasClassName) {
                    obj.ClassName = bitio.getDataUntil("\0");
                }
                if (obj.PlaceFlagHasCharacter) {
                    obj.CharacterId = bitio.getUI16();
                }
                if (obj.PlaceFlagHasMatrix) {
                    obj.Matrix = _this.matrix();
                }
                if (obj.PlaceFlagHasColorTransform) {
                    obj.ColorTransform = _this.colorTransform();
                }
                if (obj.PlaceFlagHasRatio) {
                    obj.Ratio = bitio.getUI16();
                }
                if (obj.PlaceFlagHasName) {
                    obj.Name = bitio.getDataUntil("\0");
                }
                if (obj.PlaceFlagHasClipDepth) {
                    obj.ClipDepth = bitio.getUI16();
                }
                if (tagType == 70) {
                    if (obj.PlaceFlagHasFilterList) {
                        obj.SurfaceFilterList = _this.getFilterList();
                    }
                    if (obj.PlaceFlagHasBlendMode) {
                        obj.BlendMode = bitio.getUI8();
                    }
                    if (obj.PlaceFlagHasCacheAsBitmap) {
                        obj.BitmapCache = bitio.getUI8();
                    }
                }
                if (obj.PlaceFlagHasClipActions) {
                    // TODO
                    console.log('ClipActions');
                    obj.ClipActions = 0;
                }
            }

            bitio.byte_offset = startOffset + length;
            return obj;
        },

        /**
         * getFilterList
         * @returns {Array}
         */
        getFilterList : function()
        {
            var _this = this;
            var result = [];
            var _getFilter = _this.getFilter;
            var NumberOfFilters = bitio.getUI8();
            for (var i = 0; i < NumberOfFilters; i++) {
                result[result.length] = _getFilter();
            }
            return result;
        },

        /**
         * getFilter TODO
         */
        getFilter: function()
        {
            var type = bitio.getUI8();
            var obj = {Type: type};
            switch (type) {
                case 2:

                    break;
            }
            return obj;
        },

        /**
         * colorTransform
         * @returns {{}}
         */
        colorTransform: function()
        {
            var obj = {};
            bitio.byteAlign();
            var first6bits = bitio.getUIBits(6);
            obj.HasAddTerms = first6bits >> 5;
            obj.HasMultiTerms = (first6bits >> 4) & 1;
            var nbits = first6bits & 0x0f;
            obj.Nbits = nbits;
            if (obj.HasMultiTerms) {
                obj.RedMultiTerm = bitio.getSIBits(nbits);
                obj.GreenMultiTerm = bitio.getSIBits(nbits);
                obj.BlueMultiTerm = bitio.getSIBits(nbits);
                obj.AlphaMultiTerm = bitio.getSIBits(nbits);
            }
            if (obj.HasAddTerms) {
                obj.RedAddTerm = bitio.getSIBits(nbits);
                obj.GreenAddTerm = bitio.getSIBits(nbits);
                obj.BlueAddTerm = bitio.getSIBits(nbits);
                obj.AlphaAddTerm = bitio.getSIBits(nbits);
            }
            return obj;
        },

        /**
         * parseDefineSprite
         * @param dataLength
         */
        parseDefineSprite: function(dataLength)
        {
            var _this = swftag;
            var SpriteID = bitio.getUI16();
            var FrameCount = bitio.getUI16();

            var tags = _this.parseTags(dataLength, FrameCount, SpriteID);

            // AnimationClass
            if (layer[SpriteID] == undefined) {
                var aClass = new AnimationClass();
                aClass.init(SpriteID, FrameCount);
                layer[SpriteID] = aClass;
            }

            return tags;
        },

        /**
         * parseDoAction
         * @param length
         * @param condActionSize
         * @returns {ActionScript}
         */
        parseDoAction: function(length, condActionSize)
        {
            var data = bitio.getData(length - 1);
            var endFlag = bitio.getUI8();
            var condActionSize = (condActionSize == undefined)
                ? 0
                : condActionSize;

            return new ActionScript(data, endFlag, condActionSize);
        },

        /**
         * parseDefineSceneAndFrameLabelData
         * @returns {{}}
         */
        parseDefineSceneAndFrameLabelData: function ()
        {
            var obj = {};
            obj.SceneCount = bitio.getEncodedU32();

            obj.sceneInfo = [];
            for (var i = 0; i < obj.SceneCount; i++) {
                obj.sceneInfo[i] = {
                    offset: bitio.getEncodedU32(),
                    name: _decodeURIComponent(bitio.getDataUntil('\0', false))
                };
            }

            obj.FrameLabelCount = bitio.getEncodedU32();

            obj.frameInfo = [];
            for (var i = 0; i < obj.FrameLabelCount; i++) {
                obj.frameInfo[i] = {
                    num: bitio.getEncodedU32(),
                    label: _decodeURIComponent(bitio.getDataUntil('\0', false))
                };
            }

            return obj;
        },

        /**
         * parseSoundStreamHead
         * @param tagType
         * @returns {{}}
         */
        parseSoundStreamHead: function(tagType)
        {
            var obj = {};
            obj.Reserved = bitio.getUIBits(4); // Always 0

            // 0 = 5.5kHz, 1 = 11kHz, 2 = 22kHz, 3 = 44kHz
            obj.PlaybackSoundRate = bitio.getUIBits(2);

            // 0 = 8-bit, 1 = 16-bit
            obj.PlaybackSoundSize = bitio.getUIBits(1);

            // 0 = Mono, 1 = Stereo
            obj.PlaybackSoundType = bitio.getUIBits(1);

            // 0 = Uncompressed(native-endian)
            // 1 = ADPCM
            // 2 = MP3
            // 3 = Uncompressed(little-endian)
            // 4 = Nellymoser 16 kHz
            // 5 = Nellymoser 8 kHz
            // 6 = Nellymoser
            // 11 = Speex
            obj.StreamSoundCompression = bitio.getUIBits(4);

            // 0 = 5.5kHz, 1 = 11kHz, 2 = 22kHz, 3 = 44kHz
            obj.StreamSoundRate = bitio.getUIBits(2);

            // 0 = 8-bit, 1 = 16-bit
            obj.StreamSoundSize = bitio.getUIBits(1);

            // 0 = Mono, 1 = Stereo
            obj.StreamSoundType = bitio.getUIBits(1);

            obj.StreamSoundSampleCount = bitio.getUI16();

            if (obj.StreamSoundCompression == 2) {
                obj.LatencySeek = bitio.getSIBits(2);
            }

            return obj;
        },

        /**
         * parseDoABC
         * @param tagType
         * @param length
         * @returns {{}}
         */
        parseDoABC: function(tagType, length)
        {
            var obj = {};
            obj.Flags = bitio.getUI32();
            obj.Name = bitio.getDataUntil('\0');
            obj.ABCData = null; // TODO
            return obj;
        },

        /**
         * parseSymbolClass
         * @returns {{}}
         */
        parseSymbolClass: function()
        {
            var obj = {};
            obj.NumSymbols = bitio.getUI16();

            obj.class2tag = {
                symbols: []
            };
            for (var i = 0; i < obj.NumSymbols; i++) {
                var tagId = bitio.getUI16();
                var name = bitio.getDataUntil('\0');
                obj.class2tag.symbols[i] = {
                    tag: tagId,
                    name: name
                }

                if (tagId == 0) {
                    obj.class2tag.topLevelClass = name;
                    continue;
                }
            }

            return obj;
        },

        /**
         * parseDefineSound
         * @param length
         */
        parseDefineSound: function (length)
        {
            var _this = swftag;
            var obj = {};
            var startOffset = bitio.byte_offset;
            obj.SoundId = bitio.getUI16();
            obj.SoundFormat = bitio.getUIBits(4);
            obj.SoundRate = bitio.getUIBits(2);
            obj.SoundSize = bitio.getUIBit();
            obj.SoundType = bitio.getUIBit();
            obj.SoundSampleCount = bitio.getUI32();

            var sub = bitio.byte_offset - startOffset;
            obj.SoundData = bitio.getData(length - sub);
            bitio.byte_offset = startOffset + length;

            var mimeType = '';
            switch (obj.SoundFormat) {
                case 0:
                case 3:
                    mimeType = 'wav';
                    break;
                case 1:
                    mimeType = 'adpcm';
                    break;
                case 2:
                    mimeType = 'mp3';
                    break;
                case 4:
                case 5:
                case 6:
                    mimeType = 'nellymoser';
                    break;
                case 11:
                    mimeType = 'speex';
                    break;
            }
            var audio = new _Audio(
                'data:audio/'+ mimeType +';base64,'
                    + _window.btoa(obj.SoundData)
            );
            audio.onload = function()
            {
                this.load();
                this.preload = 'auto';
                this.autoplay = false;
                this.loop = false;
            }
            obj.Audio = audio;

            sounds[obj.SoundId] = obj;
        },

        /**
         * parseStartSound
         * @param tagType
         * @returns {{}}
         */
        parseStartSound: function(tagType)
        {
            var _this = swftag;
            var obj = {};
            obj.SoundId = bitio.getUI16();
            if (tagType == 89) {
                obj.SoundClassName = bitio.getDataUntil('\0');
            }
            obj.SoundInfo = _this.parseSoundInfo();
            return obj;
        },

        /**
         * parseSoundInfo
         * @returns {{}}
         */
        parseSoundInfo: function()
        {
            var obj = {};
            obj.Reserved = bitio.getUIBits(2);
            obj.SyncStop = bitio.getUIBit();
            obj.SyncNoMultiple = bitio.getUIBit();
            obj.HasEnvelope = bitio.getUIBit();
            obj.HasLoops = bitio.getUIBit();
            obj.HasOutPoint = bitio.getUIBit();
            obj.HasInPoint = bitio.getUIBit();

            if (obj.HasInPoint) {
                obj.InPoint = bitio.getUI32();
            }

            if (obj.HasOutPoint) {
                obj.OutPoint = bitio.getUI32();
            }

            if (obj.HasLoops) {
                obj.LoopCount = bitio.getUI16();
            }

            if (obj.HasEnvelope) {
                obj.EnvPoints = bitio.getUI8();
                obj.EnvelopeRecords = [];
                for (var i = 0; i < obj.EnvPoints; i++) {
                    obj.EnvelopeRecords[i] = {
                        Pos44: bitio.getUI32(),
                        LeftLevel: bitio.getUI16(),
                        RightLevel: bitio.getUI16()
                    };
                }
            }

            return obj;
        }
    };
    var swftag = new SwfTag();

    /**
     * ActionScript
     * @param data
     * @param endFlag
     * @param condActionSize
     * @constructor
     */
    var ActionScript = function(data, endFlag, condActionSize)
    {
        var _this = this;
        _this.data = data;
        _this.endFlag = endFlag;
        _this.condActionSize = condActionSize;
    };

    /**
     * prototype
     */
    ActionScript.prototype = {
        /**
         * start
         * @param obj
         */
        start: function(obj)
        {
            var _this = this;
            var isEnd = false;
            var binary = _this.data;
            var actions_len = binary.length;
            var stack = [];
            var constantPool = '';
            var origin = obj;
            var newBitio = new BitIO();
            var condActionSize = _this.condActionSize;
            var targets = [];

            // BitIO
            var abitio = new BitIO();
            abitio.setData(binary);

            // 開始
            while (abitio.byte_offset < actions_len) {
                var actionCode = abitio.getUI8();
                var actionData = null;

                var startOffset = abitio.byte_offset;
                if (actionCode >= 0x80) {
                    var actionLength = abitio.getUI16();
                    startOffset = abitio.byte_offset;
                    actionData = abitio.getData(actionLength);
                }

                switch (actionCode) {
                    // ********************************************
                    // SWF 3
                    // ********************************************
                    // GotoFrame
                    case 0x81:
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var frame = _floor(newBitio.getUI16()) + 1;
                        if (frame == obj.getFrame()) {
                            break;
                        }

                        if (frame <= 0 || obj.frameCount < frame) {
                            frame = 1;
                        }

                        if (obj.getFrame() > frame) {
                            _resetObj(obj);
                        }

                        obj.setFrame(frame);
                        var ActionScript = obj.actions[frame];
                        if (ActionScript != undefined) {
                            obj.isActionWait = true;
                        }
                        break;
                    // NextFrame
                    case 0x04:
                        obj.nextFrame();
                        var ActionScript = obj.actions[obj.getFrame()];
                        if (ActionScript != undefined) {
                            obj.isActionWait = true;
                        }
                        break;
                    // PreviousFrame
                    case 0x05:
                        obj.previousFrame();
                        obj.isActionWait = true;
                        break;
                    // Play
                    case 0x06:
                        obj.play();
                        break;
                    // Stop
                    case 0x07:
                        obj.stop();
                        break;
                    // ToggleQuality
                    case 0x08:
                        // JavaScriptなので使わない
                        break;
                    // StopSounds
                    case 0x09:
                        var sLen = sounds.length;
                        for (var i = sLen; i--;) {
                            var soundData = sounds[i];
                            var audio = soundData.Audio;
                            audio.stop();
                        }
                        break;
                    // WaitForFrame
                        console.log('WaitForFrame');
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var frame = newBitio.getUI16();
                        var skipCount = newBitio.getUI8();
                        if (origin.getFrame() == frame) {
                            origin.stop();
                        } else {
                            // TODO 未実装

                        }

                        break;
                    case 0x8B: // SetTarget
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var targetName = newBitio.getDataUntil("\0");
                        if (targetName != '') {
                            obj = _this.getAnimationClass(targetName, origin);
                            if (obj != null) {
                                targets[targets.length] = obj;
                            }
                        } else {
                            targets.pop();
                            obj = (targets.length > 0)
                                ? targets[targets.length-1]
                                : origin;
                        }

                        break;
                    // GoToLabel
                    case 0x8C:
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var label = newBitio.getDataUntil("\0");
                        var frame = obj.getLabel(label);
                        if (frame == undefined) {
                            break;
                        }

                        if (obj.getFrame() > frame) {
                            _resetObj(obj);
                        }
                        obj.setFrame(frame);
                        var ActionScript = obj.actions[frame];
                        if (ActionScript != undefined) {
                            obj.isActionWait = true;
                        }

                        break;
                    // GetUrl
                    case 0x83:
                        var params = actionData.split("\0");
                        var urlString = params[0];
                        var targetString = params[1];

                        // 分解してチェック
                        var urls = urlString.split('&');
                        if (urls[1] == undefined) {
                            var str = (targetString.length > 0) ? '?' : '';
                        } else {
                            var str = (targetString.length > 0) ? '&' : '';
                        }

                        var url = urlString + str + targetString;
                        var func = new Function(
                            "location.href = '"+ url +"';"
                        );
                        func();
                        break;

                    // ********************************************
                    // SWF 4
                    // ********************************************

                    // 算術演算 ***********************************
                    // Add
                    case 0x0A:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());
                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        stack[stack.length] = _parseFloat(a+b);

                        break;
                    // Subtract
                    case 0x0B:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());
                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        stack[stack.length] = _parseFloat(b-a);

                        break;
                    // Multiply
                    case 0x0C:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());
                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        stack[stack.length] = _parseFloat(a*b);

                        break;
                    // Divide
                    case 0x0D:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());
                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        stack[stack.length] = _parseFloat(b/a);

                        break;

                    // 数値比較 ***********************************
                    // Equals
                    case 0x0E:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());
                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        var boolInt = (a == b) ? 1 : 0;
                        stack[stack.length] = boolInt;

                        break;
                    // Less
                    case 0x0F:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());

                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        var boolInt = (b < a) ? 1 : 0;
                        stack[stack.length] = boolInt;

                        break;

                    // 論理演算 ***********************************
                    // And
                    case 0x10:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());

                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        var boolInt = (a != 0 && b != 0) ? 1 : 0;
                        stack[stack.length] = boolInt;

                        break;
                    // Or
                    case 0x11:
                        var a = _parseFloat(stack.pop());
                        var b = _parseFloat(stack.pop());

                        // 整数に置き換え
                        if (_isNaN(a)) {
                            a = 0;
                        }
                        if (_isNaN(b)) {
                            b = 0;
                        }

                        var boolInt = (a != 0 || b != 0) ? 1 : 0;
                        stack[stack.length] = boolInt;

                        break;
                    // Not
                    case 0x12:
                        var value = _parseFloat(stack.pop());
                        // 整数に置き換え
                        if (_isNaN(value)) {
                            value = 0;
                        }

                        var boolInt = (value == 0) ? 1 : 0;
                        stack[stack.length] = boolInt;

                        break;

                    // 文字列操作 ***********************************
                    // StringEquals
                    case 0x13:
                        var a = stack.pop();
                        var b = stack.pop();

                        var boolInt = (b == a) ? 1 : 0;
                        stack[stack.length] = boolInt;

                        break;
                    case 0x14: // StringLength
                    case 0x31: // MBStringLength
                        var string = stack.pop() + '';
                        stack[stack.length] = string.length;

                        break;
                    // StringAdd
                    case 0x21:
                        var a = stack.pop();
                        if (a == null) {
                            a = '';
                        }

                        var b = stack.pop();
                        if (b == null) {
                            b = '';
                        }

                        var str = b +""+ a;
                        stack[stack.length] = str;

                        break;
                    case 0x15:// StringExtract
                    case 0x35:// MBStringExtract
                        var count = stack.pop();
                        var index = stack.pop() - 1;
                        if (index < 0) {
                            index = 0;
                        }

                        var string = stack.pop() + '';
                        var str = string.substr(index, count);
                        stack[stack.length] = str;

                        break;
                    // StringLess
                    case 0x29:
                        var a = stack.pop();
                        var b = stack.pop();
                        var boolInt = (b < a) ? 1 : 0;
                        stack[stack.length] = boolInt;
                        break;

                    // スタック操作 ***********************************
                    // Pop
                    case 0x17:
                        stack.pop();
                        break;
                    // Push
                    case 0x96:
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        // stackにpush
                        while (newBitio.byte_offset < actionLength) {
                            var type = newBitio.getUI8();
                            switch (type) {
                                // String
                                case 0:
                                    var string = newBitio.getDataUntil("\0");
                                    if (string == '') {
                                        string = null;
                                    }

                                    stack[stack.length] = string;
                                    break;
                                // Float
                                case 1:
                                    var data = newBitio.getData(4);
                                    var rv = 0;
                                    var i = 0;
                                    for (i = 3; i >= 0; --i) {
                                        rv |= (data.charCodeAt(i) & 0xff) << (i * 8);
                                    }

                                    var sign = rv & 0x80000000;
                                    var exp  = (rv >> 23) & 0xff;
                                    var frac = rv & 0x7fffff;

                                    if (!rv || rv == 0x80000000) {
                                        var float = 0;
                                    } else {
                                        var float = (sign ? -1 : 1)
                                            * (frac | 0x800000)
                                            *  _pow(2, (exp - 127 - 23));
                                    }
                                    stack[stack.length] = _parseFloat(float);
                                    break;
                                default:
                                    break;
                            }
                        }

                        break;

                    // 型変換 ***********************************
                    // AsciiToChar
                    case 0x33:
                        var value = stack.pop();
                        stack[stack.length] = _fromCharCode(value);
                        break;
                    // MBCharToAscii
                    case 0x36:
                        var value = stack.pop() + "";
                        stack[stack.length] = value.charCodeAt(0);
                        break;
                    // MBAsciiToChar
                    case 0x37:
                        var value = stack.pop();
                        stack[stack.length] = _fromCharCode(value);;
                        break;
                    // ToInteger
                    case 0x18:
                        var value = _floor(stack.pop());
                        stack[stack.length] = value;
                        break;
                    // CharToAscii
                    case 0x32:
                        var value = stack.pop() + "";
                        stack[stack.length] = value.charCodeAt(0);
                        break;

                    // フロー制御 ***********************************
                    // Call
                    case 0x9E:
                        var value = stack.pop() + '';
                        var splitData = value.split(':');
                        if (splitData.length > 1) {
                            var aClass =
                                _this.getAnimationClass(splitData[0], origin);
                            if (aClass instanceof AnimationClass) {
                                if (typeof splitData[1] == 'number') {
                                    var frame = splitData[1];
                                } else {
                                    var frame = aClass.getLabel(splitData[1]);
                                }

                                var actionScript = aClass.actions[frame];
                                if (actionScript != undefined) {
                                    var len = actionScript.length;
                                    for (var i = 0; i < len; i++) {
                                        actionScript[i].start(aClass);
                                    }
                                }
                            }
                        } else {
                            if (typeof splitData[0] == 'number') {
                                var frame = splitData[0];
                            } else {
                                var frame = obj.getLabel(splitData[0]);
                            }

                            var actionScript = obj.actions[frame];
                            if (actionScript != undefined) {
                                var len = actionScript.length;
                                for (var i = 0; i < len; i++) {
                                    actionScript[i].start(obj);
                                }
                            }
                        }

                        break;
                    // If
                    case 0x9D:
                        var condition = stack.pop();
                        var offset = abitio.toSI16LE(actionData);
                        if (condition == 1) {
                            abitio.incrementOffset(offset, 0);
                        }

                        break;
                    // Jump
                    case 0x99:
                        var offset = abitio.toSI16LE(actionData);
                        abitio.bit_offset = 0;
                        abitio.incrementOffset(offset, 0);
                        break;

                    // 変数 ***********************************
                    // GetVariable
                    case 0x1C:
                        var name = stack.pop() + '';
                        var splitData = name.split(':');
                        var value = '';

                        if (splitData.length > 1) {
                            var aClass =
                                _this.getAnimationClass(splitData[0], origin);
                            if (aClass instanceof AnimationClass) {
                                value = aClass.getVariable(splitData[1]);
                            }
                        } else {
                            value = obj.getVariable(splitData[0]);
                        }
                        stack[stack.length] = value;

                        break;
                    // SetVariable
                    case 0x1D:
                        var value = stack.pop();
                        var name = stack.pop() + '';
                        var splitData = name.split(':');

                        if (splitData.length > 1) {
                            var aClass =
                                _this.getAnimationClass(splitData[0], origin);
                            if (aClass instanceof AnimationClass) {
                                aClass.setVariable(splitData[1], value);
                            }
                        } else {
                            obj.setVariable(splitData[0], value);
                        }

                        break;

                    // ムービー制御 ***********************************
                    // GetURL2
                    case 0x9A:
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var SendVarsMethod = newBitio.getUIBits(2);// 0=NONE, 1=GET, 2=POST
                        var Reserved = newBitio.getUIBits(4);
                        var LoadTargetFlag = newBitio.getUIBits(1);// 0=web, 1=スプライト
                        var LoadVariablesFlag = newBitio.getUIBits(1);

                        var target = stack.pop();
                        var urlString = stack.pop();
                        if (urlString) {
                            if (LoadTargetFlag == 0) {
                                // 分解してチェック
                                var urls = urlString.split('?');
                                var uLen = urls.length;
                                if (uLen > 2) {
                                    url = urls[0] + '?';
                                    url = url + urls[1];
                                    for (var u = 2; u < uLen; u++) {
                                        var params = urls[u];
                                        url = url +'&'+ params
                                    }
                                } else {
                                    url = urlString;
                                }

                                if (SendVarsMethod == 2) {
                                    // form
                                    var form = _document.createElement('form');
                                    form.action = url;
                                    form.method = 'post';
                                    _document.body.appendChild(form);

                                    var urls = urlString.split('?');
                                    if (urls.length > 1) {
                                        var params = urls[1].split('=');
                                        for(var key in params) {
                                            var input = _document.createElement('input');
                                            input.type = 'hidden';
                                            input.name = key;
                                            input.value = encodeURI(params[key]||'');
                                        }
                                        form.appendChild(input);
                                    }

                                    form.submit();
                                } else {
                                    func = new Function(
                                        "location.href = '"+ url +"';"
                                    );
                                    func();
                                }

                            } else {
                                // TODO
                                console.log('未実装 GetURL2');
                                var aClass = _this.getAnimationClass(target, origin);
                                console.log(target);
                            }
                        }

                        break;
                    // GetProperty
                    case 0x22:
                        var index  = _floor(stack.pop());
                        var target = stack.pop();

                        var targetObj = obj;
                        if (target != null) {
                            targetObj = _this.getAnimationClass(target, origin);
                        }

                        if (targetObj == null) {
                            stack[stack.length] = null;
                            break;
                        }

                        var value = null;
                        switch (index) {
                            case 0:
                                value = targetObj._x;
                                break;
                            case 1:
                                value = targetObj._y;
                                break;
                            case 2:
                                value = targetObj._xscale;
                                break;
                            case 3:
                                value = targetObj._yscale;
                                break;
                            case 4:
                                value = targetObj.getFrame();
                                break;
                            case 5:
                                value = targetObj._totalframes;
                                break;
                            case 6:
                                value = targetObj._alpha;
                                break;
                            case 7:
                                value = targetObj._visible;
                                break;
                            case 8:
                                var xscale = (targetObj._xscale == null)
                                    ? 1
                                    : targetObj._xscale;

                                value = targetObj._width * xscale;
                                break;
                            case 9:
                                var yscale = (targetObj._yscale == null)
                                    ? 1
                                    : targetObj._yscale;

                                value = targetObj._height * yscale;
                                break;
                            case 10:
                                if (_parseFloat(value) > 360) {
                                    value = value - 360;
                                }
                                value = targetObj._rotation;
                                break;
                            case 11:
                                value = targetObj._target;
                                break;
                            case 12:
                                value = targetObj._ramesloaded;
                                break;
                            case 13:
                                value = targetObj.name;
                                break;
                            case 14:
                                value = targetObj._droptarget;
                                break;
                            case 15:
                                value = targetObj._url;
                                break;
                            case 16:
                                value = targetObj._highquality;
                                break;
                            case 17:
                                value = targetObj._focusrect;
                                break;
                            case 18:
                                value = targetObj._soundbuftime;
                                break;
                            case 19:
                                value = targetObj._quality;
                                break;
                            case 20:
                                value = targetObj._xmouse;
                                break;
                            case 21:
                                value = targetObj._ymouse;
                                break;
                        }
                        stack[stack.length] = value;

                        break;
                    // GoToFrame2
                    case 0x9F:
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var Reserved = newBitio.getUIBits(6);
                        var SceneBiasFlag = newBitio.getUIBit();
                        var PlayFlag = newBitio.getUIBit();// 0=stop, 1=play
                        if (SceneBiasFlag == 1) {
                            var SceneBias = newBitio.getUI16();
                        }

                        var frame = stack.pop();
                        if (typeof frame != 'number') {
                            var splitData = frame.split(':');
                            if (splitData.length > 1) {
                                var aClass =
                                    _this.getAnimationClass(splitData[0], origin);
                                if (aClass instanceof AnimationClass) {
                                    frame = aClass.getLabel(splitData[1]);
                                    aClass.setFrame(frame);
                                    if (PlayFlag) {
                                        aClass.play();
                                    } else {
                                        aClass.stop();
                                    }
                                    var ActionScript = aClass.actions[frame];
                                    if (ActionScript != undefined) {
                                        aClass.isActionWait = true;
                                    }
                                }
                            } else {
                                frame = obj.getLabel(splitData[0]);
                                obj.setFrame(frame);
                                if (PlayFlag) {
                                    obj.play();
                                } else {
                                    obj.stop();
                                }
                                var ActionScript = obj.actions[frame];
                                if (ActionScript != undefined) {
                                    obj.isActionWait = true;
                                }
                            }
                        } else {
                            if (frame <= 0 || obj.frameCount < frame) {
                                frame = 1;
                            }

                            if (obj.getFrame() > frame) {
                                _resetObj(obj);
                            }

                            if (frame == obj.getFrame()) {
                                break;
                            }

                            obj.setFrame(frame);

                            if (PlayFlag) {
                                obj.play();
                            } else {
                                obj.stop();
                            }
                            var ActionScript = obj.actions[frame];
                            if (ActionScript != undefined) {
                                obj.isActionWait = true;
                            }
                        }

                        break;
                    case 0x20: // SetTarget2
                        var targetName = stack.pop();
                        obj = _this.getAnimationClass(targetName, origin);
                        if (obj == null) {
                            obj = origin;
                        }
                        break;
                    // SetProperty
                    case  0x23:
                        var value  = stack.pop();
                        var index  = _floor(stack.pop());
                        var target = stack.pop();


                        var targetObj = obj;
                        if (target != null) {
                            targetObj = _this.getAnimationClass(target, origin);
                        }

                        if (targetObj == null) {
                            targetObj = obj;
                            break;
                        }

                        switch (index) {
                            case 0:
                                targetObj._x = _parseFloat(value);
                                break;
                            case 1:
                                targetObj._y = _parseFloat(value);
                                break;
                            case 2:
                                targetObj._xscale = _parseFloat(value) / 100;
                                break;
                            case 3:
                                targetObj._yscale = _parseFloat(value) / 100;
                                break;
                            case 4:
                                targetObj.setFrame(_parseFloat(value));
                                break;
                            case 5:
                                targetObj._totalframes = _parseFloat(value);
                                break;
                            case 6:
                                targetObj._alpha = _parseFloat(value) / 100;
                                break;
                            case 7:
                                targetObj._visible = _parseFloat(value);
                                break;
                            case 8:
                                var v = _parseFloat(value);
                                var per = v / targetObj._width;
                                targetObj._xscale = (targetObj._xscale == null)
                                    ? per
                                    : targetObj._xscale + per;
                                targetObj._width = v;
                                break;
                            case 9:
                                var v = _parseFloat(value);
                                var per = v / targetObj._height;
                                targetObj._yscale = (targetObj._yscale == null)
                                    ? per
                                    : targetObj._yscale + per;
                                targetObj._height = _parseFloat(value);
                                break;
                            case 10:
                                if (_parseFloat(value) > 360) {
                                    value = value - 360;
                                }
                                targetObj._rotation = value;
                                break;
                            case 11:
                                targetObj._target = value;
                                break;
                            case 12:
                                targetObj._ramesloaded = value;
                                break;
                            case 13:
                                targetObj.name = value;
                                break;
                            case 14:
                                targetObj._droptarget = value;
                                break;
                            case 15:
                                targetObj._url = value;
                                break;
                            case 16:
                                targetObj._highquality = value;
                                break;
                            case 17:
                                targetObj._focusrect = value;
                                break;
                            case 18:
                                targetObj._soundbuftime = value;
                                break;
                            case 19:
                                targetObj._quality = value;
                                break;
                            case 20:
                                targetObj._xmouse = value;
                                break;
                            case 21:
                                targetObj._ymouse = value;
                                break;
                        }

                        break;
                    // StartDrag
                    case 0x27:
                        // TODO 未実装
                        console.log('StartDrag');
                        var target = stack.pop();
                        var lockcenter = stack.pop();
                        if (lockcenter) {

                        }

                        var constrain = stack.pop();
                        if (constrain) {
                            var y2 = stack.pop();
                            var x2 = stack.pop();
                            var y1 = stack.pop();
                            var x1 = stack.pop();
                        }

                        break;
                    // WaitForFrame2
                    case 0x8D:
                        // TODO 未実装
                        console.log('WaitForFrame2');
                        var frame = stack.pop();
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var skipCount = newBitio.getUI8();
                        if (obj.getFrame() == frame) {

                        }

                        break;
                    // CloneSprite
                    case 0x24:
                        var depth = stack.pop();
                        var target = stack.pop() + '';
                        var source = stack.pop() + '';

                        var aClass = this.getAnimationClass(source, obj);
                        var cloneClass = _clone(aClass);

                        // 初期化
                        cloneClass._visible = 1;
                        cloneClass.frame = 1;

                        // set
                        obj.nameMap[target] = cloneClass;
                        var frameTags = obj.frameTags;
                        var len = frameTags.length;
                        for (var i = len; i--;) {
                            var array = frameTags[i];
                            if (array == undefined) {
                                continue;
                            }

                            var aLen = array.length;
                            for (var key = aLen; key--;) {
                                var cTag = array[key];
                                if (cTag == undefined) {
                                    continue;
                                }

                                if (cTag.CloneData.cid != aClass.cid) {
                                    continue;
                                }

                                // clone
                                var func = function () {};
                                func.prototype = cTag;
                                var tag = new func();
                                tag.CloneData = cloneClass;
                                tag.Depth = depth;
                                tag.CharacterId = cTag.CharacterId;
                                tag.Matrix = cTag.Matrix;
                                tag.ColorTransform = cTag.ColorTransform;
                                tag.PlaceFlagHasClipDepth = cTag.PlaceFlagHasClipDepth;
                                tag.PlaceFlagHasColorTransform = cTag.PlaceFlagHasColorTransform;
                                tag.PlaceFlagHasMatrix = cTag.PlaceFlagHasMatrix;
                                tag.PlaceFlagHasRatio = cTag.PlaceFlagHasRatio;
                                tag.Ratio = cTag.Ratio;
                                array[depth] = tag;
                            }
                        }

                        break;
                    // RemoveSprite
                    case 0x25:
                        var target = stack.pop() + '';
                        var aClass = this.getAnimationClass(target, obj);
                        var cloneClass = _clone(aClass);
                        if (cloneClass != undefined) {
                            var depth = cloneClass.Depth;
                            var frameTags = obj.frameTags;
                            var len = frameTags.length;
                            for (var i = len; i--;) {
                                var array = frameTags[i];
                                if (array == undefined) {
                                    continue;
                                }
                                delete array[depth];
                            }
                            delete obj.nameMap[target];
                        }

                        break;
                    // EndDrag
                    case 0x28:
                        // TODO 未実装
                        console.log('EndDrag');
                        break;

                    // ユーティリティ ***********************************
                    // GetTime
                    case 0x34:
                        var now = new _Date();
                        stack[stack.length] =
                            now.getTime() - startDate.getTime();
                        break;
                    // RandomNumber
                    case 0x30:
                        var maximum = stack.pop();
                        var randomNumber = _floor(_random() * maximum);
                        stack[stack.length] = randomNumber;
                        break;
                    // Trace
                    case 0x26:
                        var value = stack.pop();
                        console.log('[trace] ' + value);
                        break;
                    case 0x00:
                        isEnd = true;
                        break;
                    case 0x2d: // fscommand2
                        var count = stack.pop();
                        var method = stack.pop();
                        var params = [];

                        var now = new _Date();
                        while (true) {
                            count--;
                            params[count] = stack.pop();
                            if (count == 0) {
                                break;
                            }
                        }

                        switch (method) {
                            case 'GetDateYear':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        now.getFullYear()
                                    );
                                }
                                break;
                            case 'GetDateMonth':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        now.getMonth() + 1
                                    );
                                }
                                break;
                            case 'GetDateDay':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        now.getDate()
                                    );
                                }
                                break;
                            case 'GetDateWeekday':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        now.getDay()
                                    );
                                }
                                break;
                            case 'GetTimeHours':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        now.getHours()
                                    );
                                }
                                break;
                            case 'GetTimeMinutes':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        now.getMinutes()
                                    );
                                }
                                break;
                            case 'GetTimeSeconds':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        now.getSeconds()
                                    );
                                }
                                break;
                            case 'SetQuality':
                                var quality = params.pop();
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        quality
                                    );
                                }
                                break;
                            case 'GetPowerSource':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        0
                                    );
                                }
                                break;
                            case 'GetBatteryLevel':
                            case 'GetMaxBatteryLevel':
                            case 'GetSignalLevel':
                            case 'GetMaxSignalLevel':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        3
                                    );
                                }
                                break;
                            case 'StopVibrate':
                                var value = params.pop();
                                if (value != undefined) {
                                    obj.setVariable(
                                        value,
                                        -1
                                    );
                                }
                                break;
                            default:
                                obj.setVariable(
                                    params.pop(),
                                    -1
                                );
                                break;
                        }
                        break;

                    // TODO SWF5
                    // SWF 5 ***********************************
                    // CallMethod
                    case 0x52:
                        console.log('------------ > CallMethod');

                        console.log(stack);

                        break;
                    case 0x88:
                        console.log('------------ > ConstantPool');
                        newBitio.setData(actionData);
                        newBitio.setOffset(0, 0);

                        var count = newBitio.getUI16();
                        for (var i = 0; i < count; i++) {
                            constantPool += newBitio.readString(i);
                        }
                        console.log(constantPool);
                        break;








                    default:
                        console.log('[actionScript] '+actionCode);
                        break;
                }

                // 終了
                if (isEnd) {
                    break;
                }
            }

            newBitio = void 0;
            abitio = void 0;
            return void 0;
        },

        /**
         * getAnimationClass
         * @param path
         * @param origin
         * @returns {*}
         */
        getAnimationClass: function(path, origin)
        {
            var aClass = player.layer;
            var _path = path + '';
            var splitData = _path.split('/');

            if (splitData instanceof Array) {
                var len = splitData.length;
                for (var i = 0; i < len; i++) {
                    var name = splitData[i];
                    if (name == '') {
                        continue;
                    }

                    if (name == '..') {
                        aClass = origin.parent;
                        continue;
                    }

                    var obj = (i == 0)
                        ? origin
                        : aClass;

                    var classData = obj.nameMap[name];
                    if (classData == undefined) {
                        aClass = null;
                        break;
                    }

                    aClass = classData;
                }
            }

            return aClass;
        }
    };

    /**
     * AnimationClass
     * @constructor
     */
    var AnimationClass = function()
    {
        // param
        this.cid = 0;
        this.frame = 1;
        this.frameCount = 1;

        // cache
        this.cache = null;
        this.isCache = false;

        this.frameTags = [];
        this.variables = [];
        this.removeMap = [];
        this.nameMap = [];
        this.actions = [];
        this.label = [];
        this.soundCtrls = [];

        // 判定用
        this.playFlag = true;
        this.stopFrame = 1;
        this.isButton = false;
        this.viewFlag = true;
        this.isActionWait = false;
        this.isClipDepth = false;
        this.endDepth = 0;
        this.soundPlayFlag = false;

        // Property
        this._x = 0;
        this._y = 0;
        this._xscale = null;
        this._yscale = null;
        this._alpha = 1;
        this._visible = 1;
        this._width = null;
        this._height = null;
        this._rotation = 0;
        this._target = 0;
        this._droptarget = 0;
        this._url = null;
        this._highquality = null;
        this._focusrect = null;
        this._soundbuftime = null;
        this._totalframes = 1;

        // width height用
        this.Xmax = 0;
        this.Xmin = 0;
        this.Ymax = 0;
        this.Ymin = 0;
    };

    AnimationClass.prototype = {
        /**
         * init
         * @param cid
         * @param frameCount
         */
        init: function(cid, frameCount)
        {
            var _this = this;
            _this.cid = cid;
            _this.frameCount = frameCount;
            _this._totalframes = frameCount;
            _this.isCache = (frameCount == 1 && cid > 0);
        },

        /**
         * play
         */
        play: function()
        {
            var _this = this;
            if (!_this.playFlag) {
                _this.playFlag = true;

                if (_this.stopFrame == _this.getFrame()) {
                    _this.nextFrame();
                }
            }
        },

        /**
         * stop
         */
        stop: function()
        {
            var _this = this;
            _this.playFlag = false;
            _this.stopFrame = _this.getFrame();
        },

        /**
         * setView
         */
        setView: function()
        {
            this.viewFlag = true;
        },

        /**
         * putFrame
         */
        putFrame: function()
        {
            var _this = this;
            if (!_this.viewFlag
                || !_this.playFlag
            ) {
                return;
            }

            // 次のフレームへ移動
            _this.nextFrame();

            // リセット
            _this.viewFlag = false;
        },

        /**
         * nextFrame
         */
        nextFrame: function()
        {
            var _this = this;
            var frame = _this.getFrame();
            var frameCount = _this.frameCount;

            frame++;
            if (frame > frameCount) {
                // リセット
                if (frameCount > 1) {
                    var tags = _this.frameTags[frame - 1];
                    if (tags instanceof Array) {
                        var len = tags.length;
                        for (var i = len; i--;) {
                            var tag = tags[i];
                            if (tag == undefined) {
                                continue;
                            }

                            var aClass = tag.CloneData;
                            if (tag.Ratio == 0
                                || !(aClass instanceof AnimationClass)
                            ) {
                                continue;
                            }

                            // 初期化
                            aClass.setFrame(1);
                            aClass.soundPlayFlag = false;
                            aClass.play();
                        }
                    }
                    _this.soundPlayFlag = false;
                }

                // 最初に戻す
                frame = 1;
            }

            _this.setFrame(frame);
        },

        /**
         * previousFrame
         */
        previousFrame: function()
        {
            var _this = this;
            var frame = _this.getFrame();
            frame--;
            if (frame <= 0) {
                frame = 1;
            }
            _this.setFrame(frame);
        },

        /**
         * getFrame
         * @returns {number}
         */
        getFrame: function()
        {
            return this.frame;
        },

        /**
         * setFrame
         * @param frame
         */
        setFrame: function(frame)
        {
            this.frame = frame;
        },

        /**
         * setVariable
         * @param name
         * @param value
         */
        setVariable: function(name, value)
        {
            this.variables[name] = value;
        },

        /**
         * getVariable
         * @param name
         * @returns {*}
         */
        getVariable: function(name)
        {
            return this.variables[name];
        },

        /**
         * setLabel
         * @param name
         * @param frame
         */
        setLabel: function(name, frame)
        {
            this.label[name] = frame;
        },

        /**
         * getLabel
         * @param name
         * @returns {*}
         */
        getLabel: function(name)
        {
            return this.label[name];
        },

        /**
         * setSoundCtrls
         * @param frame
         * @param obj
         */
        setSoundCtrls: function(frame, obj)
        {
            this.soundCtrls[frame] = obj;
        },

        /**
         * getSoundCtrls
         * @param frame
         * @returns {*}
         */
        getSoundCtrls: function(frame)
        {
            return this.soundCtrls[frame];
        },

        /**
         * addFrameTag
         * @param frame
         * @param cTag
         * @param isCopy
         */
        addFrameTag: function(frame, cTag, isCopy)
        {
            var _this = this;

            // frameData
            var frameData = _this.frameTags[frame - 1];

            // depth
            var obj = undefined;
            if (frameData != undefined) {
                obj = frameData[cTag.Depth];
            }

            // CharacterId
            if (cTag.PlaceFlagMove && !cTag.PlaceFlagHasCharacter) {
                cTag.CharacterId = (obj == undefined)
                    ? undefined
                    : obj.CharacterId;
            }

            // error
            if (layer[cTag.CharacterId] == undefined) {
                console.log('ERROR ADD FRAME >>> CHARACTER_ID: '
                    + cTag.CharacterId
                    + ' FRAME: '+ frame
                    + ' DEPTH: '+ cTag.Depth
                );
                return false;
            }

            // フレームを作成
            if (_this.frameTags[frame] == undefined) {
                _this.frameTags[frame] = [];
            }

            var isCopyMatrix = false;
            if (obj != undefined && cTag.PlaceFlagMove) {
                // Matrix
                if (!cTag.PlaceFlagHasMatrix && obj.PlaceFlagHasMatrix) {
                    cTag.Matrix = _clone(obj.Matrix);

                    // 補正
                    if (cTag.PlaceFlagHasCharacter) {
                        if (cTag.Matrix.TranslateX == 0
                            && obj.CloneData._x != 0
                            ) {
                            cTag.Matrix.TranslateX = obj.CloneData._x;
                        }
                        if (cTag.Matrix.TranslateY == 0
                            && obj.CloneData._y != 0
                            ) {
                            cTag.Matrix.TranslateY = obj.CloneData._y;
                        }
                    }

                    cTag.PlaceFlagHasMatrix = obj.PlaceFlagHasMatrix;
                    isCopyMatrix = true;
                }

                // ColorTransform
                if (!cTag.PlaceFlagHasColorTransform
                    && obj.PlaceFlagHasColorTransform
                ) {
                    cTag.ColorTransform = obj.ColorTransform;
                    cTag.PlaceFlagHasColorTransform =
                        obj.PlaceFlagHasColorTransform;
                }

                // Mask
                if (!cTag.PlaceFlagHasClipDepth
                    && obj.PlaceFlagHasClipDepth
                ) {
                    cTag.ClipDepth = obj.ClipDepth;
                    cTag.PlaceFlagHasClipDepth =
                        obj.PlaceFlagHasClipDepth;
                }

                // Ratio
                if (!cTag.PlaceFlagHasRatio && obj.PlaceFlagHasRatio) {
                    cTag.Ratio = obj.Ratio;
                    cTag.PlaceFlagHasRatio = obj.PlaceFlagHasRatio;
                }
            }

            // Ratio
            if (cTag.Ratio == undefined) {
                cTag.Ratio = 0;
            }

            // 新規ならclone
            if (obj == undefined || cTag.PlaceFlagHasCharacter) {
                var cloneData = _clone(layer[cTag.CharacterId]);
                if (cloneData.isMorphShape) {
                    cloneData = swftag.generateMorphShape(
                        cTag.CharacterId, cTag.Ratio
                    );
                }

                if (cloneData instanceof AnimationClass
                    && cTag.PlaceFlagHasMatrix
                ) {
                    cloneData._x = cTag.Matrix.TranslateX;
                    cloneData._y = cTag.Matrix.TranslateY;
                    cTag.Matrix.TranslateX = 0;
                    cTag.Matrix.TranslateY = 0;
                }

                cloneData.parent = _this;
            } else {
                // clone data
                var cloneData = obj.CloneData;
                if (cloneData.isMorphShape) {
                    cloneData = swftag.generateMorphShape(
                        cTag.CharacterId, cTag.Ratio
                    );
                }

                // Matrix調整
                if (cloneData instanceof AnimationClass
                    && cTag.PlaceFlagHasMatrix
                    && !isCopyMatrix && !isCopy
                ) {
                    cTag.Matrix.TranslateX -= cloneData._x;
                    cTag.Matrix.TranslateY -= cloneData._y;
                }
            }

            // width & height
            if (frame == 1) {
                _this.Xmin = _min(_this.Xmin, cloneData.Xmin);
                _this.Ymin = _min(_this.Ymin, cloneData.Ymin);

                var addX = (cloneData.Xmin < 0)
                    ? cloneData.Xmin * -1
                    : cloneData.Xmin;
                var addY = (cloneData.Ymin < 0)
                    ? cloneData.Ymin * -1
                    : cloneData.Ymin;

                if (cloneData instanceof AnimationClass) {
                    addX += cloneData._x;
                    addY += cloneData._y;
                }

                _this.Xmax = _max(
                    _this.Xmax,
                    (cloneData.Xmin + cloneData.Xmax + addX)
                );
                _this.Ymax = _max(
                    _this.Ymax,
                    (cloneData.Ymin + cloneData.Ymax + addY)
                );
                _this._width = (_this.Xmax - _this.Xmin);
                _this._height = (_this.Ymax - _this.Ymin);
            }

            // キャッシュ判定
            var actions = _this.actions;
            if (_this.isCache
                && cloneData instanceof AnimationClass
                && _this.cid > 0
                && actions.length == 0
            ) {
                _this.isCache = cloneData.isCache;
            }

            // tagにセット
            _this.frameTags[frame][cTag.Depth] = {
                CharacterId: cTag.CharacterId,
                CloneData: cloneData,
                Depth: cTag.Depth,
                // Matrix
                PlaceFlagHasMatrix: cTag.PlaceFlagHasMatrix,
                Matrix: cTag.Matrix,
                // ColorTransform
                PlaceFlagHasColorTransform:
                    cTag.PlaceFlagHasColorTransform,
                ColorTransform: cTag.ColorTransform,
                // mask
                PlaceFlagHasClipDepth: cTag.PlaceFlagHasClipDepth,
                ClipDepth: cTag.ClipDepth,
                // Ratio
                PlaceFlagHasRatio: cTag.PlaceFlagHasRatio,
                Ratio: cTag.Ratio
            }
        },

        /**
         * setActions
         * @param frame
         * @param actionScript
         */
        setActions: function(frame, actionScript)
        {
            var actions = this.actions;
            if (actions[frame] == undefined) {
                actions[frame] = [];
            }

            var len = actions[frame].length;
            actions[frame][len] = actionScript;
        },

        /**
         * action
         */
        action: function()
        {
            var _this = this;
            _this.isActionWait = false;
            if (_this.playFlag) {
                _this.actionStart();
            }
        },

        /**
         * actionStart
         */
        actionStart: function()
        {
            var _this = this;
            var frame = _this.getFrame();
            var ActionScript = _this.actions[frame];
            if (ActionScript != undefined) {
                var len = ActionScript.length;
                for (var i = 0; i < len; i++) {
                    ActionScript[i].start(_this);
                }
            }
        },

        /**
         * setBtnActions
         * @param actionScript
         */
        setBtnActions: function(actionScript)
        {
            this.btnActions = actionScript;
        },

        /**
         * btnAction
         * @param obj
         */
        btnAction: function(obj)
        {
            var ActionScript = this.btnActions;
            if (ActionScript != undefined) {
                ActionScript.start(obj, true);
            }
        },

        /**
         * setRemoveMap
         * @param frame
         * @param depth
         * @param removeClass
         */
        setRemoveMap: function(frame, depth, removeClass)
        {
            var _removeMap = this.removeMap;
            if (_removeMap[frame] == undefined) {
                _removeMap[frame] = [];
            }
            _removeMap[frame][depth] = removeClass;
        },

        /**
         * getRemoveMap
         * @param frame
         * @returns {*}
         */
        getRemoveMap: function(frame)
        {
            return this.removeMap[frame];
        }
    }

    /**
     * btn
     *
     * @param aClass
     * @param tag
     * @param transform
     * @param btnTransform
     * @returns {Array}
     */
    function renderBtn(aClass, tag, transform, btnTransform, x, y)
    {
        var ctx;
        var aData = tag.CloneData;
        x += aClass._x;
        y += aClass._y;

        // Matrix
        if (tag.PlaceFlagHasMatrix) {
            var Matrix = tag.Matrix;
            btnTransform[btnTransform.length] = {
                ScaleX: Matrix.ScaleX,
                RotateSkew0: Matrix.RotateSkew0,
                RotateSkew1: Matrix.RotateSkew1,
                ScaleY: Matrix.ScaleY,
                TranslateX: Matrix.TranslateX,
                TranslateY: Matrix.TranslateY
            };
        }

        if (aData instanceof AnimationClass) {
            var tags = aData.frameTags[aData.getFrame()];
            if (tags instanceof Array) {
                var len = tags.length;
                for (var i = 0; i < len; i++) {
                    var aTag = tags[i];
                    if (aTag == undefined) {
                        continue;
                    }
                    _renderBtn(aData, aTag, transform, btnTransform, x, y);
                }
            }
        } else {
            ctx = _drawBtn(aData, transform, btnTransform, x, y);
        }

        if (tag.PlaceFlagHasMatrix) {
            btnTransform.pop();
        }

        return ctx;
    }

    /**
     * drawBtn
     * @param aData
     * @param transform
     * @param btnTransform
     * @returns {*}
     */
    function drawBtn(aData, transform, btnTransform, x, y)
    {
        var sx = x;
        var sy = y;
        var dx = 0;
        var dy = 0;

        // transform
        var len = transform.length;
        for (var i = 0; i < len; i++) {
            var transformObj = transform[i];
            dx = sx * transformObj.ScaleX
                + sy * transformObj.RotateSkew1
                + transformObj.TranslateX;

            dy = sx * transformObj.RotateSkew0
                + sy * transformObj.ScaleY
                + transformObj.TranslateY;

            sx = dx;
            sy = dy;
        }

        var sXmax = aData.Xmax * scale;
        var sYmax = aData.Ymax * scale;
        var sXmin = aData.Xmin * scale;
        var sYmin = aData.Ymin * scale;

        // btnTransform
        var len = btnTransform.length;
        for (var i = 0; i < len; i++) {
            var transformObj = btnTransform[i];
            dx = sXmax * transformObj.ScaleX
                + sYmax * transformObj.RotateSkew1
                + transformObj.TranslateX;

            dy = sXmax * transformObj.RotateSkew0
                + sYmax * transformObj.ScaleY
                + transformObj.TranslateY;

            sXmax = dx;
            sYmax = dy;

            dx = sXmin * transformObj.ScaleX
                + sYmin * transformObj.RotateSkew1
                + transformObj.TranslateX;

            dy = sXmin * transformObj.RotateSkew0
                + sYmin * transformObj.ScaleY
                + transformObj.TranslateY;

            sXmin = dx;
            sYmin = dy;
        }

        dx = sx * scale;
        dy = sy * scale;

        return {
            Xmin: (dx + sXmin),
            Xmax: (dx + sXmax),
            Ymin: (dy + sYmin),
            Ymax: (dy + sYmax)
        };
    }

    /**
     * changeColor
     *
     * @param colorTransform
     * @param aData
     */
    function changeColor(colorTransform, aData)
    {
        var ct = colorTransform;
        var data = aData.data;

        var dLen = data.length;
        for (var i = dLen; i--;) {
            var stack = data[i];
            var sLen = stack.length;
            for (var s = sLen; s--;) {
                var array  = stack[s];
                if (array == undefined) {
                    continue;
                }

                var aLen = array.length;
                for (var a = 0; a < aLen; a++) {
                    var obj = array[a];

                    if (obj.BitMapObj != null) {
                        var colorObj = _generateColor(
                            ct, {R: 255, G: 255, B: 255, A: 1});

                        var bitMapObj = obj.BitMapObj;
                        var cid = bitMapObj.bitmapId;

                        var bitMapCtx = layer[cid];
                        var bitMapCanvas = bitMapCtx.canvas;
                        var w = bitMapCanvas.width;
                        var h = bitMapCanvas.height;

                        if (colorObj.R != 255
                            || colorObj.G != 255
                            || colorObj.B != 255
                        ) {
                            bitMapCtx.globalCompositeOperation = "destination-in";
                            bitMapCtx.fillStyle = "rgb("
                                + colorObj.R + ", "
                                + colorObj.G + ", "
                                + colorObj.B + ")";
                            bitMapCtx.fillRect(0, 0, w, h);
                        }

                        var imageCanvas = baseCanvas.cloneNode(false);
                        var ctx = imageCanvas.getContext('2d');

                        ctx.canvas.width = w;
                        ctx.canvas.height = h;
                        ctx.globalAlpha = colorObj.A;
                        ctx.drawImage(bitMapCanvas, 0, 0);

                        bitMapData[cid] = ctx;
                        continue;
                    }

                    var ColorObj = obj.ColorObj;
                    if (obj.isGradient) {
                        var gradient = ColorObj.gradient;
                        var gradientRecords = gradient.GradientRecords;
                        var colors = [];
                        var gLen = gradientRecords.length;
                        for (var g = 0; g < gLen; g++) {
                            var record = gradientRecords[g];
                            colors[g] = {};
                            colors[g].Ratio = record.Ratio;
                            colors[g].Color = _generateColor(ct, record.Color);
                        }
                        var objArray = obj.fArray;
                        var gradientLogic = _getGradientLogic(obj, colors);
                        var spCnt = 1;
                        var cLen = gradientLogic.length;
                        for (var c = cLen; c--;) {
                            objArray.splice(spCnt, 1, gradientLogic[(spCnt-1)]);
                            spCnt++;
                        }
                    } else {
                        var color  = _generateRGBA(ColorObj.Color);
                        var colorObj = _generateColor(ct, color);
                        var fArray = obj.fArray;
                        if (obj.Width == undefined) {
                            fArray.splice(
                                1, 5,
                                'fillStyle',
                                colorObj.R, colorObj.G, colorObj.B, colorObj.A
                            );
                        } else {
                            fArray.splice(
                                1, 5,
                                'strokeStyle',
                                colorObj.R, colorObj.G, colorObj.B, colorObj.A
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * generateColor
     * @param cts
     * @param color
     * @returns {{R: Number, G: Number, B: Number, A: number}}
     */
    function generateColor(cts, color)
    {
        if (color.A == undefined) {
            color.A = 1;
        }

        var R = color.R;
        var G = color.G;
        var B = color.B;
        var A = color.A * 255;

        var len = cts.length;
        for (var i = 0; i < len; i++) {
            var ct = cts[i];
            var HasAddTerms = ct.HasAddTerms;
            var HasMultiTerms = ct.HasMultiTerms;
            var RedMultiTerm = ct.RedMultiTerm;
            var GreenMultiTerm = ct.GreenMultiTerm;
            var BlueMultiTerm = ct.BlueMultiTerm;
            var AlphaMultiTerm = ct.AlphaMultiTerm;
            var RedAddTerm = ct.RedAddTerm;
            var GreenAddTerm = ct.GreenAddTerm;
            var BlueAddTerm = ct.BlueAddTerm;
            var AlphaAddTerm = ct.AlphaAddTerm;

            if (HasAddTerms && HasMultiTerms) {
                R = _max(0,
                    _min(((R * RedMultiTerm) / 256) + RedAddTerm, 255));
                G = _max(0,
                    _min(((G * GreenMultiTerm) / 256) + GreenAddTerm, 255));
                B = _max(0,
                    _min(((B * BlueMultiTerm) / 256) + BlueAddTerm, 255));
                A = _max(0,
                    _min(((A * AlphaMultiTerm) / 256) + AlphaAddTerm, 255));
            } else if (HasAddTerms && !HasMultiTerms) {
                R = _max(0, _min(R + RedAddTerm, 255));
                G = _max(0, _min(G + GreenAddTerm, 255));
                B = _max(0, _min(B + BlueAddTerm, 255));
                A = _max(0, _min(A + AlphaAddTerm, 255));
            } else if (!HasAddTerms && HasMultiTerms) {
                R = (R * RedMultiTerm) / 256;
                G = (G * GreenMultiTerm) / 256;
                B = (B * BlueMultiTerm) / 256;
                A = (A * AlphaMultiTerm) / 256;
            } else {
                continue;
            }
        }

        return {
            R: _floor(R),
            G: _floor(G),
            B: _floor(B),
            A: (A / 255)
        };
    }

    /**
     * rollBackColor
     * @param aData
     */
    function rollBackColor(aData)
    {
        var data = aData.data;
        var dLen = data.length;
        for (var i = dLen; i--;) {
            var stack = data[i];
            var sLen = stack.length;
            for (var s = sLen; s--;) {
                var array  = stack[s];
                if (array == undefined) {
                    continue;
                }

                var aLen = array.length;
                for (var a = 0; a < aLen; a++) {
                    var obj = array[a];

                    if (obj.BitMapObj != null) {
                        continue;
                    }

                    // グラデーション対応
                    if (obj.isGradient) {
                        var objArray = obj.fArray;
                        var gradientLogic = _getGradientLogic(obj, undefined);
                        var spCnt = 1;
                        var cLen = gradientLogic.length;
                        for (var c = cLen; c--;) {
                            objArray.splice(spCnt, 1, gradientLogic[(spCnt-1)]);
                            spCnt++;
                        }
                    } else {
                        var fArray = obj.fArray;
                        var ColorObj = obj.ColorObj;
                        var color  = _generateRGBA(ColorObj.Color);
                        if (obj.Width == undefined) {
                            fArray.splice(1, 5,
                                'fillStyle',
                                color.R, color.G, color.B, color.A
                            );
                        } else {
                            fArray.splice(1, 5,
                                'strokeStyle',
                                color.R, color.G, color.B, color.A
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * drawVector
     *
     * @param aData
     * @param transform
     * @param tag
     * @param aClass
     */
    function drawVector(aData, transform, tag, aClass)
    {
        if (!aClass.isClipDepth) {
            _setSave(_getCanvasArray());
        }

        // transform
        var len = transform.length;
        _setSetTransform(_getCanvasArray(), scale, 0, 0, scale, 0, 0);

        for (var i = 0; i < len; i++) {
            var transformObj = transform[i];
            var type = transformObj.type;
            switch (type) {
                case 0:
                    _setTransform(
                        _getCanvasArray(),
                        transformObj.ScaleX,
                        transformObj.RotateSkew0,
                        transformObj.RotateSkew1,
                        transformObj.ScaleY,
                        transformObj.TranslateX,
                        transformObj.TranslateY
                    );
                    break;
                case 1:
                    _setRotate(_getCanvasArray(), transformObj.angle);
                    break;
                case 2:
                    _setScale(
                        _getCanvasArray(),
                        transformObj.ScaleX,
                        transformObj.ScaleY
                    );
                    break;
            }
        }

        var data = aData.data;
        if (tag.PlaceFlagHasClipDepth) {
            aClass.isClipDepth = true;
            aClass.endDepth = tag.ClipDepth;
            _mask(data, aClass);
        } else {
            if (data.isText) {
                var obj = data.obj;
                var fArray = data.fArray;
                var name = obj.VariableName;
                var text = undefined;
                if (name != '') {
                    text = _getAnimationClassVariable(name, aClass);
                    if (text != null) {
                        fArray = _generateText(obj, data.FontName, text)
                    }
                }

                var fLen = fArray.length;
                for (var f = 0; f < fLen; f++) {
                    _setCanvasArray(fArray[f]);
                }
            } else {
                _draw(data, aClass);
            }
        }

        if (!aClass.isClipDepth) {
            _setRestore(_getCanvasArray());
        }
    }

    /**
     * mask
     * @param data
     * @param aClass
     */
    function mask(data, aClass)
    {
        var dLen = data.length;
        _setBeginPath(_getCanvasArray());

        for (var i = 0; i < dLen; i++) {
            var stack = data[i];
            var sLen = stack.length;
            for (var s = 0; s < sLen; s++) {
                var array  = stack[s];
                if (array == undefined) {
                    continue;
                }

                var aLen = array.length;
                for (var a = 0; a < aLen; a++) {
                    var obj = array[a];
                    var fArray = obj.fArray;
                    var length = fArray.length - 2;
                    for (var c = 6; c < length; c++) {
                        _setCanvasArray(fArray[c]);
                    }
                }
            }
        }

        _setClip(_getCanvasArray());
    }

    /**
     * draw
     * @param data
     * @param aClass
     */
    function draw(data, aClass)
    {
        var dLen = data.length;
        for (var i = 0; i < dLen; i++) {
            var stack = data[i];
            var sLen = stack.length;
            for (var s = 0; s < sLen; s++) {
                var array  = stack[s];
                if (array == undefined) {
                    continue;
                }

                var aLen = array.length;
                for (var a = 0; a < aLen; a++) {
                    var obj = array[a];
                    var fArray = obj.fArray;
                    var length = fArray.length;
                    for (var c = 0; c < length; c++) {
                        _setCanvasArray(fArray[c]);
                    }
                }
            }
        }
    }

    /**
     * swf2js
     * @type {{}}
     */
    _window.swf2js = {};
    var _swf2js = _window.swf2js;

    /**
     * load
     * @param path
     * @param options
     */
    _swf2js.load = function(path, options)
    {
        if (_init()) {
            if (path == undefined) {
                path = location.search.substr(1).split('&')[0];
            }

            if (path) {
                _xmlHttpRequest.open('GET', path);
                _xmlHttpRequest.overrideMimeType(
                    'text/plain; charset=x-user-defined'
                );
                _xmlHttpRequest.send(null);
            } else {
                alert('please set swf path');
            }

            _xmlHttpRequest.onreadystatechange = function()
            {
                var readyState = _xmlHttpRequest.readyState;
                if (readyState == 4) {
                    var status = _xmlHttpRequest.status;
                    if (status == 200) {
                        if (options instanceof Object) {
                            setWidth = options.width | 0;
                            setHeight = options.height | 0;
                            renderMode = options.mode | 'canvas';
                            isSpriteSheet = options.isSpriteSheet | false;
                        }
                        _parse(_xmlHttpRequest.responseText);
                    } else {
                        alert('unknown swf data');
                    }
                }
            }
        }
    }

    /**
     * play
     */
    _swf2js.play = function()
    {
        player.playStartFlag = true;
    }

    /**
     * stop
     */
    _swf2js.stop = function()
    {
        player.playStartFlag = false;
    }

    /**
     * clear
     */
    _swf2js.clear = function()
    {
        player.playStartFlag = false;
        isLoad = false;
        swftag = new SwfTag();
        bitio = new BitIO();
        _clearInterval(intervalId);
    }

    /**
     * reLoad
     * @param path
     */
    _swf2js.reLoad = function(path)
    {
        var _this = this;
        _this.clear();
        _this.load(path, {width: setWidth, height: setHeight});
    }

    /**
     * output
     * @param path
     * @returns {boolean}
     */
    _swf2js.output = function(path)
    {
        _swf2js.stop();

        if (!isLoad) {
            _clearInterval(intervalId);
            setTimeout(_swf2js.output, 1000, path);
            return false;
        }

        _xmlHttpRequest.open(
            'POST', path
        );
        _xmlHttpRequest.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
        );
        _xmlHttpRequest.send('data='+ encodeURIComponent(
            preContext.canvas.toDataURL())
        );

        // alert
        _xmlHttpRequest.onreadystatechange = function() {
            var readyState = _xmlHttpRequest.readyState;
            if (readyState == 4) {
                var status = _xmlHttpRequest.status;
                if (status == 200) {
                    alert('OUTPUT SUCCESS');
                } else {
                    alert('[ERROR] HTTP STATUS: '+ status);
                }
            }
        }
    }

    /**
     * parse
     * @param swf
     */
    function parse(swf)
    {
        // swfデータをセット
        bitio.setData(swf);

        // Header
        _setSwfHeader();

        // swfを分解
        swftag.parse();

        // reset
        swftag = _void;
    }

    /**
     * setMovieHeader
     */
    function setSwfHeader()
    {
        // signature
        signature = bitio.getHeaderSignature();

        // version
        version = bitio.getVersion();
        if (version > 4) {
            //alert('flash version 4 data only');
            //return false;
        }

        // ファイルサイズ
        player.fileLength = bitio.getUI32();

        // 解凍
        if (signature == 'CWS') {
            // ZLIB
            bitio.deCompress();
        } else if (signature == 'ZWS') {
            alert('not supported by LZMA');
            return 0;
        }

        // フレームサイズ
        var FrameSize = swftag.rect();
        player.Xmin = FrameSize.Xmin / 20;
        player.Xmax = FrameSize.Xmax / 20;
        player.Ymin = FrameSize.Ymin / 20;
        player.Ymax = FrameSize.Ymax / 20;

        // フレーム
        player.frameRate  = bitio.getUI16() / 0x100;
        player.frameCount = bitio.getUI16();
        player.fps = _floor(1000 / player.frameRate);
    }

    /**
     * onEnterFrame
     */
    function onEnterFrame()
    {
        if (!isLoad
            && imgLoadCount > 0
            && imgLoadCount == imgLoadCompCount
        ) {
            isLoad = true;
            _setBuffer();
            _deleteCss();
        } else if (isLoad && player.playStartFlag) {
            _clearMain();

            // main
            if (cacheArray.length > 0) {
                _setBuffer();
                var cache = cacheArray.shift();
                var canvas = cache.canvas;
                context.drawImage(canvas, 0, 0);
            } else {
                var canvas = preContext.canvas;
                context.drawImage(canvas, 0, 0);
                _setBuffer();
            }
        }
    }

    /**
     * buffer
     */
    function buffer()
    {
        var _layer = player.layer;
        if (_layer instanceof AnimationClass) {
            // btn 初期化
            touchCtx = [];

            // action script
            _action(_layer);

            // pre clear
            _clearPre();

            // render
            var frame = _layer.getFrame();
            var _frameTags = _layer.frameTags[frame];
            if (_frameTags != undefined) {
                var len = _frameTags.length;
                for (var i = 1; i < len; i++) {
                    var tag = _frameTags[i];
                    if (tag == undefined) {
                        continue;
                    }
                    _render(_layer, tag, [], []);
                }

                _renderCanvas();
                var cLen = cacheArray.length;
                if (!isLoad || cLen > 0) {
                    var cloneCanvas = baseCanvas.cloneNode(false);
                    var cache = cloneCanvas.getContext('2d');
                    _setStyle(cloneCanvas, 'width', width);
                    _setStyle(cloneCanvas, 'height', height);
                    var canvas = preContext.canvas;
                    cache.drawImage(canvas, 0, 0);
                    cacheArray[cLen] = cache;
                }

                if (isSpriteSheet && totalFrame > 0) {
                    var base64 = preContext.canvas.toDataURL();
//                    if (base64Array[base64] == undefined) {
//                        base64Array[base64] = totalFrame;
//                    }
                    spriteArray[totalFrame] = base64;
                    totalFrame--;
                }

                if (isSpriteSheet && totalFrame == 0) {
                    player.playStartFlag = false;

                    var fLen = spriteArray.length;

                    var canvas = context.canvas;
                    _setStyle(canvas, 'width', (width * (fLen - 1)));

                    _clearMain();
                    var cnt = 0;
                    for (var f = fLen; f--;) {
                        var src =  spriteArray[f];
                        if (src != undefined) {
                            var imgObj = new _Image();
                            imgObj.w = (cnt * width);
                            imgObj.onload = function()
                            {
                                context.drawImage(this, this.w, 0);
                            }
                            imgObj.src = src;
                            cnt++;
                        }
                    }

                    // divの設定
                    var div = _document.getElementById('swf2js');
                    var style = div.style;
                    _setStyle(style, 'left', 0);
                }
            }

            // next animation
            _putFrame(_layer);
        }
    }

    /**
     * action
     * @param aClass
     */
    function action(aClass)
    {
        if (aClass instanceof AnimationClass) {
            aClass.action();

            var tags = aClass.frameTags[aClass.getFrame()];
            if (tags instanceof Array) {
                var len = tags.length;
                for (var i = 0; i < len; i++) {
                    var tag = tags[i];
                    if (tag == undefined) {
                        continue;
                    }

                    var data = tag.CloneData;
                    if (!(data instanceof AnimationClass)) {
                        continue;
                    }

                    if (data.isButton && data.ButtonId == touchId) {
                        var btnCharacters = data.ButtonCharacters;
                        var bLen = btnCharacters.length;
                        if (bLen) {
                            var bool = touchFlag;
                            for (var b = 0; b < bLen; b++) {
                                var bClass = btnCharacters[b];
                                var bTag = bClass.frameTags[1];
                                if (bTag.ButtonStateDown) {
                                    var bData = bTag.CloneData;
                                    if (!(bData instanceof AnimationClass)
                                        || !bool
                                    ) {
                                        continue;
                                    }
                                    _action(bData);
                                }
                            }
                        }
                    }
                    _action(data);
                }
            }
        }
    }

    /**
     * render
     *
     * @param data
     * @param tag
     * @param transform
     * @param colorTransform
     */
    function render(data, tag, transform, colorTransform)
    {
        // 複数対応
        data.setView();

        // sound
        var soundObj = data.getSoundCtrls(data.getFrame());
        if (soundObj != undefined) {
            var soundInfo = soundObj.SoundInfo;
            var soundData = sounds[soundObj.SoundId];
            if (soundInfo.SyncStop) {
                soundData.Audio.stop();
            } else if (!soundInfo.SyncNoMultiple
                || (soundInfo.SyncNoMultiple && !data.soundPlayFlag)
            ) {
                soundData.Audio.play();
                data.soundPlayFlag = true;
            }
        }

        // delete count
        var count = 0;

        // mask終了判定
        if (data.isClipDepth && tag.Depth > data.endDepth) {
            data.isClipDepth = false;
            _setRestore(_getCanvasArray());
        }

        // ColorTransform
        if (tag.PlaceFlagHasColorTransform) {
            colorTransform.unshift(tag.ColorTransform);
        }

        // Clone Data
        var aData = tag.CloneData;

        // Property
        var x = 0;
        var y = 0;
        var ScaleX = 1;
        var ScaleY = 1;
        var xScale = null;
        var yScale = null;
        var isRotation = false;
        var angle = 0;
        var alpha = 1;
        if (aData instanceof AnimationClass && aData.cid) {
            if (!aData._visible) {
                return false;
            }

            x = aData._x;
            y = aData._y;

            xScale = aData._xscale;
            yScale = aData._yscale;

            if (aData._rotation != 0) {
                angle = aData._rotation * Math.PI / 180;
                isRotation = true;
            }

            ScaleX = (xScale == null) ? 1 : xScale;
            ScaleY = (yScale == null) ? 1 : yScale;

            alpha = aData._alpha;
        }

        // Matrix
        if (tag.PlaceFlagHasMatrix) {
            count++;
            var Matrix = tag.Matrix;
            transform[transform.length] = {
                type: 0,
                ScaleX: Matrix.ScaleX,
                RotateSkew0: Matrix.RotateSkew0,
                RotateSkew1: Matrix.RotateSkew1,
                ScaleY: Matrix.ScaleY,
                TranslateX: (x + Matrix.TranslateX),
                TranslateY: (y + Matrix.TranslateY)
            };
        }

        // Rotation
        if (isRotation) {
            count++;
            transform[transform.length] = {
                type: 1,
                angle: angle
            }
        }

        // Scale
        if (xScale != null || yScale != null) {
            count++;
            transform[transform.length] = {
                type: 2,
                ScaleX: ScaleX,
                ScaleY: ScaleY
            }
        }

        // alpha
        if (1 > alpha) {
            colorTransform.unshift(
                {
                    HasAddTerms: 0,
                    HasMultiTerms: 1,
                    RedMultiTerm: 256,
                    GreenMultiTerm: 256,
                    BlueMultiTerm: 256,
                    AlphaMultiTerm: 256 * alpha
                }
            );
        }

        // 実行
        if (aData instanceof AnimationClass) {
            // 複数対応
            aData.setView();

            // ボタン処理
            var isButton = aData.isButton;
            if (isButton) {
                // btnCharacters
                var btnCharacters = aData.ButtonCharacters;
                var bLen = btnCharacters.length;
                var btnActions = aData.ButtonActions;
                if (btnActions != undefined) {
                    var _touchCtx = touchCtx;

                    // push
                    _touchCtx[_touchCtx.length] = {
                        ButtonId: aData.ButtonId,
                        CondOverUpToOverDown: 0,
                        data: [],
                        aClass: data
                    };

                    // enter btn
                    var keyPress = btnActions.CondKeyPress;
                    if (keyPress == 13) {
                        // set
                        var tCtx = _touchCtx.pop();
                        var btnData = tCtx.data;
                        btnData[btnData.length] = {
                            Xmax: width,
                            Xmin: 0,
                            Ymax: height,
                            Ymin: 0
                        };
                        tCtx.CondOverUpToOverDown =
                            btnActions.CondOverUpToOverDown;
                        _touchCtx[_touchCtx.length] = tCtx;
                    } else if (bLen
                        && (keyPress == 0 || (keyPress >= 48 && keyPress <= 57))
                    ) {
                        for (var b = 0; b < bLen; b++) {
                            var bClass = btnCharacters[b];
                            var bTag = bClass.frameTags[1];
                            if (!bTag.ButtonStateHitTest
                                && !bTag.ButtonStateUp
                            ) {
                                continue;
                            }

                            var ctx = _renderBtn(
                                bClass, bTag, transform, [],0 ,0
                            );

                            if (ctx == undefined) {
                                continue;
                            }

                            // set
                            var tCtx = _touchCtx.pop();
                            var btnData = tCtx.data;
                            btnData[btnData.length] = ctx;
                            tCtx.CondOverUpToOverDown =
                                btnActions.CondOverUpToOverDown;
                            _touchCtx[_touchCtx.length] = tCtx;
                        }
                    } else {
                        _touchCtx.pop();
                    }
                }

                // 描画
                if (bLen) {
                    var renderArray = [];
                    for (var b = bLen; b--;) {
                        var bClass = btnCharacters[b];
                        var bTag = bClass.frameTags[1];

                        // 描画
                        if (touchFlag && aData.ButtonId == touchId) {
                            if (!bTag.ButtonStateDown) {
                                continue;
                            }
                            renderArray[bTag.Depth] = bClass;
                        } else {
                            if (!bTag.ButtonStateUp) {
                                continue;
                            }
                            renderArray[bTag.Depth] = bClass;
                        }
                    }

                    var rLen = renderArray.length;
                    if (rLen > 0) {
                        renderArray.reverse();
                        for (var r = rLen; r--;) {
                            var bClass = renderArray[r];
                            if (bClass == undefined) {
                                continue;
                            }

                            var bTag = bClass.frameTags[1];
                            _render(bClass, bTag, transform, colorTransform);
                        }
                    }
                }
            }

            // 指定フレーム
            var tags = aData.frameTags[aData.getFrame()];
            if (tags instanceof Array) {
                var len = tags.length;
                if (len) {
                    for (var i = 0; i < len; i++) {
                        var aTag = tags[i];
                        if (aTag == undefined) {
                            continue;
                        }
                        _render(aData, aTag, transform, colorTransform);
                    }
                }

                if (aData.isClipDepth) {
                    aData.isClipDepth = false;
                    _setRestore(_getCanvasArray());
                }
            }
        } else {
            // ColorTransform
            var changeColorLength = colorTransform.length;
            if (changeColorLength) {
                _changeColor(colorTransform, aData);
            }

            // 描画
            _drawVector(aData, transform, tag, data);

            // rollBack
            if (changeColorLength) {
                _rollBackColor(aData);
            }
        }

        // Property 削除
        for (var i = count; i--;) {
            transform.pop();
        }

        // colorTransform
        if (tag.PlaceFlagHasColorTransform) {
            colorTransform.shift();
        }

        if (1 > alpha) {
            colorTransform.shift();
        }
    }

    /**
     * resetObj
     * @param aClass
     */
    function resetObj(aClass)
    {
        var tags =  aClass.frameTags;
        if (tags instanceof Array) {
            var len = tags.length;
            for (var i = len; i--;) {
                var tag = tags[i];
                if (tag == undefined
                    || !(tag instanceof AnimationClass)
                ) {
                    continue;
                }
                _resetObj(tag);
            }
        }
        aClass.setFrame(1);
        aClass.play();
    }

    /**
     * putFrame
     * @param aClass
     */
    function putFrame(aClass)
    {
        if (aClass.isActionWait) {
            aClass.isActionWait = false;
            aClass.actionStart();
        }

        var frame = aClass.getFrame();
        var tags = aClass.frameTags[frame];
        if (tags instanceof Array) {
            var len = tags.length;
            for (var i = len; i--;) {
                var tag = tags[i];
                if (tag == undefined) {
                    continue;
                }

                var data = tag.CloneData;
                if (!(data instanceof AnimationClass)) {
                    continue;
                }

                if (data.isButton && data.ButtonId == touchId) {
                    var btnCharacters = data.ButtonCharacters;
                    var bLen = btnCharacters.length;
                    if (bLen) {
                        var bool = touchFlag;
                        for (var b = bLen; b--;) {
                            var bClass = btnCharacters[b];
                            var bTag = bClass.frameTags[1];

                            if (bTag.ButtonStateDown) {
                                var bData = bTag.CloneData;
                                if (!(bData instanceof AnimationClass)) {
                                    continue;
                                }

                                if (bool) {
                                    _putFrame(bData);
                                } else {
                                    bData.setFrame(1);
                                }
                            }
                        }
                    }
                }
                _putFrame(data);
            }
        }

        // 削除の場合はフレームを最初に戻す
        var removeArray = aClass.getRemoveMap(frame);
        if (removeArray instanceof Array) {
            var len = removeArray.length;
            for (var i = len; i--;) {
                var removeClass = removeArray[i];
                if (removeClass == undefined) {
                    continue;
                }
                _resetObj(removeClass);
            }
        }

        aClass.putFrame();
    }

    /**
     * main canvas clear
     */
    function clearMain()
    {
        var canvas = context.canvas;
        canvas.width = canvas.width;
    }

    /*
     * pre canvas clear
     */
    function clearPre()
    {
        var canvas = preContext.canvas;
        canvas.width = canvas.width;
    }

    /**
     * setQuadraticCurveTo
     * @param base
     * @param cx
     * @param cy
     * @param ax
     * @param ay
     * @returns {*}
     */
    function setQuadraticCurveTo(base, cx, cy, ax, ay)
    {
        var len = base.length;
        base[len++] = 'quadraticCurveTo';
        base[len++] = cx;
        base[len++] = cy;
        base[len++] = ax;
        base[len] = ay;
        return base;
    }

    /**
     * setLineTo
     * @param base
     * @param x
     * @param y
     * @returns {*}
     */
    function setLineTo(base, x, y)
    {
        var len = base.length;
        base[len++] = 'lineTo';
        base[len++] = x;
        base[len] = y;
        return base;
    }

    /**
     * setMoveTo
     * @param base
     * @param x
     * @param y
     * @returns {*}
     */
    function setMoveTo(base, x, y)
    {
        var len = base.length;
        base[len++] = 'moveTo';
        base[len++] = x;
        base[len] = y;
        return base;
    }

    /**
     * setSave
     * @param base
     * @returns {*}
     */
    function setSave(base, isUnShift)
    {
        if (isUnShift) {
            base.unshift('save');
        } else {
            base[base.length] = 'save';
        }
        return base;
    }

    /**
     * setRestore
     * @param base
     * @returns {*}
     */
    function setRestore(base)
    {
        base[base.length] = 'restore';
        return base;
    }

    /**
     * setBeginPath
     * @param base
     * @param isUnShift
     * @returns {*}
     */
    function setBeginPath(base, isUnShift)
    {
        if (isUnShift) {
            base.unshift('beginPath');
        } else {
            base[base.length] = 'beginPath';
        }
        return base;
    }

    /**
     * setClosePath
     * @param base
     * @returns {*}
     */
    function setClosePath(base)
    {
        base[base.length] = 'closePath';
        return base;
    }

    /**
     * setFillStyle
     * @param base
     * @param r
     * @param g
     * @param b
     * @param a
     * @returns {*}
     */
    function setFillStyle(base, r, g, b, a, isUnShift)
    {
        if (isUnShift) {
            base.unshift(a);
            base.unshift(b);
            base.unshift(g);
            base.unshift(r);
            base.unshift('fillStyle');
        } else {
            var len = base.length;
            base[len++] = 'fillStyle';
            base[len++] = r;
            base[len++] = g;
            base[len++] = b;
            base[len] = a;
        }

        return base;
    }

    /**
     * setFill
     * @param base
     * @returns {*}
     */
    function setFill(base)
    {
        base[base.length] = 'fill';
        return base;
    }

    /**
     * setStrokeStyle
     * @param base
     * @param r
     * @param g
     * @param b
     * @param a
     * @param isUnShift
     * @returns {*}
     */
    function setStrokeStyle(base, r, g, b, a, isUnShift)
    {
        var len = base.length;
        if (isUnShift) {
            base.unshift(a);
            base.unshift(b);
            base.unshift(g);
            base.unshift(r);
            base.unshift('strokeStyle');
        } else {
            base[len++] = 'strokeStyle';
            base[len++] = r;
            base[len++] = g;
            base[len++] = b;
            base[len] = a;
        }

        return base;
    }

    /**
     * setLineWidth
     * @param base
     * @param width
     * @returns {*}
     */
    function setLineWidth(base, width)
    {
        base.unshift(width);
        base.unshift('lineWidth');
        return base;
    }

    /**
     * setLineCap
     * @param base
     * @returns {*}
     */
    function setLineCap(base)
    {
        base.unshift('lineCap');
        return base;
    }

    /**
     * setLineCap
     * @param base
     * @returns {*}
     */
    function setLineJoin(base)
    {
        base.unshift('lineJoin');
        return base;
    }

    /**
     * setStroke
     * @returns {*}
     */
    function setStroke(base)
    {
        base[base.length] = 'stroke';
        return base;
    }

    /**
     * setClip
     * @param base
     * @returns {*}
     */
    function setClip(base)
    {
        base[base.length] = 'clip';
        return base;
    }

    /**
     * setSetTransform
     * @param base
     * @param sx
     * @param r0
     * @param r1
     * @param sy
     * @param tx
     * @param ty
     * @returns {*}
     */
    function setSetTransform(base, sx, r0, r1, sy, tx, ty)
    {
        var len = base.length;
        base[len++] = 'setTransform';
        base[len++] = sx;
        base[len++] = r0;
        base[len++] = r1;
        base[len++] = sy;
        base[len++] = tx;
        base[len] = ty;
        return base;
    }

    /**
     * setTransform
     * @param base
     * @param sx
     * @param r0
     * @param r1
     * @param sy
     * @param tx
     * @param ty
     * @returns {*}
     */
    function setTransform(base, sx, r0, r1, sy, tx, ty)
    {
        var len = base.length;
        base[len++] = 'transform';
        base[len++] = sx;
        base[len++] = r0;
        base[len++] = r1;
        base[len++] = sy;
        base[len++] = tx;
        base[len] = ty;
        return base;
    }

    /**
     * setRotate
     * @param base
     * @param a
     * @returns {*}
     */
    function setRotate(base, a)
    {
        var len = base.length;
        base[len++] = 'rotate';
        base[len] = a;
        return base;
    }

    /**
     * setDrawImage
     * @param base
     * @param image
     * @returns {*}
     */
    function setDrawImage(base, image)
    {
        var len = base.length;
        base[len++] = 'drawImage';
        base[len] = image;
        return base;
    }

    /**
     * setScale
     * @param base
     * @param x
     * @param y
     * @returns {*}
     */
    function setScale(base, x, y)
    {
        var len = base.length;
        base[len++] = 'scale';
        base[len++] = x;
        base[len] = y;
        return base;
    }

    /**
     * setImage
     * @param base
     * @param id
     * @returns {*}
     */
    function setImage(base, id)
    {
        //var len = base.length;
        base.unshift(id);
        base.unshift('image');

        //base[len++] = 'image';
        //base[len] = id;
        return base;
    }

    /**
     * setFont
     * @param base
     * @param size
     * @param name
     * @returns {*}
     */
    function setFont(base, size, name)
    {
        var len = base.length;
        base[len++] = 'font';
        base[len++] = size;
        base[len] = name;
        return base;
    }

    /**
     * setTextAlign
     * @param base
     * @param point
     * @returns {*}
     */
    function setTextAlign(base, point)
    {
        var len = base.length;
        base[len++] = 'textAlign';
        base[len] = point;
        return base;
    }

    /**
     * setFillText
     * @param base
     * @param name
     * @param x
     * @param y
     * @returns {*}
     */
    function setFillText(base, name, x, y)
    {
        var len = base.length;
        base[len++] = 'fillText';
        base[len++] = name;
        base[len++] = x;
        base[len] = y;
        return base;
    }

    /**
     * setCanvasArray
     * @param value
     */
    function setCanvasArray(value)
    {
        canvasArray[canvasArray.length] = value;
    }

    /**
     * getCanvasArray
     * @returns {Array}
     */
    function getCanvasArray()
    {
        return canvasArray;
    }

    /**
     * renderCanvas
     */
    function renderCanvas()
    {
        var array = canvasArray;
        var len = array.length;
        var i = 0;
        var _context = preContext;
        var grad = null;

        while (len) {
            var type = array[i++];
            switch (type) {
                case 'quadraticCurveTo':
                    _context.quadraticCurveTo(
                        array[i++], array[i++],
                        array[i++], array[i++]
                    );
                    break;
                case 'lineTo':
                    _context.lineTo(array[i++], array[i++]);
                    break;
                case 'moveTo':
                    _context.moveTo(array[i++], array[i++]);
                    break;
                case 'save':
                    _context.save();
                    break;
                case 'restore':
                    _context.restore();
                    break;
                case 'beginPath':
                    _context.beginPath();
                    break;
                case 'closePath':
                    _context.closePath();
                    break;
                case 'fillStyle':
                    _context.fillStyle = "rgba("
                        + array[i++] +", "
                        + array[i++] +", "
                        + array[i++] +", "
                        + array[i++] +")";
                    break;
                case 'fill':
                    _context.fill();
                    break;
                case 'strokeStyle':
                    _context.strokeStyle = "rgba("
                        + array[i++] +", "
                        + array[i++] +", "
                        + array[i++] +", "
                        + array[i++] +")";
                    break;
                case 'lineWidth':
                    _context.lineWidth = array[i++];
                    break;
                case 'lineCap':
                    _context.lineCap = 'round';
                    break;
                case 'lineJoin':
                    _context.lineJoin = 'round';
                    break;
                case 'stroke':
                    _context.stroke();
                    break;
                case 'clip':
                    _context.clip();
                    break;
                case 'setTransform':
                    _context.setTransform(
                        array[i++], array[i++],
                        array[i++], array[i++],
                        array[i++], array[i++]
                    );
                    break;
                case 'transform':
                    _context.transform(
                        array[i++], array[i++],
                        array[i++], array[i++],
                        array[i++], array[i++]
                    );
                    break;
                case 'rotate':
                    _context.rotate(array[i++]);
                    break;
                case 'drawImage':
                    _context.drawImage(array[i++],0,0);
                    break;
                case 'scale':
                    _context.scale(array[i++], array[i++]);
                    break;
                case 'createRadialGradient':
                    grad = _context.createRadialGradient(
                        array[i++], array[i++],
                        array[i++], array[i++],
                        array[i++], array[i++]
                    );
                    break;
                case 'createLinearGradient':
                    grad = _context.createLinearGradient(
                        array[i++], array[i++],
                        array[i++], array[i++]
                    );
                    break;
                case 'addColorStop':
                    grad.addColorStop(
                        array[i++], "rgba("
                           + array[i++] +", "
                           + array[i++] +", "
                           + array[i++] +", "
                           + array[i++] +")"
                    );
                    break;
                case 'setFillGradient':
                    _context.fillStyle = grad;
                    break;
                case 'setLineGradient':
                    _context.strokeStyle = grad;
                    break;
                case 'image':
                    _context.fillStyle =
                        _context.createPattern(
                            bitMapData[array[i++]].canvas,
                            'repeat'
                        );
                    break;
                case 'font':
                    _context.textBaseline = 'top';
                    var font = array[i++] +"px '"+ array[i++] +"'";
                    _context.font = font;

                    break;
                case 'textAlign':
                    _context.textAlign = array[i++];
                    break;
                case 'fillText':
                    _context.fillText(
                        array[i++],
                        array[i++],
                        array[i++]
                    );
                    break;
                default:
                    break;
            }

            if (i == len) {
                break;
            }
        }

        // 初期化
        canvasArray = [];
    }

    /**
     * タッチイベント
     * @param event
     */
    function touchStart(event)
    {
        var div = _document.getElementById('swf2js');
        var bounds = div.getBoundingClientRect();
        var x = bounds.left;
        var y = bounds.top;

        if (isTouch) {
            var changedTouche = event.targetTouches[0];
            var touchX = (changedTouche.pageX - x) * devicePixelRatio;
            var touchY = (changedTouche.pageY - y) * devicePixelRatio;
        } else {
            var touchX = event.pageX - x;
            var touchY = event.pageY - y;
        }

        touchFlag = false;
        var _touchCtx = touchCtx;
        var len = _touchCtx.length;
        for (var i = len; i--;) {
            if (touchFlag) {
                continue;
            }

            var obj = _touchCtx[i];
            var data = obj.data;
            var oLen = data.length;
            for (var o = 0; o < oLen; o++) {
                if (touchFlag) {
                    continue;
                }

                var ctx = data[o];
                if (touchX >= ctx.Xmin && touchX <= ctx.Xmax
                    && touchY >= ctx.Ymin && touchY <= ctx.Ymax
                ){
                    touchId = obj.ButtonId;
                    touchClass = obj.aClass;
                    touchFlag = true;
                    if (obj.CondOverUpToOverDown) {
                        touchEvent(event);
                    }
                }
            }
        }
    }

    /**
     * 移動イベント
     * @param event
     */
    function touchMove(event)
    {
        if (!isBtnAction && (isTouch || touchFlag)) {
            if (isTouch && touchFlag) {
                event.preventDefault();
            }
            touchStart(event);
        }
    }

    /**
     * タッチイベント終了
     * @param event
     */
    function touchEnd(event)
    {
        if (touchFlag) {
            touchEvent(event);
        }

        // reset
        touchId = 0;
        isBtnAction = false;
        touchClass = {};
    }

    /**
     * イベント実行
     * @param event
     */
    function touchEvent(event)
    {
        // 操作を無効にする
        event.preventDefault();

        var aClass = btnLayer[touchId];
        if (!isBtnAction && aClass instanceof AnimationClass) {
            aClass.btnAction(touchClass);
            isBtnAction = true;
        }
        touchFlag = false;
    }

    /**
     * clone
     * @param src
     * @returns {*}
     */
    function clone(src)
    {
        var data = {};
        if (src instanceof AnimationClass) {
            var data = new AnimationClass();
            for (var p in src) {
                data[p] = src[p];
            }
        } else {
            data = src;
        }
        return data;
    }

    /**
     * generateRGBA
     * @param color
     * @returns {{R: number, G: number, B: number, A: number}}
     */
    function generateRGBA(color)
    {
        if ('A' in color) {
            var alpha = color.A.toFixed(1);
        } else {
            var alpha = 1;
        }

        return {
            R: color.R,
            G: color.G,
            B: color.B,
            A: alpha
        };
    }

    /**
     * グラデーションセット
     * @param obj
     * @param transformColors
     * @returns {Array}
     */
    function getGradientLogic(obj, transformColors)
    {
        // 初期化
        var logic = [];

        // base
        var data = obj.ColorObj;
        var average = 819.2;
        var type = data.fillStyleType;

        if (type == 18 || type == 19) {
            logic[logic.length] = 'createRadialGradient';
            logic[logic.length] = 0;
            logic[logic.length] = 0;
            logic[logic.length] = 0;
            logic[logic.length] = 0;
            logic[logic.length] = 0;
            logic[logic.length] = average;
        } else if (type == 16) {
            logic[logic.length] = 'createLinearGradient';
            logic[logic.length] = average * -1;
            logic[logic.length] = 0;
            logic[logic.length] = average;
            logic[logic.length] = 0;
        }

        // グラデーションをセット
        var array = (transformColors == undefined)
            ? data.gradient.GradientRecords
            : transformColors;

        var len = array.length;
        for (var i = 0; i < len; i++) {
            var value = array[i];
            var n = (value.Ratio / 255);
            logic[logic.length] = 'addColorStop';
            logic[logic.length] = n.toFixed(1);
            var color = _generateRGBA(value.Color);
            logic[logic.length] = color.R;
            logic[logic.length] = color.G;
            logic[logic.length] = color.B;
            logic[logic.length] = color.A;
        }

        logic[logic.length] = 'setFillGradient';

        return logic;
    }

    /**
     * 背景をセット
     */
    function setBackgroundColor()
    {
        var color = "rgb("
            + bitio.getUI8() +","
            + bitio.getUI8() +","
            + bitio.getUI8() +")";
        var canvas = context.canvas;
        var style = canvas.style;
        _setStyle(style, 'backgroundColor', color);
    }

    /**
     * getAnimationClass
     * @param path
     * @param origin
     * @returns {*}
     */
    function getAnimationClassVariable(path, origin)
    {
        var splitData = path.split(':');
        var aClass = origin;
        var key = splitData[0];
        if (splitData.length > 1) {
            key = splitData[1];
            var aClass = player.layer;
            var _path = splitData[0] + '';
            var splitData = _path.split('/');
            if (splitData instanceof Array) {
                var len = splitData.length;
                for (var i = 0; i < len; i++) {
                    var name = splitData[i];
                    if (name == '') {
                        continue;
                    }

                    var obj = (i == 0 && name != '')
                        ? origin
                        : aClass;

                    var classData = obj.nameMap[name];
                    if (classData == undefined) {
                        aClass = null;
                        continue;
                    }

                    aClass = classData;
                }
            }
        }

        var result = null;
        if (aClass instanceof AnimationClass) {
            result = aClass.getVariable(key);
        }

        return (result == undefined)
            ? null
            : result;
    }

    /**
     * generateText
     * @param obj
     * @param FontName
     * @param text
     * @returns {Array}
     */
    function generateText(obj, FontName, text)
    {
        var fArray = [];
        var bound = obj.Bound;
        var fontHeight = obj.FontHeight;

        var Xmin = (bound.Xmin / 20) + obj.LeftMargin;
        var Xmax = (bound.Xmax / 20) - obj.RightMargin;
        var Ymin = bound.Ymin / 20;
        var Ymax = bound.Ymax / 20;

        // FONT
        var fontType = '';
        if (obj.HasFont) {
            var fonData = FontData[obj.FontID];
            if (fonData.FontFlagsItalic) {
                fontType += 'italic ';
            }

            if (fonData.FontFlagsBold) {
                fontType += 'bold ';
            }
        }

        // 座標
        var dx = 0;
        var dy = 0;
        if (obj.Align == 1) {
            fArray = _setTextAlign(fArray, 'end');
            dx = Xmax - 4;
            dy = Ymin + 2;
        } else if (obj.Align == 2) {
            fArray = _setTextAlign(fArray, 'center');
            dx = (Xmin + Xmax) / 2 + 2;
            dy = Ymin + 2;
        } else {
            dx = Xmin + 2;
            dy = Ymin + 2;
        }

        // 文字色
        var color = _generateRGBA(obj.TextColor);
        fArray = _setFillStyle(
            fArray, color.R, color.G, color.B, color.A
        );

        // 文字情報
        fArray = _setFont(
            fArray,
            fontType +''+ fontHeight,
            FontName
        );

        var inText = (text == undefined)
            ? obj.InitialText
            : text;

        inText = inText + "";
        var splitData = inText.split('@LFCR');
        var len = splitData.length;
        var wordWrap = obj.WordWrap;
        var newLineHeight = fontHeight + obj.Leading;
        var multiLine = obj.Multiline;

        // 複数行
        var textFiledHeight = Ymax - Ymin;
        for (var i = 0; i < len; i++) {
            if (len > 1 && (dy + newLineHeight) > textFiledHeight) {
                continue;
            }

            var txt = splitData[i];
            if (wordWrap && multiLine) {
                var mobaileMargin = (isTouch) ? 20 : 0;
                var areaWidth = Xmax - Xmin - mobaileMargin;
                var textByte = _getTextByte(txt) / 2;
                var txtTotalWidth = fontHeight * textByte;
                if (txtTotalWidth > areaWidth) {
                    var txtLength = txt.length;
                    var count = (areaWidth / fontHeight);
                    var txtArray = [];
                    var joinTxt = '';
                    var joinCount = 0;
                    for (var t = 0; t < txtLength; t++) {
                        joinCount += _getTextByte(txt[t]) / 2;
                        joinTxt += txt[t];
                        if (joinCount > count) {
                            txtArray[txtArray.length] = joinTxt;
                            joinCount = 0;
                            joinTxt = '';
                        }
                    }

                    txtArray[txtArray.length] = joinTxt;
                    var tLen = txtArray.length;
                    for (t = 0; t < tLen; t++) {
                        if ((dy + newLineHeight) > textFiledHeight) {
                            continue;
                        }

                        fArray = _setFillText(
                            fArray,
                            txtArray[t],
                            dx,
                            dy
                        );
                        dy += newLineHeight;
                    }
                } else {
                    fArray = _setFillText(
                        fArray,
                        txt,
                        dx,
                        dy
                    );
                }
            } else {
                if (obj.HasMaxLength) {
                    if (txt.length > obj.MaxLength) {
                        txt = txt.substr(0, obj.MaxLength);
                    }
                }

                fArray = _setFillText(
                    fArray,
                    txt,
                    dx,
                    dy
                );
            }

            dy += newLineHeight;
        }
        fArray = _setRestore(fArray);

        return fArray;
    }

    /**
     * getTextByte
     * @param str
     * @returns {number}
     */
    function getTextByte(str)
    {
        var byte = 0;
        for (var i = str.length; i--;) {
            var c = str.charCodeAt(i);
            if ((c >= 0x0 && c < 0x81)
                || (c == 0xf8f0)
                || (c >= 0xff61 && c < 0xffa0)
                || (c >= 0xf8f1 && c < 0xf8f4)
            ) {
                byte += 1;
            } else {
                byte += 2;
            }
        }
        return byte;
    }

    /**
     * unzip
     * @param compressed
     * @param isDeCompress
     * @returns {Array}
     */
    function unzip(compressed, isDeCompress)
    {
        var newBitio = new BitIO();
        newBitio.setData(compressed);

        if (isDeCompress) {
            newBitio.setOffset(10, 8);
        } else {
            newBitio.setOffset(2, 8);
        }

        var buff = [];
        var DEFLATE_CODE_LENGTH_ORDER =
            [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        var DEFLATE_CODE_LENGTH_MAP = [
            [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9], [0, 10],
            [1, 11], [1, 13], [1, 15], [1, 17], [2, 19], [2, 23], [2, 27],
            [2, 31], [3, 35], [3, 43], [3, 51], [3, 59], [4, 67], [4, 83],
            [4, 99], [4, 115], [5, 131], [5, 163], [5, 195], [5, 227], [0, 258]
        ];
        var DEFLATE_DISTANCE_MAP = [
            [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [1, 7], [2, 9], [2, 13],
            [3, 17], [3, 25], [4, 33], [4, 49], [5, 65], [5, 97], [6, 129],
            [6, 193], [7, 257], [7, 385], [8, 513], [8, 769], [9, 1025],
            [9, 1537], [10, 2049], [10, 3073], [11, 4097], [11, 6145],
            [12, 8193], [12, 12289], [13, 16385], [13, 24577]
        ];

        while (!done) {
            var done = newBitio.readUB(1);
            var type = newBitio.readUB(2);

            var distTable = {};
            var litTable = {};
            var fixedDistTable = false;
            var fixedLitTable = false;

            if (type) {
                if (type == 1) {
                    distTable = fixedDistTable;
                    litTable = fixedLitTable;

                    if (!distTable) {
                        var bitLengths = [];
                        for(var i = 32; i--;){
                            bitLengths[bitLengths.length] = 5;
                        }
                        distTable = fixedDistTable =
                            _buildHuffTable(bitLengths);
                    }

                    if (!litTable) {
                        var bitLengths = [];
                        var i = 0;

                        for(; i < 144; i++){
                            bitLengths[bitLengths.length] = 8;
                        }

                        for(; i < 256; i++){
                            bitLengths[bitLengths.length] = 9;
                        }

                        for(; i < 280; i++){
                            bitLengths[bitLengths.length] = 7;
                        }

                        for(; i < 288; i++){
                            bitLengths[bitLengths.length] = 8;
                        }

                        litTable = fixedLitTable =
                            _buildHuffTable(bitLengths);
                    }
                } else {
                    var numLitLengths = newBitio.readUB(5) + 257;
                    var numDistLengths = newBitio.readUB(5) + 1;
                    var numCodeLengths = newBitio.readUB(4) + 4;
                    var codeLengths =
                        [0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    for(var i = 0; i < numCodeLengths; i++){
                        codeLengths[DEFLATE_CODE_LENGTH_ORDER[i]] =
                            newBitio.readUB(3);
                    }
                    var codeTable = _buildHuffTable(codeLengths);
                    var litLengths = [];
                    var prevCodeLen = 0;
                    var maxLengths = numLitLengths + numDistLengths;
                    while (litLengths.length < maxLengths) {
                        var sym = _decodeSymbol(newBitio, codeTable);
                        switch (sym) {
                            case 16:
                                var i = newBitio.readUB(2) + 3;
                                while (i--) {
                                    litLengths[litLengths.length] =
                                        prevCodeLen;
                                }
                                break;
                            case 17:
                                var i = newBitio.readUB(3) + 3;
                                while (i--) {
                                    litLengths[litLengths.length] = 0;
                                }
                                break;
                            case 18:
                                var i = newBitio.readUB(7) + 11;
                                while (i--) {
                                    litLengths[litLengths.length] = 0;
                                }
                                break;
                            default:
                                if(sym <= 15){
                                    litLengths[litLengths.length] = sym;
                                    prevCodeLen = sym;
                                }
                                break;
                        }
                    }
                    distTable = _buildHuffTable(
                        litLengths.splice(numLitLengths, numDistLengths)
                    );
                    litTable = _buildHuffTable(litLengths);
                }

                while (sym != 256) {
                    var sym = _decodeSymbol(newBitio, litTable);
                    if (sym < 256) {
                        buff[buff.length] = (isDeCompress)
                            ? _fromCharCode(sym)
                            : sym;
                    } else if(sym > 256){
                        var lengthMap = DEFLATE_CODE_LENGTH_MAP[sym - 257];
                        var len = lengthMap[1]
                            + newBitio.readUB(lengthMap[0]);
                        var distMap =
                            DEFLATE_DISTANCE_MAP[
                                _decodeSymbol(newBitio, distTable)
                            ];
                        var dist = distMap[1]
                            + newBitio.readUB(distMap[0]);
                        var i = buff.length - dist;
                        while (len--) {
                            buff[buff.length] = buff[i++];
                        }
                    }
                }
            } else {
                newBitio.bit_offset = 8;
                var len = newBitio.readNumber(2);
                var nlen = newBitio.readNumber(2);

                if (isDeCompress) {
                    var string = newBitio.readString(len);
                    buff[buff.length] = string;
                } else {
                    while (len--) {
                        buff[buff.length] = newBitio.readNumber(1);
                    }
                }
            }
        }

        return (isDeCompress)
            ? buff.join('')
            : buff;
    }

    /**
     * buildHuffTable
     * @param bitLengths
     * @returns {{}}
     */
    function buildHuffTable(bitLengths)
    {
        var numLengths = bitLengths.length;
        var blCount = [];
        var maxBits = _max.apply(Math, bitLengths) + 1;
        var nextCode = [];
        var code = 0;
        var table = {};
        var i = numLengths;

        while (i--) {
            var len = bitLengths[i];
            blCount[len] = (blCount[len] || 0) + (len > 0);
        }

        for (i = 1; i < maxBits; i++) {
            len = i - 1;
            if (blCount[len] == undefined) {
                blCount[len] = 0;
            }

            code = (code + blCount[len]) << 1;
            nextCode[i] = code;
        }

        for (i = 0; i < numLengths; i++) {
            len = bitLengths[i];
            if (len) {
                table[nextCode[len]] = {
                    length: len,
                    symbol: i
                };
                nextCode[len]++;
            }
        }
        return table;
    }

    /**
     * decodeSymbol
     * @param b
     * @param table
     * @returns {*}
     */
    function decodeSymbol(b, table)
    {
        var code = 0;
        var len = 0;
        while (true) {
            code = (code << 1) | b.readUB(1);
            len++;
            var entry = table[code];
            if (entry != undefined && entry.length == len) {
                return entry.symbol;
            }
        }
    }

    /**
     * deleteCss
     */
    function deleteCss()
    {
        // loading 削除
        var div = _document.getElementById('swf2js_loading');
        if (div) {
            var node = div.parentNode;
            node.removeChild(div);
        }

        // css 削除
        var div = _document.getElementById('swf2js');
        var childNodes = div.childNodes;
        if (childNodes[0]) {
            div.removeChild(childNodes[0]);
        }
    }

    /**
     * base64encode
     * @param str
     * @returns {string}
     */
    function base64encode(str)
    {
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out = [];
        var i = 0;
        var len = str.length;

        while (i < len) {
            var c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out[out.length] = base64EncodeChars.charAt(c1 >> 2);
                out[out.length] = base64EncodeChars.charAt((c1 & 0x3) << 4);
                out[out.length] = '==';
                break;
            }

            var c2 = str.charCodeAt(i++);
            if (i == len) {
                out[out.length] = base64EncodeChars.charAt(c1 >> 2);
                out[out.length] = base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
                out[out.length] = base64EncodeChars.charAt((c2 & 0xF) << 2);
                out[out.length] = '=';
                break;
            }

            var c3 = str.charCodeAt(i++);
            out[out.length] = base64EncodeChars.charAt(c1 >> 2);
            out[out.length] = base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
            out[out.length] = base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
            out[out.length] = base64EncodeChars.charAt(c3 & 0x3F);
        }

        return out.join('');
    }

    /**
     * parseJpegData
     * @param JPEGData
     * @param jpegTables
     * @returns {string}
     */
    function parseJpegData(JPEGData, jpegTables)
    {
        var newBitio = new BitIO();
        newBitio.setData(JPEGData);

        var marker;
        var dqt = '';
        var dht = '';
        var len = 0;

        while (marker = newBitio.getUI16BE()) {
            switch (marker) {
                case 0xFFD8: // SOI
                case 0xFFD9: // EOI
                    break;
                default:
                    len = newBitio.getUI16BE();
                    newBitio.incrementOffset(len - 2, 0);
                    break;
                case 0xFFC0: // SOF0
                case 0xFFC2: // SOF2
                    len = newBitio.getUI16BE();
                    newBitio.incrementOffset(-4, 0);
                    var sof = newBitio.getData(len + 2);
                    break;
                case 0xFFDB: // DQT
                    len = newBitio.getUI16BE();
                    newBitio.incrementOffset(-4, 0);
                    dqt += newBitio.getData(len + 2);
                    break;
                case 0xFFC4: // DHT
                    len = newBitio.getUI16BE();
                    newBitio.incrementOffset(-4, 0);
                    dht += newBitio.getData(len + 2);
                    break;
                case 0xFFDA: // SOS
                    newBitio.incrementOffset(-2, 0);
                    var sos_eoi = newBitio.getDataUntil(null);
                    break;
            }
        }

        var dqt_dht = (typeof dqt === '')
            ? jpegTables
            : dqt + dht;

        return "\xFF\xD8" + sof + dqt_dht + sos_eoi;
    }

    /**
     * isFontInstalled
     * @param fontName
     * @returns {boolean}
     */
    function isFontInstalled(fontName)
    {
        var text = "this is test text.";
        var canvasA = baseCanvas.cloneNode(false);
        var contextA = canvasA.getContext("2d");
        contextA.font = "30px '"+ fontName +"', serif";
        var textA = contextA.measureText(text);

        var canvasB = baseCanvas.cloneNode(false);
        var contextB = canvasB.getContext("2d");
        contextB.font = "30px serif";
        var textB = contextB.measureText(text);

        contextA = void 0;
        contextB = void 0;
        return (textA.width != textB.width);
    }

    /**
     * setStyle
     * @param context
     * @param key
     * @param value
     */
    function setStyle(context, key, value)
    {
        context[key] = value;
    }

    // shift-jis
    var JCT11280 = new Function('var a="zKV33~jZ4zN=~ji36XazM93y!{~k2y!o~k0ZlW6zN?3Wz3W?{EKzK[33[`y|;-~j^YOTz$!~kNy|L1$353~jV3zKk3~k-4P4zK_2+~jY4y!xYHR~jlz$_~jk4z$e3X5He<0y!wy|X3[:~l|VU[F3VZ056Hy!nz/m1XD61+1XY1E1=1y|bzKiz!H034zKj~mEz#c5ZA3-3X$1~mBz$$3~lyz#,4YN5~mEz#{ZKZ3V%7Y}!J3X-YEX_J(3~mAz =V;kE0/y|F3y!}~m>z/U~mI~j_2+~mA~jp2;~m@~k32;~m>V}2u~mEX#2x~mBy+x2242(~mBy,;2242(~may->2&XkG2;~mIy-_2&NXd2;~mGz,{4<6:.:B*B:XC4>6:.>B*BBXSA+A:X]E&E<~r#z+625z s2+zN=`HXI@YMXIAXZYUM8X4K/:Q!Z&33 3YWX[~mB`{zKt4z (zV/z 3zRw2%Wd39]S11z$PAXH5Xb;ZQWU1ZgWP%3~o@{Dgl#gd}T){Uo{y5_d{e@}C(} WU9|cB{w}bzvV|)[} H|zT}d||0~{]Q|(l{|x{iv{dw}(5}[Z|kuZ }cq{{y|ij}.I{idbof%cu^d}Rj^y|-M{ESYGYfYsZslS`?ZdYO__gLYRZ&fvb4oKfhSf^d<Yeasc1f&a=hnYG{QY{D`Bsa|u,}Dl|_Q{C%xK|Aq}C>|c#ryW=}eY{L+`)][YF_Ub^h4}[X|?r|u_ex}TL@YR]j{SrXgo*|Gv|rK}B#mu{R1}hs|dP{C7|^Qt3|@P{YVV |8&}#D}ef{e/{Rl|>Hni}R1{Z#{D[}CQlQ||E}[s{SG_+i8eplY[=[|ec[$YXn#`hcm}YR|{Ci(_[ql|?8p3]-}^t{wy}4la&pc|3e{Rp{LqiJ],] `kc(]@chYnrM`O^,ZLYhZB]ywyfGY~aex!_Qww{a!|)*lHrM{N+n&YYj~Z b c#e_[hZSon|rOt`}hBXa^i{lh|<0||r{KJ{kni)|x,|0auY{D!^Sce{w;|@S|cA}Xn{C1h${E]Z-XgZ*XPbp]^_qbH^e[`YM|a||+=]!Lc}]vdBc=j-YSZD]YmyYLYKZ9Z>Xcczc2{Yh}9Fc#Z.l{}(D{G{{mRhC|L3b#|xK[Bepj#ut`H[,{E9Yr}1b{[e]{ZFk7[ZYbZ0XL]}Ye[(`d}c!|*y`Dg=b;gR]Hm=hJho}R-[n}9;{N![7k_{UbmN]rf#pTe[x8}!Qcs_rs[m`|>N}^V})7{^r|/E}),}HH{OYe2{Skx)e<_.cj.cjoMhc^d}0uYZd!^J_@g,[[[?{i@][|3S}Yl3|!1|eZ|5IYw|1D}e7|Cv{OHbnx-`wvb[6[4} =g+k:{C:}ed{S]|2M]-}WZ|/q{LF|dYu^}Gs^c{Z=}h>|/i|{W]:|ip{N:|zt|S<{DH[p_tvD{N<[8Axo{X4a.^o^X>Yfa59`#ZBYgY~_t^9`jZHZn`>G[oajZ;X,i)Z.^~YJe ZiZF^{][[#Zt^|]Fjx]&_5dddW]P0C[-]}]d|y {C_jUql] |OpaA[Z{lp|rz}:Mu#]_Yf6{Ep?f5`$[6^D][^u[$[6^.Z8]]ePc2U/=]K^_+^M{q*|9tYuZ,s(dS{i=|bNbB{uG}0jZOa:[-]dYtu3]:]<{DJ_SZIqr_`l=Yt`gkTnXb3d@kiq0a`Z{|!B|}e}Ww{Sp,^Z|0>_Z}36|]A|-t}lt{R6pi|v8hPu#{C>YOZHYmg/Z4nicK[}hF_Bg|YRZ7c|crkzYZY}_iXcZ.|)U|L5{R~qi^Uga@Y[xb}&qdbd6h5|Btw[}c<{Ds53[Y7]?Z<|e0{L[ZK]mXKZ#Z2^tavf0`PE[OSOaP`4gi`qjdYMgys/?[nc,}EEb,eL]g[n{E_b/vcvgb.{kcwi`~v%|0:|iK{Jh_vf5lb}KL|(oi=LrzhhY_^@`zgf[~g)[J_0fk_V{T)}I_{D&_/d9W/|MU[)f$xW}?$xr4<{Lb{y4}&u{XJ|cm{Iu{jQ}CMkD{CX|7A}G~{kt)nB|d5|<-}WJ}@||d@|Iy}Ts|iL|/^|no|0;}L6{Pm]7}$zf:|r2}?C_k{R(}-w|`G{Gy[g]bVje=_0|PT{^Y^yjtT[[[l!Ye_`ZN]@[n_)j3nEgMa]YtYpZy].d-Y_cjb~Y~[nc~sCi3|zg}B0}do{O^{|$`_|D{}U&|0+{J3|8*]iayx{a{xJ_9|,c{Ee]QXlYb]$[%YMc*]w[aafe]aVYi[fZEii[xq2YQZHg]Y~h#|Y:thre^@^|_F^CbTbG_1^qf7{L-`VFx Zr|@EZ;gkZ@slgko`[e}T:{Cu^pddZ_`yav^Ea+[#ZBbSbO`elQfLui}.F|txYcbQ`XehcGe~fc^RlV{D_0ZAej[l&jShxG[ipB_=u:eU}3e8[=j|{D(}dO{Do[BYUZ0/]AYE]ALYhZcYlYP/^-^{Yt_1_-;YT`P4BZG=IOZ&]H[e]YYd[9^F[1YdZxZ?Z{Z<]Ba2[5Yb[0Z4l?]d_;_)a?YGEYiYv`_XmZs4ZjY^Zb]6gqGaX^9Y}dXZr[g|]Y}K aFZp^k^F]M`^{O1Ys]ZCgCv4|E>}8eb7}l`{L5[Z_faQ|c2}Fj}hw^#|Ng|B||w2|Sh{v+[G}aB|MY}A{|8o}X~{E8paZ:]i^Njq]new)`-Z>haounWhN}c#{DfZ|fK]KqGZ=:u|fqoqcv}2ssm}.r{]{nIfV{JW)[K|,Z{Uxc|]l_KdCb%]cfobya3`p}G^|LZiSC]U|(X|kBlVg[kNo({O:g:|-N|qT}9?{MBiL}Sq{`P|3a|u.{Uaq:{_o|^S}jX{Fob0`;|#y_@[V[K|cw[<_ }KU|0F}d3|et{Q7{LuZttsmf^kYZ`Af`}$x}U`|Ww}d]| >}K,r&|XI|*e{C/a-bmr1fId4[;b>tQ_:]hk{b-pMge]gfpo.|(w[jgV{EC1Z,YhaY^q,_G[c_g[J0YX]`[h^hYK^_Yib,` {i6vf@YM^hdOKZZn(jgZ>bzSDc^Z%[[o9[2=/YHZ(_/Gu_`*|8z{DUZxYt^vuvZjhi^lc&gUd4|<UiA`z]$b/Z?l}YI^jaHxe|;F}l${sQ}5g}hA|e4}?o{ih}Uz{C)jPe4]H^J[Eg[|AMZMlc}:,{iz}#*|gc{Iq|/:|zK{l&}#u|myd{{M&v~nV};L|(g|I]ogddb0xsd7^V})$uQ{HzazsgxtsO^l}F>ZB]r|{7{j@cU^{{CbiYoHlng]f+nQ[bkTn/}<-d9q {KXadZYo+n|l[|lc}V2{[a{S4Zam~Za^`{HH{xx_SvF|ak=c^[v^7_rYT`ld@]:_ub%[$[m](Shu}G2{E.ZU_L_R{tz`vj(f?^}hswz}GdZ}{S:h`aD|?W|`dgG|if{a8|J1{N,}-Ao3{H#{mfsP|[ bzn+}_Q{MT{u4kHcj_q`eZj[8o0jy{p7}C|[}l){MuYY{|Ff!Ykn3{rT|m,^R|,R}$~Ykgx{P!]>iXh6[l[/}Jgcg{JYZ.^qYfYIZl[gZ#Xj[Pc7YyZD^+Yt;4;`e8YyZVbQ7YzZxXja.7SYl[s]2^/Ha$[6ZGYrb%XiYdf2]H]kZkZ*ZQ[ZYS^HZXcCc%Z|[(bVZ]]:OJQ_DZCg<[,]%Zaa [g{C00HY[c%[ChyZ,Z_`PbXa+eh`^&jPi0a[ggvhlekL]w{Yp^v}[e{~;k%a&k^|nR_z_Qng}[E}*Wq:{k^{FJZpXRhmh3^p>de^=_7`|ZbaAZtdhZ?n4ZL]u`9ZNc3g%[6b=e.ZVfC[ZZ^^^hD{E(9c(kyZ=bb|Sq{k`|vmr>izlH[u|e`}49}Y%}FT{[z{Rk}Bz{TCc/lMiAqkf(m$hDc;qooi[}^o:c^|Qm}a_{mrZ(pA`,}<2sY| adf_%|}`}Y5U;}/4|D>|$X{jw{C<|F.hK|*A{MRZ8Zsm?imZm_?brYWZrYx`yVZc3a@f?aK^ojEd {bN}/3ZH]/$YZhm^&j 9|(S|b]mF}UI{q&aM]LcrZ5^.|[j`T_V_Gak}9J[ ZCZD|^h{N9{~&[6Zd{}B}2O|cv]K}3s}Uy|l,fihW{EG`j_QOp~Z$F^zexS`dcISfhZBXP|.vn|_HYQ|)9|cr]<`&Z6]m_(ZhPcSg>`Z]5`~1`0Xcb4k1{O!bz|CN_T{LR|a/gFcD|j<{Z._[f)mPc:1`WtIaT1cgYkZOaVZOYFrEe[}T$}Ch}mk{K-^@]fH{Hdi`c*Z&|Kt{if[C{Q;{xYB`dYIX:ZB[}]*[{{p9|4GYRh2ao{DS|V+[zd$`F[ZXKadb*A] Ys]Maif~a/Z2bmclb8{Jro_rz|x9cHojbZ{GzZx_)]:{wAayeDlx}<=`g{H1{l#}9i|)=|lP{Qq}.({La|!Y{i2EZfp=c*}Cc{EDvVB|;g}2t{W4av^Bn=]ri,|y?|3+}T*ckZ*{Ffr5e%|sB{lx^0]eZb]9[SgAjS_D|uHZx]dive[c.YPkcq/}db{EQh&hQ|eg}G!ljil|BO]X{Qr_GkGl~YiYWu=c3eb}29v3|D|}4i||.{Mv})V{SP1{FX}CZW6{cm|vO{pS|e#}A~|1i}81|Mw}es|5[}3w{C`h9aL]o{}p[G`>i%a1Z@`Ln2bD[$_h`}ZOjhdTrH{[j_:k~kv[Sdu]CtL}41{I |[[{]Zp$]XjxjHt_eThoa#h>sSt8|gK|TVi[Y{t=}Bs|b7Zpr%{gt|Yo{CS[/{iteva|cf^hgn}($_c^wmb^Wm+|55jrbF|{9^ q6{C&c+ZKdJkq_xOYqZYSYXYl`8]-cxZAq/b%b*_Vsa[/Ybjac/OaGZ4fza|a)gY{P?| I|Y |,pi1n7}9bm9ad|=d{aV|2@[(}B`d&|Uz}B}{`q|/H|!JkM{FU|CB|.{}Az}#P|lk}K{|2rk7{^8^?`/|k>|Ka{Sq}Gz}io{DxZh[yK_#}9<{TRdgc]`~Z>JYmYJ]|`!ZKZ]gUcx|^E[rZCd`f9oQ[NcD_$ZlZ;Zr}mX|=!|$6ZPZYtIo%fj}CpcN|B,{VDw~gb}@hZg`Q{LcmA[(bo`<|@$|o1|Ss}9Z_}tC|G`{F/|9nd}i=}V-{L8aaeST]daRbujh^xlpq8|}zs4bj[S`J|]?G{P#{rD{]I`OlH{Hm]VYuSYUbRc*6[j`8]pZ[bt_/^Jc*[<Z?YE|Xb|?_Z^Vcas]h{t9|Uwd)_(=0^6Zb{Nc} E[qZAeX[a]P^|_J>e8`W^j_Y}R{{Jp__]Ee#e:iWb9q_wKbujrbR}CY`,{mJ}gz{Q^{t~N|? gSga`V_||:#mi}3t|/I`X{N*|ct|2g{km}gi|{={jC}F;|E}{ZZjYf*frmu}8Tdroi{T[|+~}HG{cJ}DM{Lp{Ctd&}$hi3|FZ| m}Kr|38}^c|m_|Tr{Qv|36}?Up>|;S{DV{k_as}BK{P}}9p|t`jR{sAm4{D=b4pWa[}Xi{EjwEkI}3S|E?u=X0{jf} S|NM|JC{qo^3cm]-|JUx/{Cj{s>{Crt[UXuv|D~|j|d{YXZR}Aq}0r}(_{pJfi_z}0b|-vi)Z mFe,{f4|q`b{}^Z{HM{rbeHZ|^x_o|XM|L%|uFXm}@C_{{Hhp%a7|0p[Xp+^K}9U{bP}: tT}B|}+$|b2|[^|~h{FAby[`{}xgygrt~h1[li`c4vz|,7p~b(|mviN}^pg[{N/|g3|^0c,gE|f%|7N{q[|tc|TKA{LU}I@|AZp(}G-sz{F |qZ{}F|f-}RGn6{Z]_5})B}UJ{FFb2]4ZI@v=k,]t_Dg5Bj]Z-]L]vrpdvdGlk|gF}G]|IW}Y0[G| /bo|Te^,_B}#n^^{QHYI[?hxg{[`]D^IYRYTb&kJ[cri[g_9]Ud~^_]<p@_e_XdNm-^/|5)|h_{J;{kacVopf!q;asqd}n)|.m|bf{QW|U)}b+{tL|w``N|to{t ZO|T]jF}CB|0Q{e5Zw|k |We}5:{HO{tPwf_uajjBfX}-V_C_{{r~gg|Ude;s+}KNXH}! `K}eW{Upwbk%ogaW}9EYN}YY|&v|SL{C3[5s.]Y]I]u{M6{pYZ`^,`ZbCYR[1mNg>rsk0Ym[jrE]RYiZTr*YJ{Ge|%-lf|y(`=[t}E6{k!|3)}Zk} ][G{E~cF{u3U.rJ|a9p#o#ZE|?|{sYc#vv{E=|LC}cu{N8`/`3`9rt[4|He{cq|iSYxY`}V |(Q|t4{C?]k_Vlvk)BZ^r<{CL}#h}R+[<|i=}X|{KAo]|W<`K{NW|Zx}#;|fe{IMr<|K~tJ_x}AyLZ?{GvbLnRgN}X&{H7|x~}Jm{]-| GpNu0}.ok>|c4{PYisrDZ|fwh9|hfo@{H~XSbO]Odv]%`N]b1Y]]|eIZ}_-ZA]aj,>eFn+j[aQ_+]h[J_m_g]%_wf.`%k1e#Z?{CvYu_B^|gk`Xfh^M3`afGZ-Z|[m{L}|k3cp[it ^>YUi~d>{T*}YJ{Q5{Jxa$hg|%4`}|LAgvb }G}{P=|<;Ux{_skR{cV|-*|s-{Mp|XP|$G|_J}c6cM{_=_D|*9^$ec{V;|4S{qO|w_|.7}d0|/D}e}|0G{Dq]Kdp{}dfDi>}B%{Gd|nl}lf{C-{y}|ANZr}#={T~|-(}c&{pI|ft{lsVP}){|@u}!W|bcmB{d?|iW|:dxj{PSkO|Hl]Li:}VYk@|2={fnWt{M3`cZ6|)}|Xj}BYa?vo{e4|L7|B7{L7|1W|lvYO}W8nJ|$Vih|{T{d*_1|:-n2dblk``fT{Ky|-%}m!|Xy|-a{Pz}[l{kFjz|iH}9N{WE{x,|jz}R {P|{D)c=nX|Kq|si}Ge{sh|[X{RF{t`|jsr*fYf,rK|/9}$}}Nf{y!1|<Std}4Wez{W${Fd_/^O[ooqaw_z[L`Nbv[;l7V[ii3_PeM}.h^viqYjZ*j1}+3{bt{DR[;UG}3Og,rS{JO{qw{d<_zbAh<R[1_r`iZTbv^^a}c{iEgQZ<exZFg.^Rb+`Uj{a+{z<[~r!]`[[|rZYR|?F|qppp]L|-d|}K}YZUM|=Y|ktm*}F]{D;g{uI|7kg^}%?Z%ca{N[_<q4xC]i|PqZC]n}.bDrnh0Wq{tr|OMn6tM|!6|T`{O`|>!]ji+]_bTeU}Tq|ds}n|{Gm{z,f)}&s{DPYJ`%{CGd5v4tvb*hUh~bf]z`jajiFqAii]bfy^U{Or|m+{I)cS|.9k:e3`^|xN}@Dnlis`B|Qo{`W|>||kA}Y}{ERYuYx`%[exd`]|OyiHtb}HofUYbFo![5|+]gD{NIZR|Go}.T{rh^4]S|C9_}xO^i`vfQ}C)bK{TL}cQ|79iu}9a];sj{P.o!f[Y]pM``Jda^Wc9ZarteBZClxtM{LW}l9|a.mU}KX}4@{I+f1}37|8u}9c|v${xGlz}jP{Dd1}e:}31}%3X$|22i<v+r@~mf{sN{C67G97855F4YL5}8f{DT|xy{sO{DXB334@55J1)4.G9A#JDYtXTYM4, YQD9;XbXm9SX]IB^4UN=Xn<5(;(F3YW@XkH-X_VM[DYM:5XP!T&Y`6|,^{IS-*D.H>:LXjYQ0I3XhAF:9:(==.F*3F1189K/7163D,:@|e2{LS36D4hq{Lw/84443@4.933:0307::6D7}&l{Mx657;89;,K5678H&93D(H<&<>0B90X^I;}Ag1{P%3A+>><975}[S{PZE453?4|T2{Q+5187;>447:81{C=hL6{Me^:=7ii{R=.=F<81;48?|h8}Uh{SE|,VxL{ST,7?9Y_5Xk3A#:$%YSYdXeKXOD8+TXh7(@>(YdXYHXl9J6X_5IXaL0N?3YK7Xh!1?XgYz9YEXhXaYPXhC3X`-YLY_XfVf[EGXZ5L8BXL9YHX]SYTXjLXdJ: YcXbQXg1PX]Yx4|Jr{Ys4.8YU+XIY`0N,<H%-H;:0@,74/:8546I=9177154870UC]d<C3HXl7ALYzXFXWP<<?E!88E5@03YYXJ?YJ@6YxX-YdXhYG|9o{`iXjY_>YVXe>AYFX[/(I@0841?):-B=14337:8=|14{c&93788|di{cW-0>0<097/A;N{FqYpugAFT%X/Yo3Yn,#=XlCYHYNX[Xk3YN:YRT4?)-YH%A5XlYF3C1=NWyY}>:74-C673<69545v {iT85YED=64=.F4..9878/D4378?48B3:7:7/1VX[f4{D,{l<5E75{dAbRB-8-@+;DBF/$ZfW8S<4YhXA.(5@*11YV8./S95C/0R-A4AXQYI7?68167B95HA1*<M3?1/@;/=54XbYP36}lc{qzSS38:19?,/39193574/66878Yw1X-87E6=;964X`T734:>86>1/=0;(I-1::7ALYGXhF+Xk[@W%TYbX7)KXdYEXi,H-XhYMRXfYK?XgXj.9HX_SX]YL1XmYJ>Y}WwIXiI-3-GXcYyXUYJ$X`Vs[7;XnYEZ;XF! 3;%8;PXX(N3Y[)Xi1YE&/ :;74YQ6X`33C;-(>Xm0(TYF/!YGXg8 9L5P01YPXO-5%C|qd{{/K/E6,=0144:361:955;6443@?B7*7:F89&F35YaX-CYf,XiFYRXE_e{}sF 0*7XRYPYfXa5YXXY8Xf8Y~XmA[9VjYj*#YMXIYOXk,HHX40YxYMXU8OXe;YFXLYuPXP?EB[QV0CXfY{:9XV[FWE0D6X^YVP*$4%OXiYQ(|xp|%c3{}V`1>Y`XH00:8/M6XhQ1:;3414|TE|&o@1*=81G8<3}6<|(f6>>>5-5:8;093B^3U*+*^*UT30XgYU&7*O1953)5@E78--F7YF*B&0:%P68W9Zn5974J9::3}Vk|-,C)=)1AJ4+<3YGXfY[XQXmT1M-XcYTYZXCYZXEYXXMYN,17>XIG*SaS|/eYJXbI?XdNZ+WRYP<F:R PXf;0Xg`$|1GX9YdXjLYxWX!ZIXGYaXNYm6X9YMX?9EXmZ&XZ#XQ>YeXRXfAY[4 ;0X!Zz0XdN$XhYL XIY^XGNXUYS/1YFXhYk.TXn4DXjB{jg|4DEX]:XcZMW=A.+QYL<LKXc[vV$+&PX*Z3XMYIXUQ:ZvW< YSXFZ,XBYeXMM)?Xa XiZ4/EXcP3%}&-|6~:1(-+YT$@XIYRBC<}&,|7aJ6}bp|8)K1|Xg|8C}[T|8Q.89;-964I38361<=/;883651467<7:>?1:.}le|:Z=39;1Y^)?:J=?XfLXbXi=Q0YVYOXaXiLXmJXO5?.SFXiCYW}-;|=u&D-X`N0X^,YzYRXO(QX_YW9`I|>hZ:N&X)DQXP@YH#XmNXi$YWX^=!G6YbYdX>XjY|XlX^XdYkX>YnXUXPYF)FXT[EVTMYmYJXmYSXmNXi#GXmT3X8HOX[ZiXN]IU2>8YdX1YbX<YfWuZ8XSXcZU%0;1XnXkZ_WTG,XZYX5YSX Yp 05G?XcYW(IXg6K/XlYP4XnI @XnO1W4Zp-9C@%QDYX+OYeX9>--YSXkD.YR%Q/Yo YUX].Xi<HYEZ2WdCE6YMXa7F)=,D>-@9/8@5=?7164;35387?N<618=6>7D+C50<6B03J0{Hj|N9$D,9I-,.KB3}m |NzE0::/81YqXjMXl7YG; [.W=Z0X4XQY]:MXiR,XgM?9$9>:?E;YE77VS[Y564760391?14941:0=:8B:;/1DXjFA-564=0B3XlH1+D85:0Q!B#:-6&N/:9<-R3/7Xn<*3J4.H:+334B.=>30H.;3833/76464665755:/83H6633:=;.>5645}&E|Y)?1/YG-,93&N3AE@5 <L1-G/8A0D858/30>8<549=@B8] V0[uVQYlXeD(P#ID&7T&7;Xi0;7T-$YE)E=1:E1GR):--0YI7=E<}n9|aT6783A>D7&4YG7=391W;Zx<5+>F#J39}o/|cc;6=A050EQXg8A1-}D-|d^5548083563695D?-.YOXd37I$@LYLWeYlX<Yd+YR A$;3-4YQ-9XmA0!9/XLY_YT(=5XdDI>YJ5XP1ZAW{9>X_6R(XhYO65&J%DA)C-!B:97#A9;@?F;&;(9=11/=657/H,<8}bz|j^5446>.L+&Y^8Xb6?(CYOXb*YF(8X`FYR(XPYVXmPQ%&DD(XmZXW??YOXZXfCYJ79,O)XnYF7K0!QXmXi4IYFRXS,6<%-:YO(+:-3Q!1E1:W,Zo}Am|n~;3580534*?3Zc4=9334361693:30C<6/717:<1/;>59&:4}6!|rS36=1?75<8}[B|s809983579I.A.>84758=108564741H*9E{L{|u%YQ<%6XfH.YUXe4YL@,>N}Tv|ve*G0X)Z;/)3@A74(4P&A1X:YVH97;,754*A66:1 D739E3553545558E4?-?K17/770843XAYf838A7K%N!YW4.$T19Z`WJ*0XdYJXTYOXNZ 1XaN1A+I&Xi.Xk3Z3GB&5%WhZ1+5#Y[X<4YMXhQYoQXVXbYQ8XSYUX4YXBXWDMG0WxZA[8V+Z8X;D],Va$%YeX?FXfX[XeYf<X:Z[WsYz8X_Y]%XmQ(!7BXIZFX]&YE3F$(1XgYgYE& +[+W!<YMYFXc;+PXCYI9YrWxGXY9DY[!GXiI7::)OC;*$.>N*HA@{C|}&k=:<TB83X`3YL+G4XiK]i}(fYK<=5$.FYE%4*5*H*6XkCYL=*6Xi6!Yi1KXR4YHXbC8Xj,B9ZbWx/XbYON#5B}Ue}+QKXnF1&YV5XmYQ0!*3IXBYb71?1B75XmF;0B976;H/RXU:YZX;BG-NXj;XjI>A#D3B636N;,*%<D:0;YRXY973H5)-4FXOYf0:0;/7759774;7;:/855:543L43<?6=E,.A4:C=L)%4YV!1(YE/4YF+ F3%;S;&JC:%/?YEXJ4GXf/YS-EXEYW,9;E}X$}547EXiK=51-?71C%?57;5>463553Zg90;6447?<>4:9.7538XgN{|!}9K/E&3-:D+YE1)YE/3;37/:05}n<}:UX8Yj4Yt864@JYK..G=.(A Q3%6K>3(P3#AYE$-6H/456*C=.XHY[#S.<780191;057C)=6HXj?955B:K1 E>-B/9,;5.!L?:0>/.@//:;7833YZ56<4:YE=/:7Z_WGC%3I6>XkC*&NA16X=Yz2$X:Y^&J48<99k8}CyB-61<18K946YO4{|N}E)YIB9K0L>4=46<1K0+R;6-=1883:478;4,S+3YJX`GJXh.Yp+Xm6MXcYpX(>7Yo,/:X=Z;Xi0YTYHXjYmXiXj;*;I-8S6N#XgY}.3XfYGO3C/$XjL$*NYX,1 6;YH&<XkK9C#I74.>}Hd`A748X[T450[n75<4439:18A107>|ET}Rf<1;14876/Yb983E<5.YNXd4149>,S=/4E/<306443G/06}0&}UkYSXFYF=44=-5095=88;63844,9E6644{PL}WA8:>)7+>763>>0/B3A545CCnT}Xm|dv}Xq1L/YNXk/H8;;.R63351YY747@15YE4J8;46;.38.>4A369.=-83,;Ye3?:3@YE.4-+N353;/;@(X[YYD>@/05-I*@.:551741Yf5>6A443<3535;.58/86=D4753442$635D1>0359NQ @73:3:>><Xn?;43C14 ?Y|X611YG1&<+,4<*,YLXl<1/AIXjF*N89A4Z576K1XbJ5YF.ZOWN.YGXO/YQ01:4G38Xl1;KI0YFXB=R<7;D/,/4>;$I,YGXm94@O35Yz66695385.>:6A#5}W7n^4336:4157597434433<3|XA}m`>=D>:4A.337370?-6Q96{`E|4A}C`|Qs{Mk|J+~r>|o,wHv>Vw}!c{H!|Gb|*Ca5}J||,U{t+{CN[!M65YXOY_*B,Y[Z9XaX[QYJYLXPYuZ%XcZ8LY[SYPYKZM<LMYG9OYqSQYM~[e{UJXmQYyZM_)>YjN1~[f3{aXFY|Yk:48YdH^NZ0|T){jVFYTZNFY^YTYN~[h{nPYMYn3I]`EYUYsYIZEYJ7Yw)YnXPQYH+Z.ZAZY]^Z1Y`YSZFZyGYHXLYG 8Yd#4~[i|+)YH9D?Y^F~Y7|-eYxZ^WHYdYfZQ~[j|3>~[k|3oYmYqY^XYYO=Z*4[]Z/OYLXhZ1YLZIXgYIHYEYK,<Y`YEXIGZI[3YOYcB4SZ!YHZ*&Y{Xi3~[l|JSY`Zz?Z,~[m|O=Yi>??XnYWXmYS617YVYIHZ(Z4[~L4/=~[n|Yu{P)|];YOHHZ}~[o33|a>~[r|aE]DH~[s|e$Zz~[t|kZFY~XhYXZB[`Y}~[u|{SZ&OYkYQYuZ2Zf8D~[v}% ~[w3},Q[X]+YGYeYPIS~[y}4aZ!YN^!6PZ*~[z}?E~[{3}CnZ=~[}}EdDZz/9A3(3S<,YR8.D=*XgYPYcXN3Z5 4)~[~}JW=$Yu.XX~] }KDX`PXdZ4XfYpTJLY[F5]X~[2Yp}U+DZJ::<446[m@~]#3}]1~]%}^LZwZQ5Z`/OT<Yh^ -~]&}jx[ ~m<z!%2+~ly4VY-~o>}p62yz!%2+Xf2+~ly4VY-zQ`z (=] 2z~o2",C={" ":0,"!":1},c=34,i=2,p,s="",u=String.fromCharCode,t=u(12539);while(++c<127)C[u(c)]=c^39&&c^92?i++:0;i=0;while(0<=(c=C[a.charAt(i++)]))if(16==c)if((c=C[a.charAt(i++)])<87){if(86==c)c=1879;while(c--)s+=u(++p)}else s+=s.substr(8272,360);else if(c<86)s+=u(p+=c<51?c-16:(c-55)*92+C[a.charAt(i++)]);else if((c=((c-86)*92+C[a.charAt(i++)])*92+C[a.charAt(i++)])<49152)s+=u(p=c<40960?c:c|57344);else{c&=511;while(c--)s+=t;p=12539}return s')();
    function decodeToShiftJis(str)
    {
        return str.replace(/%(8[1-9A-F]|[9E][0-9A-F]|F[0-9A-C])(%[4-689A-F][0-9A-F]|%7[0-9A-E]|[@-~])|%([0-7][0-9A-F]|A[1-9A-F]|[B-D][0-9A-F])/ig,
            function(s)
            {
                var c = _parseInt(s.substring(1,3), 16), l = s.length;
                return 3==l?_fromCharCode(c<160?c:c+65216):JCT11280.charAt((c<160?c-129:c-193)*188+(4==l?s.charCodeAt(3)-64:(c=_parseInt(s.substring(4),16))<127?c-64:c-65))
            }
        );
    }
})(this);