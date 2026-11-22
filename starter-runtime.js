// Small, offline interpreter for the two introductory lessons.
(() => {
  'use strict';

  const maxOutput = 16000;
  const reserved = new Set(('False None True and as assert async await break class continue def del ' +
    'elif else except finally for from global if import in is lambda nonlocal not or pass ' +
    'raise return try while with yield').split(' '));
  const escapes = new Map([['n', '\n'], ['t', '\t'], ['r', '\r'], ['\\', '\\'], ['"', '"'], ["'", "'"]]);

  class LessonError extends Error {
    constructor(line, message) {
      super(message);
      this.line = line;
    }
  }

  function tokenize(source, line) {
    const tokens = [];
    const pattern = /[ \t]+|#[^\n]*|[\p{XID_Start}_]\p{XID_Continue}*|[0-9]+|./gsuy;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const part = match[0];
      if (part.startsWith('#')) break;
      if (/^[ \t]/.test(part)) continue;
      if (part === '"' || part === "'") {
        let cursor = pattern.lastIndex;
        let value = '';
        while (cursor < source.length && source[cursor] !== part) {
          const ch = source[cursor++];
          if (ch === '\\') {
            const escaped = source[cursor++];
            if (!escapes.has(escaped)) {
              throw new LessonError(line, '请检查反斜杠后的字符。本练习支持换行、制表符、回车、引号和反斜杠转义。');
            }
            value += escapes.get(escaped);
          } else {
            value += ch;
          }
        }
        if (cursor >= source.length) throw new LessonError(line, '这段文字缺少结束引号。请在文字两端使用相同的半角引号。');
        tokens.push({kind: 'literal', value});
        pattern.lastIndex = cursor + 1;
      } else if (/^[0-9]/.test(part)) {
        if (/^0[0-9]*[1-9]/.test(part)) throw new LessonError(line, '十进制整数开头不能多写 0，例如把 02 改成 2。');
        tokens.push({kind: 'literal', value: BigInt(part)});
      } else if (/^[\p{XID_Start}_]/u.test(part)) {
        tokens.push({kind: 'name', value: part.normalize('NFKC')});
      } else if ('=()+,-'.includes(part)) {
        tokens.push({kind: part});
      } else {
        const hint = /[“”‘’（），＝＋]/.test(part) ? '请把引号、括号和运算符切换到英文半角。' :
          '本练习支持用 print 显示内容、给变量赋值，以及整数或文字相加。';
        throw new LessonError(line, '这里暂时无法读取「' + part + '」。' + hint);
      }
    }
    return tokens;
  }

  function parseLine(source, line) {
    if (/^[ \t]*(?:#|$)/u.test(source)) return null;
    if (/^[ \t]/.test(source)) throw new LessonError(line, '本课的指令都从行首写起，请删去这一行开头的空格。');
    const tokens = tokenize(source, line);
    let cursor = 0;
    const peek = () => tokens[cursor]?.kind;
    const fail = message => { throw new LessonError(line, message); };
    function term() {
      if (peek() === '-') {
        cursor++;
        const number = tokens[cursor++];
        if (number?.kind !== 'literal' || typeof number.value !== 'bigint') fail('本课把负号写在整数前，例如 -2。');
        return {kind: 'literal', value: -number.value};
      }
      const token = tokens[cursor++];
      if (token?.kind === 'literal') return token;
      if (token?.kind === 'name' && !reserved.has(token.value)) return token;
      fail('这里需要引号括住的文字、整数，或已经赋过值的变量名。');
    }
    function expression() {
      const terms = [term()];
      while (peek() === '+') {
        cursor++;
        terms.push(term());
      }
      return terms;
    }
    const name = tokens[cursor++];
    if (name?.kind !== 'name' || reserved.has(name.value)) fail('本练习每行可以写一次 print(...)，或写 变量名 = 值。');
    let statement;
    if (peek() === '=') {
      if (name.value === '__debug__') fail('这个名称由 Python 保留，请为变量换个名字。');
      cursor++;
      statement = {line, name: name.value, value: expression()};
    } else {
      if (name.value !== 'print') fail('本练习可以调用小写的 print(...)。给变量赋值时，请在名字后写一个等号。');
      if (peek() !== '(') fail('请在 print 后写半角左括号 (，并用右括号 ) 收尾。');
      cursor++;
      const args = [];
      while (peek() && peek() !== ')') {
        args.push(expression());
        if (peek() !== ',') break;
        cursor++;
      }
      if (peek() !== ')') fail('print 的内容需要用半角括号括住。显示多个值时，在两个值之间写半角逗号。');
      cursor++;
      statement = {line, args};
    }
    if (cursor !== tokens.length) fail('这一行还有未读的内容。本练习每行写一条指令，支持文字、整数、变量和加号。');
    return statement;
  }

  function evaluate(terms, names, line) {
    function getValue(token) {
      if (token.kind === 'literal') return token.value;
      if (!names.has(token.value)) {
        throw new LessonError(line, '「' + token.value + '」还没有值。请先给这个名字赋值。如果要显示这段文字，就给它加上引号。');
      }
      return names.get(token.value);
    }
    let value = getValue(terms[0]);
    for (const token of terms.slice(1)) {
      const next = getValue(token);
      if (typeof value !== typeof next) throw new LessonError(line, '加号两侧需要同为整数，或同为文字。带引号的数字在这里是文字。');
      value += next;
      if (typeof value === 'string' && value.length > maxOutput) throw new LessonError(line, '这段文字太长了，请缩短后再运行。');
    }
    return value;
  }

  function run(source) {
    const output = [];
    const names = new Map();
    let length = 0;
    function result(error = null) {
      const text = output.join('\n');
      return {ok: error === null, output: text, linesPrinted: output.length ? text.split('\n').length : 0, error};
    }
    try {
      if (source.length > 6000) throw new LessonError(1, '本练习支持 6000 个字符以内的短程序。');
      // Python checks syntax throughout a file before running its first line.
      const program = source.replace(/\r\n?/g, '\n').split('\n').map((s, i) => parseLine(s, i + 1));
      for (const statement of program) {
        if (!statement) continue;
        const {line} = statement;
        if (statement.value) {
          names.set(statement.name, evaluate(statement.value, names, line));
        } else {
          if (names.has('print')) throw new LessonError(line, '变量 print 遮住了原来的显示指令。请给变量换个名字，再调用 print。');
          const text = statement.args.map(arg => String(evaluate(arg, names, line))).join(' ');
          length += text.length + 1;
          if (length > maxOutput) throw new LessonError(line, '本次输出太长了，请先分成几个小步骤运行。');
          output.push(text);
        }
      }
      return result();
    } catch (error) {
      if (!(error instanceof LessonError)) throw error;
      return result({line: error.line, message: error.message});
    }
  }

  globalThis.ZhixingStarter = Object.freeze({run});
})();
