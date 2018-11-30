var str = "{name: 'sloan', fav: ['codeing','dirve'], info: {\"wife\": 'Jinzhen'}, age: 33, man: true,}";
// var json = JSON.parse(str);
// var json = {};
// eval('json = ('+str+');');
// var jsonStr = JSON.stringify(json);
// console.log('str: '+str);
// console.log('json: '+json);
// console.log('jsonStr: '+jsonStr);

// console.log(str[100]<'0');
// console.log(str[1]);
// console.log(str[1] == 'n');
// console.log(str.charAt(1));
// console.log(str.charAt(1) == 'n');
// console.log(str.charAt(6));
// console.log(str.charAt(6) < '0');
// console.log(str.charAt(6));
// console.log(str.charAt(6) == 0x20);

// console.log(str.indexOf("'", 6));

// console.log(' " '[1]);
// console.log(' " '[1] < '!');

// var reg = /(^[+-]?[0-9]+\.?[0-9]+[eE]?[+-]?[0-9]+|[+-]?[0-9]+\.?[0-9]+|[+-]?[0-9]+)/
// var reg = /^\d+/
// var re = reg.compile();
// console.log(reg.exec('1aa'));
// console.log(reg.exec('10aa'));
// console.log(reg.exec('101aa'));
// console.log(reg.exec('101e3aa'));
// console.log(reg.exec('1.01e3aa'));
// console.log(reg.exec('101.0e1aa'));
// console.log(reg.exec('101.0e+1aa'));
// console.log(reg.exec('101.0e-5aa'));
// console.log(reg.exec('+1.011E-12abc'));
// console.log(reg.exec('+1.011e-12abc'));
// console.log(reg.exec('+1.011e-12abc'));

// console.log(convJson(' \t true \n '));
// console.log(convJson(' false '));
// console.log(convJson(' null '));
// console.log(convJson('  " ab\\" "  '));
// console.log(convJson("  ' ab\" ' "));
// console.log(convJson('  ` ab" `  '));

// console.log(convJson('1'));
// console.log(convJson(' 10 '));
// console.log(convJson(' 10.012 '));
// console.log(convJson(' 10e3 '));
// console.log(convJson(' 10e-3 '));
// console.log(convJson(' 10 '));

console.log(convJson(' {  } '));
console.log(convJson(' { "key" : 123} '));
console.log(convJson(' { "key" : 123 , } '));
console.log(convJson(' { key : 123, "name":"sloan",} '));
console.log(convJson(" { 'key' : 123, name:'sloan',} "));
console.log(convJson(" { 'key' : 123, name:'sloan', info: {marraged: true}} "));

console.log(convJson(' [ ] '));
console.log(convJson(' [ 1] '));
console.log(convJson(' [ 1, ] '));
console.log(convJson(' [ 1, 2] '));
console.log(convJson(' [ 1, 2, "abc", true, ] '));

console.log(convJson(' [ 1, 2, "abc", true, {a:1,b:true}, [1,2,3,true,null,4]] '));

function convJson(str, std=true) {
	var pos = 0;
	var len = str.length;
    var end = false;
	var reg = /(^[+-]?[0-9]+\.?[0-9]+[eE]?[+-]?[0-9]+|[+-]?[0-9]+\.?[0-9]+|[+-]?[0-9]+)/
	var sa = [];
	function skip() {
		while (str[pos] < '!') {
            // var ch = str[pos];
			pos++;
		}
	}
	function parseConst() {
		var s = str.substr(pos, 4);
		if (s == 'true') {
		    pos += 4;
            sa.push('true');
		} else if (s == 'null') {
            pos += 4;
            sa.push('null');
		} else if (s == 'fals' && str[pos+4] == 'e') {
            pos += 5;
            sa.push('false');
		} else {
		    throw "const parse error! at pos: "+pos;
        }
		return pos;
	}
	function parseString() {
	    var ch = str[pos];
	    if (ch != '"' && ch != '\'' && ch != '`') {
	        index = str.indexOf(':', pos);
	        var s = str.substring(pos, index).trim();
            if (std) {
                sa.push('"'+s+'"');
            } else {
                sa.push(s);
            }
	        pos += s.length;
	        return ;
        }
        var index = str.indexOf(ch, pos+1);
        while (str[index-1] == '\\') {
            index = str.indexOf(ch, index+1);
        }
        if (std) {
            var s = str.substring(pos+1, index);
            if (ch != '"') {
                s = s.replace('"', '\\"');
            }
            sa.push('"'+s+'"');
        } else {
            sa.push(str.substring(pos, index + 1));
        }
        pos = index+1;
    }
    function parseNumber() {
        //  /(^[+-]?[0-9]+\.?[0-9]+[eE]?[+-]?[0-9]+|[+-]?[0-9]+\.?[0-9]+|[+-]?[0-9]+)/
        var re = reg.exec(str.substr(pos));
        if (re) {
            sa.push(re[0]);
            pos += re[0].length;
        } else {
            throw 'number parse error pos: '+pos;
        }
    }
    function parseObject() {
        sa.push('{');
        pos += 1;
        var isFirst = true;
        do {
            skip();
            if (str[pos] == '}') {
                break;
            }
            if (!isFirst) {
                sa.push(',');
            }
            isFirst = false;
            var start = pos;
            parseString();
            var key = str.substring(start, pos);
            skip()
            if (str[pos] != ':') {
                throw "object parse ':' expected pos: " + pos;
            }
            sa.push(':');
            pos += 1;
            skip()
            parseValue();
            skip()
            if (str[pos] != ',') {
                break;
            }
            pos += 1;
        } while (true);
        if (str[pos] != '}') {
            throw "object parse '}' expected pos: "+pos;
        }
        sa.push('}');
        pos += 1;
    }
    function parseArray() {
        sa.push('[');
        pos += 1;
        var isFirst = true;
        do {
            skip();
            if (str[pos] == ']') {
                break;
            }
            if (!isFirst) {
                sa.push(',');
            }
            isFirst = false;
            parseValue();
            skip()
            if (str[pos] != ',') {
                break;
            }
            pos += 1;
        } while (true);
        if (str[pos] != ']') {
            throw "array parse ']' expected pos: "+pos;
        }
        sa.push(']');
        pos += 1;
    }
    function parseValue() {
        var ch = str.charAt(pos);
        switch (ch) {
            case '{':
                parseObject();
                break;
            case '[':
                parseArray();
                break;
            case '"':
            case '`':
            case '~':
            case '/':
            case '\'':
                parseString();
                break;
            case 't':
            case 'f':
            case 'n':
                parseConst();
                break;
            default:
                if (ch == '-' || (ch >= '0' && ch <= '9')) {
                    parseNumber();
                } else {
                    // throw 'error at pos: '+pos;
                    end = true;
                }
                break;
        }
    }
	while (!end && pos < len) {
		skip();
		if (pos >= len) {
		    break;
        }
        try {
            parseValue();
        } catch (e) {
		    console.log("exception: "+ e);
        }
	}
	return sa.join("");
}
