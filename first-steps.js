// Browser-local activities for the first two lessons.
const starterLessons = {
  39: {
    draftKey: 'zx-draft-start-print',
    title: '用 print 显示一句话',
    intro: '程序是一组交给计算机的指令。这一课只写一条，让屏幕显示你选择的一句话。手机上可以直接修改下面的代码。',
    steps: [
      ['print', '这是 Python 中用来显示内容的名字。把要显示的东西放在紧跟它的一对英文圆括号里。'],
      ['"你好"', '引号告诉 Python，中间的字是一段文字，叫作字符串。引号标出文字的两端，运行时只显示里面的内容。']
    ],
    question: '先猜一猜，括号和引号也会显示出来吗？',
    choices: ['只显示 你好', '显示 print("你好")'], correct: 0,
    feedback: ['对。print 是指令，屏幕上出现的是交给它的文字。', '看看引号里面是哪两个字。括号和引号帮助 Python 读懂指令；运行一次就能看到区别。'],
    source: 'print("你好")', task: '先运行一次。再把引号中的“你好”换成你想说的话，保留英文引号和括号，重新运行。',
    hint: '可以只用鼠标或手指选中“你好”两个字。两端的引号都要留下。',
    variant: '把引号里的字全部删掉，保留两个引号，再运行。你预测会发生什么？',
    answer: 'print("") 会输出一个空行。空字符串里有零个字符，所以这一行看起来是空白的。',
    next: 'chapter-40', nextLabel: '下一课 · 用变量保存节目名'
  },
  40: {
    draftKey: 'zx-draft-start-variables',
    title: '用变量保存节目名',
    intro: '假设你在帮校园电台做节目单。节目名会更新，你希望显示当前的名字。变量让程序可以通过一个名字找到一个值。',
    steps: [
      ['show = "晚间电台"', '先看等号右边，得到一段文字。再看左边，给这个值取名 show。这一步叫赋值，本身不会向屏幕输出文字。'],
      ['print(show)', '括号里没有引号，Python 就去找 show 当前指向的值，再把它显示出来。程序从上到下执行。']
    ],
    question: '按下面的原始代码运行，屏幕会显示什么？',
    choices: ['show', '晚间电台'], correct: 1,
    feedback: ['如果写成 print("show")，才会显示这四个字母。这里读的是名字 show 对应的值。', '对。第一行把 show 指向节目名，第二行取出节目名并显示。'],
    source: 'show = "晚间电台"\nprint(show)', task: '先运行一次。把第一行的节目名改成“早间新闻”，保持第二行不变，再看看显示什么。',
    hint: '想区分“名字”和“文字”？运行 print(show) 后，把第二行改成 print("show") 再运行。',
    variant: '想在同一次运行中先显示旧节目，再显示新节目，需要把两次 print 放在哪里？',
    answer: '先给 show 赋旧节目名并显示一次，再赋新节目名并显示一次。第二次赋值不会改写已经输出的第一行。',
    answerCode: 'show = "晚间电台"\nprint(show)\nshow = "早间新闻"\nprint(show)',
    answerOutput: '晚间电台\n早间新闻', next: 'chapter-41', nextLabel: '下一课 · 用 for 逐个读出名单'
  }
};

function readStudyValue(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeStudyValue(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Reading still works without storage. */ }
}
// Keep the original chapter numbers, bookmarks and editor storage from v24.
const starterAliases = {'start-print': 'chapter-39', 'start-variables': 'chapter-40'};
function canonicalLesson(id) {
  return Object.hasOwn(starterAliases, id) ? starterAliases[id] : id;
}
function chapterTitle(i) {
  if (Object.hasOwn(starterLessons, i)) return '零基础 ' + (i - 38) + ' · ' + starterLessons[i].title;
  if (Object.hasOwn(rosterCourse, i)) return '教材第 ' + rosterCourse[i].number + ' 章 · ' + rosterCourse[i].title;
  if (i === 41) return '零基础 3 · 用 for 逐个读出名单';
  if (i === 42) return 'SQL 零基础 1 · 用 SELECT 查出第一行结果';
  return chapters[i]?.title;
}
function studyRouteTitle(route) {
  const id = canonicalLesson(route);
  const section = rosterSection(id);
  if (section) return chapterTitle(section.chapter) + ' · ' + section.stage.title;
  if (/^chapter-(0|[1-9]\d*)$/.test(id)) return chapterTitle(Number(id.slice(8)));
  if (id.startsWith('unit-')) return curriculum.find(unit => 'unit-' + unit.id === id)?.title;
}
function startingPanel() {
  const last = canonicalLesson(readStudyValue('zx-last-lesson') || '');
  const title = studyRouteTitle(last);
  return `<section class="start-home"><p class="course-kicker">全书导览</p><h1>从第一行 <em>Python</em> 开始</h1>
    <p class="intro">写一句自己的话，让 Python 把它显示在屏幕上。接着给节目取个名字，再试着读出一整份节目单。</p>
    <div class="actions">${title ? `<a class="primary" href="#${esc(last)}">继续学习 · ${esc(title)}</a>` : ''}
      ${last !== 'chapter-39' || !title ? `<a href="#chapter-39" class="${title ? 'secondary' : 'primary'}">开始 Python 第一课</a>` : ''}
      <a href="#chapter-42" class="secondary">开始 SQL Server 第一课</a>
      </div></section>`;
}
function starterActivity(i) {
  const lesson = starterLessons[i];
  const draft = readStudyValue(lesson.draftKey) ?? lesson.source;
  return `<div class="starter"><p class="intro">${esc(lesson.intro)}</p>
    <section><h2>读懂这条指令</h2>${lesson.steps.map(([code, body]) =>
      `<p><code>${esc(code)}</code>　${esc(body)}</p>`).join('')}</section>
    <section><h2>预测原始代码的结果</h2>${readingCode(lesson.source, '原始代码')}
    <div class="beginner-check" role="group" aria-label="${esc(lesson.question)}"><p>${esc(lesson.question)}</p>
      ${lesson.choices.map((s, i) => `<button type="button" data-starter-choice="${i}">${esc(s)}</button>`).join(' ')}
      <p id="starter-feedback" aria-live="polite"></p></div></section>
    <section class="starter-editor"><h2>动手试一遍</h2><p>${esc(lesson.task)}</p>
      <label for="starter-code">可编辑的代码</label>
      <textarea id="starter-code" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" rows="5" maxlength="8000" aria-describedby="starter-scope">${esc(draft)}</textarea>
      <p class="muted" id="starter-scope">本页练习器支持本课用到的 Python 入门语法，包括 print、变量、字符串和整数。每次运行都从第一行重新开始。</p>
      <div class="actions"><button class="primary" id="starter-run" type="button">运行代码</button>
        <button class="secondary" id="starter-reset" type="button">恢复原例</button></div>
      <h3>运行结果</h3><pre id="starter-output" aria-live="polite">等待运行</pre>
      <details><summary>卡住时看提示</summary><p>${esc(lesson.hint)}</p></details></section>
    <section><h2>自己再试一次</h2><p>${esc(lesson.variant)}</p><details><summary>展开解法与解释</summary><p>${esc(lesson.answer)}</p>
      ${lesson.answerCode ? readingCode(lesson.answerCode, '参考代码') + readingCode(lesson.answerOutput, '预期输出') : ''}</details></section>
    <div class="actions"><a class="primary" href="#${lesson.next}">${lesson.nextLabel}</a></div></div>`;
}
function bindStarter(id) {
  const lesson = starterLessons[id];
  const editor = $('#starter-code'), output = $('#starter-output');
  editor.oninput = () => writeStudyValue(lesson.draftKey, editor.value);
  document.querySelectorAll('[data-starter-choice]').forEach(button => {
    button.onclick = () => { $('#starter-feedback').textContent = lesson.feedback[Number(button.dataset.starterChoice)]; };
  });
  $('#starter-run').onclick = () => {
    const result = ZhixingStarter.run(editor.value);
    const message = result.error ? `第 ${result.error.line} 行：${result.error.message}` : '';
    const display = result.output === '' ? '' : result.output;
    output.textContent = message ? (display ? display + '\n' : '') + message :
      (display || (result.linesPrinted > 0 ? '（输出了空行）' : '（运行结束，没有输出）'));
  };
  $('#starter-reset').onclick = () => {
    editor.value = lesson.source;
    editor.oninput();
    output.textContent = '已恢复原例，等待运行';
  };
}
