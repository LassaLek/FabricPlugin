'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FabricCrashlytics = (function () {
    function FabricCrashlytics() {
        _classCallCheck(this, FabricCrashlytics);
    }

    _createClass(FabricCrashlytics, [{
        key: 'addLog',
        value: function addLog(message) {
            window.fabric.core.execPlugin('addLog', [message]);
        }
    }, {
        key: 'sendCrash',
        value: function sendCrash() {
            window.fabric.core.execPlugin('sendCrash', []);
        }
    }, {
        key: 'sendNonFatalCrash',
        value: function sendNonFatalCrash(message) {
            window.fabric.core.execPlugin('sendNonFatalCrash', [message]);
        }
    }, {
        key: 'recordError',
        value: function recordError(message, code) {
            var lines = code.split('\n');
            window.fabric.core.execPlugin('recordError', [lines[0]||message, parse(lines)]);
        }
    }, {
        key: 'setUserIdentifier',
        value: function setUserIdentifier(userIdentifier) {
            window.fabric.core.execPlugin('setUserIdentifier', [userIdentifier]);
        }
    }, {
        key: 'setUserName',
        value: function setUserName(userName) {
            window.fabric.core.execPlugin('setUserName', [userName]);
        }
    }, {
        key: 'setUserEmail',
        value: function setUserEmail(userEmail) {
            window.fabric.core.execPlugin('setUserEmail', [userEmail]);
        }
    }, {
        key: 'setStringValueForKey',
        value: function setStringValueForKey(value, key) {
            window.fabric.core.execPlugin('setStringValueForKey', [value, key]);
        }
    }, {
        key: 'setIntValueForKey',
        value: function setIntValueForKey(value, key) {
            window.fabric.core.execPlugin('setIntValueForKey', [value, key]);
        }
    }, {
        key: 'setBoolValueForKey',
        value: function setBoolValueForKey(value, key) {
            window.fabric.core.execPlugin('setBoolValueForKey', [value, key]);
        }
    }, {
        key: 'setFloatValueForKey',
        value: function setFloatValueForKey(value, key) {
            window.fabric.core.execPlugin('setFloatValueForKey', [value, key]);
        }
    }]);

    return FabricCrashlytics;
})();


var UNKNOWN_FUNCTION = '<unknown>';

function parse(stackString) {
    var chrome = /^\s*at (?:(?:(?:Anonymous function)?|((?:\[object object\])?\S+(?: \[as \S+\])?)) )?\(?((?:file|http|https):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
            gecko = /^(?:\s*([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i,
            node  = /^\s*at (?:((?:\[object object\])?\S+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i,
            lines = stackString,
            stack = [],
            parts,
            element;

    for (var i = 0, j = lines.length; i < j; ++i) {
        if ((parts = gecko.exec(lines[i]))) {

            // file, methodName, lineNumber, column
            element = {
                'file': parts[3],
                'methodName': parts[1] || UNKNOWN_FUNCTION,
                'lineNumber': +parts[4],
                'column': parts[5] ? +parts[5] : null
            };
        } else if ((parts = chrome.exec(lines[i]))) {
            element = {
                'file': parts[2],
                'methodName': parts[1] || UNKNOWN_FUNCTION,
                'lineNumber': +parts[3],
                'column': parts[4] ? +parts[4] : null
            };
        } else if ((parts = node.exec(lines[i]))) {
            element = {
                'file': parts[2],
                'methodName': parts[1] || UNKNOWN_FUNCTION,
                'lineNumber': +parts[3],
                'column': parts[4] ? +parts[4] : null
            };
        } else {
            continue;
        }

        stack.push(element);
    }

    return stack;
}

module.exports = new FabricCrashlytics();
