// 新专题采用稳定字符串 ID，与原 46 章的数字 ID、学习进度相互独立。
let curriculum = [];
let sourcebook = {};
let unitCompleted;
try { unitCompleted = JSON.parse(localStorage.getItem('zx-unit-completed') || '[]'); if (!Array.isArray(unitCompleted)) unitCompleted=[]; } catch { unitCompleted=[]; }
const projectPackages = {
  game: {title:'信号守卫', file:'python-game.zip?v=29', path:'game', description:'Pygame：移动、发射、碰撞、计分、重开。', validation:'6 项原游戏测试与 9 项入门移动用例通过；未在你的 Windows 上人工试玩。'},
  analysis: {title:'校园事件数据图册', file:'python-analysis.zip', path:'analysis', description:'随机模拟、日期曲线、位置散点与 API 快照。', validation:'7 项测试及离线图表生成通过；真实 GitHub API 请求未实测。'},
  web: {title:'事件研习簿', file:'python-web.zip', path:'web', description:'Django：主题、笔记、注册、登录与所有权。', validation:'10 项本地 Django 测试通过；未部署独立公网后端或验证生产 HTTPS 代理。'}
};
const coverage = [
  ['1','起步与运行环境',['runtime'],[39,0,35]],
  ['2','变量、简单类型、字符串与注释',['values','text'],[40,1,15]],
  ['3','列表的访问、修改、管理',['sequence'],[16]],
  ['4','遍历、range、切片、元组与格式',['sequence','branch'],[41,2,3,27]],
  ['5','条件判断、真假与分类',['branch'],[2]],
  ['6','字典、遍历与嵌套',['mapping'],[16]],
  ['7','输入、while 与退出',['input','branch'],[44]],
  ['8','函数、参数、返回与模块',['functions','modules'],[4,6]],
  ['9','类、实例、继承与标准库',['objects','modules'],[6,29]],
  ['10','文件、异常、JSON 与重构',['files','errors'],[5,17,18]],
  ['11','函数/类测试与 fixture',['errors'],[20]],
  ['12','窗口、输入、玩家与弹体',['game-loop','game-collision'],[]],
  ['13','目标阵列、碰撞与游戏结束',['game-collision'],[]],
  ['14','按钮、计分、难度与重开',['game-state'],[]],
  ['15','绘图、随机游走、骰子模拟',['plotting'],[36,37]],
  ['16','CSV、日期、位置与 GeoJSON',['datasets'],[18,5]],
  ['17','请求 API、处理响应与可视化',['api'],[17]],
  ['18','Django 项目、模型与页面',['web-foundations'],[35]],
  ['19','表单、账户与用户数据',['web-users'],[]],
  ['20','样式、部署与持续开发',['web-deploy','git'],[]],
  ['A','安装与故障排除',['runtime'],[0,35]],
  ['B','编辑器与调试',['runtime','git'],[]],
  ['C','求助与官方资料',['runtime','modules','git'],[]],
  ['D','Git 版本控制',['git'],[]],
  ['E','部署排障',['web-deploy'],[]]
];
function unitLink(id) {
  const u=curriculum.find(u=>u.id===id);
  return u?`<a href="#unit-${id}">${esc(u.title)}</a>`:'';
}
function projectCard(key) {
  const p=projectPackages[key];
  return `<section class="card"><span class="label">独立原创练习</span><h3>${p.title}</h3><p>${p.description}</p><div class="actions"><a class="primary" href="${p.file}" download>下载完整工程</a><a class="secondary" href="#source-${key}~README.md">在线逐文件阅读</a></div><p class="muted">${p.validation}</p></section>`;
}

function topicMatches(query) {
  const terms = query.trim().toLowerCase().split(/\s+/u).filter(Boolean);
  if (!terms.length) return '';
  const entries = [
    ...curriculum.map(unit => ({id: 'unit-' + unit.id, title: unit.title, detail: unit.group, keywords: [...unit.tags, unit.goal, ...unit.sections.map(s => s.title)]})),
    ...collections.flatMap(group => group.indexes.map(i => ({
      id: 'chapter-' + i, title: chapterTitle(i), detail: group.title,
      keywords: [chapters[i].title, chapters[i].goal, ...chapters[i].topics, ...(rosterCourse[i]?.stages.map(stage => stage.title + ' ' + stage.ref) || [])]
    })))
  ];
  const matches = entries.filter(item => {
    const searchable = [item.title, item.detail, ...item.keywords].join(' ').toLowerCase();
    return terms.every(term => searchable.includes(term));
  });
  return `<p role="status">找到 ${matches.length} 个结果</p>` +
    (matches.length ? `<div class="chapterlist">${matches.map(m =>
      `<a href="#${esc(m.id)}"><span>${esc(m.title)}<small>${esc(m.detail)}</small></span></a>`).join('')}</div>` :
      '<p>试试更短的词，如“列表”“函数”或“JOIN”。</p>');
}


function topicShelf() {
  const groups = [...new Set(curriculum.map(unit => unit.group))];
  return `<h1>专题学习</h1><p class="intro">选一个任务开始。每组从上往下学，也可以直接进入需要的那一课。</p>
    <div class="topic-shelf">${groups.map(group => {
      const units = curriculum.filter(unit => unit.group === group);
      const rows = units.map(unit => {
        const practical = {files: '#chapter-5', errors: '#chapter-20'};
        const href = practical[unit.id] || '#unit-' + unit.id;
        const extra = practical[unit.id] ? `<a href="#unit-${unit.id}">概念讲解</a>` : '';
        return `<li><a href="${href}">${esc(unit.title)}</a>${extra}</li>`;
      }).join('');
      return `<section class="card"><h2>${esc(group)}</h2><ol>${rows}</ol></section>`;
    }).join('')}</div>`;
}

function knowledgeHome() {
  return `<h1>按知识点查找</h1><p class="intro">遇到不熟悉的概念？输入关键词，直接定位到对应讲解。</p>
    <div class="topic-search"><label for="topic-query">搜索课程与专题</label><input id="topic-query" type="search" placeholder="例如：列表、函数、JOIN"></div>
    <div id="topic-results" aria-live="polite"></div>`;
}
function coveragePage() {
  const cards = textbookIndex.map(item => `<section class="card index-card">
    <span class="label">${esc(item.label)} · ${esc(item.status)}</span><h2>${esc(item.title)}</h2>
    <p>${esc(item.summary)}</p><div class="index-links">${item.links.map(link =>
      `<a href="${esc(link.href)}">${esc(link.label)}</a>`).join('')}</div></section>`).join('');
  return `<h1>按教材查找</h1><p class="intro">按《Python 编程：从入门到实践》第 3 版查找 20 章和 5 个附录。每张卡片说明本站已经讲到哪里，点题目就能读。“部分主题”表示这里只收录了该章或附录的一部分。</p><div class="grid textbook-grid">${cards}</div>`;
}
function readingCode(code, label) {
  return `<div class="codehead"><span>${esc(label)}</span></div>
    <pre class="lined"><code>${codeMarkup(code)}</code></pre>`;
}

function readingCard(unit, reading, index) {
  const files = Object.entries(reading.files || {}).map(([name, source]) => readingCode(source, name)).join('');
  const choices = reading.options.map(([label], option) =>
    `<button type="button" class="secondary" data-reading-answer="${option}" aria-pressed="false">${esc(label)}</button>`
  ).join('');
  const [before, after, output, reason] = reading.change;
  const typed = reading.stdin === undefined ? '' :
    `<p><b>按顺序键入</b>　${reading.stdin.trimEnd().split('\n').map(s => esc(s || '（只按回车）')).join(' → ')}，每次按 Enter。</p>`;
  return `<details class="beginner-reading"${index === 0 ? ' open' : ''}>
    <summary>${esc(reading.title)}</summary>
    ${reading.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
    ${files}${readingCode(reading.code, reading.filename || 'Python 3')}${typed}
    <h4>跟着 Python 走一遍</h4><ol>${reading.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>
    <h4>运行结果</h4><div class="output">${esc(reading.output)}</div>
    <fieldset class="reading-question" data-reading-unit="${esc(unit.id)}" data-reading-index="${index}">
      <legend>${esc(reading.question)}</legend><div class="reading-choices">${choices}</div>
      <p class="reading-feedback" aria-live="polite"></p>
    </fieldset>
    <details class="reading-change"><summary>改一处，再核对结果</summary>
      <p>在上面的程序中找到这一段</p>${readingCode(before, '原写法')}
      <p>替换为</p>${readingCode(after, '改动后')}
      <div class="output">${esc(output)}</div><p>${esc(reason)}</p>
    </details>
  </details>`;
}

function beginnerPanel(unit, fromChapter = false) {
  const guide = unit.beginner;
  if (!guide) return '';
  const further = fromChapter
    ? `<p><a href="#unit-${esc(unit.id)}">继续读本专题的知识拆解与练习</a></p>`
    : '';
  return `<section class="block beginner-panel" id="read-${esc(unit.id)}"><h2>零基础精读 · ${esc(guide.label)}</h2>
    ${guide.lessons.map((reading, index) => readingCard(unit, reading, index)).join('')}${further}</section>`;
}

function chapterReadings(index) {
  const matches = curriculum.filter(unit => unit.beginner?.chapters.includes(index));
  const links = matches.length > 1 ? `<nav class="unit-toc" aria-label="选择零基础讲解">${matches.map(unit =>
    `<button type="button" data-jump="read-${esc(unit.id)}">${esc(unit.beginner.label)}</button>`
  ).join('')}</nav>` : '';
  return links + matches.map(unit => beginnerPanel(unit, true)).join('');
}

function bindReadingQuestions() {
  document.querySelectorAll('.reading-question').forEach(box => {
    const unit = curriculum.find(item => item.id === box.dataset.readingUnit);
    const reading = unit.beginner.lessons[Number(box.dataset.readingIndex)];
    const buttons = box.querySelectorAll('[data-reading-answer]');
    buttons.forEach(button => {
      button.onclick = () => {
        const selected = Number(button.dataset.readingAnswer);
        buttons.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
        const result = selected === reading.answer ? '答对了。' : '再想一步。';
        box.querySelector('.reading-feedback').textContent = result + reading.options[selected][1].replace(/^对。/, '');
      };
    });
  });
}


function unitPage(id) {
  const u=curriculum.find(u=>u.id===id);
  if(!u)return '<h1>没有找到这个专题</h1><a href="#knowledge">返回学习地图</a>';
  const position=curriculum.indexOf(u);
  return `<article class="article"><div class="eyebrow">${esc(u.group)} / 专题 ${String(position+1).padStart(2,'0')}</div><h1>${esc(u.title)}</h1>${id === 'game-loop' ? gameWorkshop() : id === 'game-collision' ? targetWorkshop() : id === 'game-state' ? scoreWorkshop() : dataWorkshop(id)}${beginnerPanel(u)}${id === 'files' || id === 'errors' ? textbookTrail() : ''}<p class="intro">${esc(u.goal)}</p><div class="chips">${u.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p class="muted">主题对照：${esc(u.book)} · ${u.sections.length} 个拆解 · 代码演练 · 练习解析</p>${u.before.length?`<div class="notice"><b>基础衔接：</b>${u.before.map(i=>`<a href="#chapter-${i}">${esc(chapterTitle(i))}</a>`).join(' / ')}</div>`:''}<nav class="unit-toc" aria-label="本专题目录">${u.sections.map((s,i)=>`<button type="button" data-jump="point-${i}">${i+1}. ${esc(s.title)}</button>`).join('')}</nav>${u.sections.map((s,i)=>`<section class="block point" id="point-${i}"><span class="label">知识拆解 ${String(i+1).padStart(2,'0')}</span><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></section>`).join('')}<section class="block"><h2>代码演练与预期行为</h2><p class="muted">${u.runner==='shell'?'以下是终端命令；请先满足正文中的环境前提。':u.runner==='project'?'以下是完整工程中的片段；需在下载包的 Django 上下文中使用。':'以下使用 Python 3。第三方库请先按对应工程 requirements.txt 安装。'}</p><div class="codehead"><span>${u.runner==='shell'?'TERMINAL':u.runner==='project'?'PROJECT CONTEXT':'PYTHON'}</span><button type="button" data-copy-unit="main">复制</button></div><pre class="lined"><code>${codeMarkup(u.code)}</code></pre><div class="output">${esc(u.output)}</div></section><section class="block"><h2>常见错误与正确做法</h2>${u.pitfalls.map(p=>`<p class="pitfall-line">${esc(p)}</p>`).join('')}</section><section class="block"><h2>练习与解题过程</h2>${u.exercises.map((e,i)=>`<div class="exercise-card"><h3>练习 ${i+1}</h3><p>${esc(e.question)}</p><details><summary>先看思路提示</summary><p>${esc(e.thinking)}</p></details><details><summary>查看步骤、参考代码与结果</summary><p><b>思路：</b>${esc(e.thinking)}</p><p><b>步骤：</b>${esc(e.steps)}</p><div class="codehead"><span>参考解法</span><button type="button" data-copy-unit="${i}">复制</button></div><pre class="lined"><code>${codeMarkup(e.code)}</code></pre><div class="output">${esc(e.output)}</div></details></div>`).join('')}</section>${u.project?`<section class="block"><h2>把这个知识放进完整项目</h2>${projectCard(u.project)}</section>`:''}<section class="block"><h2>掌握检查</h2><p>合上示例，能够完成下面三项，再标记掌握。</p><ul>${u.mastery.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><a href="${esc(u.source)}" target="_blank" rel="noreferrer">官方资料：核对定义与 API ↗</a></section>${id === 'objects' ? '<div class="actions"><a class="primary" href="#chapter-5">按教材继续 · 第 10 章 文件和异常</a></div>' : ''}<div class="lessonfoot">${position?`<a class="secondary" href="#unit-${curriculum[position-1].id}">← 上一专题</a>`:'<a class="secondary" href="#knowledge">学习地图</a>'}<button class="primary" id="unit-complete" data-unit="${u.id}">${unitCompleted.includes(u.id)?'✓ 已掌握 · 点击取消':'标记专题已掌握'}</button>${position<curriculum.length-1?`<a class="secondary" href="#unit-${curriculum[position+1].id}">下一专题 →</a>`:'<a class="secondary" href="#python-projects">项目验收 →</a>'}</div></article>`;
}

function pythonProjectsPage() {
  const routes = [
    ['game', '做一个小游戏', '先会写循环、函数和类。', ['python game.py'], '按 Enter 开始，移动并发射。命中一个目标后，分数应增加。'],
    ['analysis', '用 CSV 画一张图', '先会读取 CSV，能把文本转成日期和数字。', ['python report.py --output output-01'], '打开新输出目录里的日期图。改动一条有效记录，在另一个新目录重跑，核对对应日期的数据点。'],
    ['web', '做一个能登录并保存记录的网站', '先会写函数和类，了解一条记录有哪些字段。', ['python manage.py migrate', 'python manage.py runserver'], '在本地页面注册、登录并保存一条笔记。刷新后仍能读到，再用第二个账号检查记录隔离。']
  ];
  return `<h1>${projectsTitle}</h1><p class="intro">选一个你想做出来的作品。在它的工程目录里，先按 README 创建独立环境、安装依赖，再运行下列命令。</p>
    <div class="grid project-routes">${routes.map(([key, goal, before, commands, result]) => {
      const item = projectPackages[key];
      return `<section class="card"><p class="course-kicker">${esc(item.title)}</p><h2>${goal}</h2><p>${before}</p>
        ${readingCode(commands.join('\n'), '第一次运行')}<p><b>完成标志</b>　${result}</p>
        <div class="actions"><a class="primary" href="#source-${key}~README.md">打开运行说明</a>
        <a class="secondary" href="${item.file}" download>下载工程</a>
        ${key === 'game' ? '<a class="secondary" href="#unit-game-loop">第 12 章 · 从窗口到移动</a>' : ''}</div></section>`;
    }).join('')}</div>`;
}


function bindKnowledge() {
 const query = document.getElementById('topic-query');
 if (query) query.oninput = () => {
   document.getElementById('topic-results').innerHTML = topicMatches(query.value);

 };
 bindReadingQuestions();
 bindPlayerFrame();
 bindBulletDemo();
 bindTargetDemo();
 bindScoreLab();
 document.querySelectorAll('[data-jump]').forEach(button=>button.onclick=()=>document.getElementById(button.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'}));
 const done=document.getElementById('unit-complete');
 if(done)done.onclick=()=>{
   const id=done.dataset.unit;
   unitCompleted=unitCompleted.includes(id)?unitCompleted.filter(x=>x!==id):[...unitCompleted,id];
   try{localStorage.setItem('zx-unit-completed',JSON.stringify(unitCompleted))}catch{}
   done.textContent=unitCompleted.includes(id)?'✓ 已掌握 · 点击取消':'标记专题已掌握';nav();
 };
 document.querySelectorAll('[data-copy-unit]').forEach(button=>button.onclick=async()=>{
   const u=curriculum.find(u=>'unit-'+u.id===location.hash.slice(1));
   const text=button.dataset.copyUnit==='main'?u.code:u.exercises[Number(button.dataset.copyUnit)].code;
   try{await navigator.clipboard.writeText(text);button.textContent='已复制'}catch{button.textContent='请选中代码复制'}
 });
 const sourceButton=document.getElementById('copy-source');
 if(sourceButton)sourceButton.onclick=async()=>{
   const [kind,path]=location.hash.slice('#source-'.length).split('~');
   const item=sourcebook[kind]?.find(f=>f.path===(path||'README.md'));
   try{await navigator.clipboard.writeText(item.content);sourceButton.textContent='已复制'}catch{sourceButton.textContent='请选中复制'}
 };
}
const sourceGuides={
 game:{
   'target_lab.py':'用固定位置和时间追踪目标阵列、贴边与重叠、命中后的新波次和生命消耗。',
   'bullet_lab.py':'沿 fire 和 step 追踪同一颗弹体。对照底边 0 和 −1 两个输入以及名额释放后的发射结果。',
   'first_window.py':'跟踪一帧发生的事：收取事件、填背景、刷新画面，再限制循环速度。',
   'move_player.py':'先看 move_x 的五个输入，再读键盘如何给出方向，以及浮点结果何时写回矩形。',
   'test_movement.py':'逐行比较相同起点下的方向、时间和预期位置，最后观察四次小数位移怎样累积成一个像素。',
   'game.py':'按 Settings → Box → Game.reset → fire/step → draw/run 顺序读。Settings 保存配置；Box 统一图像与位置；step 只推进游戏状态；run 负责事件、时间和绘制。先改一项速度观察，再测试边界和重开。',
   'test_game.py':'fixture 为每个用例新建游戏和临时成绩文件。重点看碰撞后的目标数、分数与新波次，以及失败后重开是否保留最高分。dummy 显示后端让自动测试不依赖真实窗口。',
   'requirements.txt':'这是独立游戏环境的直接依赖。先创建虚拟环境，再用该环境的解释器安装；不要修改 SQL Server 项目的依赖文件。',
   'README.md':'先完成环境、启动与按键操作，再逐个定位函数。验收项给出可以观察的行为，而非仅以“窗口打开了”作为完成。'
 },
 analysis:{
   'report.py':'从解析到展示分层阅读：load_daily 保证整行校验；walk/dice 生成可复现数据；load_places 校验位置；repository_rows 校验 API 结构；build 组合各图并记录拒绝原因。不要把绘图库调用和原始数据清洗混在一层。',
   'test_report.py':'测试关注日期是否错位、重复日期是否被明确拒绝、频数是否守恒、坐标是否越界。FakeSession 只模拟 HTTP 边界，不代表真实 GitHub 接口已经可用。',
   'daily.csv':'四条有效记录、两条脏记录。先手工判断哪几行应拒绝，再核对 audit.json；不要为了图更完整而把空值填成零。',
   'places.geojson':'观察 FeatureCollection → features → geometry/properties 的嵌套。错误示例的纬度为 120，超过合法范围，必须在绘图前拒绝。',
   'api_snapshot.json':'合成 API 数据，不代表真实仓库或当前排名。第二项 description 为 null，用来练习缺失文字的展示策略。',
   'requirements.txt':'Matplotlib 输出静态图，Plotly 输出交互 HTML，Requests 负责可选联网，pytest 检查数据行为。它们的职责不同，不需要为了导入 CSV 就安装所有库。',
   'README.md':'先运行默认离线模式核对结果。每次给新的输出目录，避免旧报告被覆盖。只有显式 --live 才会联网，失败时应保留实际错误。'
 },
 web:{
   'manage.py':'开发命令入口，选择 settings 后把参数交给 Django。migrate、test 和 runserver 都从这里进入，但执行的是不同管理命令。',
   'notebook/settings.py':'按环境、应用、中间件、模板、数据库、静态文件和生产配置分段读。开发默认只适合本机；生产私密密钥必须由环境注入。不要把示例开发密钥用于公网。',
   'notebook/urls.py':'根路由把 /admin/、账户路由、注册和笔记业务分派到不同组件；先读这个文件，再追到 notes/urls.py。',
   'notebook/wsgi.py':'生产 WSGI 服务器加载的入口，返回 Django application 对象。Waitress 负责接收 HTTP 并调用它；业务逻辑不应堆在这里。',
   'notes/models.py':'Topic.owner 建立主题归属；Entry.topic 建立笔记归属。CASCADE 描述关联删除行为，删除用户或主题前必须理解会影响的子记录。',
   'notes/migrations/0001_initial.py':'由 Django 根据模型生成的第一份迁移。先看 dependencies，再看 CreateModel；以后变更模型要新增迁移，不手工把已部署历史改成另一套结构。',
   'notes/forms.py':'ModelForm 只开放用户能编辑的 title/text；关系字段由服务端设置。这份白名单既简化表单，也避免客户端随意指定 owner。',
   'notes/admin.py':'把模型注册到管理员界面。管理员用于受信维护；普通用户的私有访问规则由业务视图实现，不能把后台权限与普通页面权限混淆。',
   'notes/urls.py':'把路径中的整数 pk 传给视图。URL 能被任意用户修改，所以知道主键不代表具有读取或编辑权限。',
   'notes/views.py':'先跟一遍 GET，再跟一遍 POST。每个私有入口先限定 owner；保存成功后 redirect；无效表单返回原界面与错误。新增关系使用服务端已验证的对象。',
   'notes/tests.py':'两位用户分别创建上下文，用读取和提交动作验证隔离。enforce_csrf_checks=True 才让测试客户端实际检验缺令牌请求；另外验证输入被转义和注销使用 POST。',
   'templates/base.html':'公共页面结构、样式引用和登录导航。退出按钮是带 CSRF token 的 POST 表单；子页面通过 block content 插入正文。',
   'templates/index.html':'只展示视图已过滤的主题，不在模板重新决定权限。empty 分支解释初次使用时没有内容的状态。',
   'templates/detail.html':'循环展示笔记、时间与编辑入口。linebreaksbr 保留换行展示，同时依赖默认转义避免把笔记文本当成脚本。',
   'templates/form.html':'新增和修改共用的表单容器。form.as_p 同时展示字段和错误；CSRF token 对 POST 校验必需。',
   'templates/registration/login.html':'Django 登录视图约定的模板位置。next 保存登录后的去向，登录视图负责验证跳转地址。',
   'templates/404.html':'不存在或不属于当前用户的记录统一显示未找到，避免额外泄露对象是否存在。DEBUG 关闭时使用自定义错误页。',
   'templates/500.html':'服务异常页面尽量简洁，不依赖更多查询和复杂模板，以免处理错误时再次出错。真实原因查服务器日志。',
   'static/notebook.css':'小屏响应式和表单样式。CSS 只影响外观，隐藏按钮不是权限控制。可以替换视觉风格，不要删掉语义化表单标签。',
   'requirements.txt':'Django 处理业务，WhiteNoise 提供收集后的静态资源，Waitress 提供 WSGI 服务。使用独立虚拟环境安装。',
   'README.md':'从本地安装到迁移、运行、测试，再到生产部署条件。该下载包是可运行的本地工程，不代表已为你购买主机或部署公开后端。'
 }
};
function sourcePage(kind, path='README.md') {
 const p=projectPackages[kind], files=sourcebook[kind];
 if(!p||!files)return '<h1>未找到工程</h1><a href="#python-projects">返回项目路线</a>';
 const selected=files.find(f=>f.path===path);
 if(!selected)return '<h1>未找到这个文件</h1><a href="#python-projects">返回项目路线</a>';
 const guide=sourceGuides[kind][path]||(path.endsWith('__init__.py')?'这个包标记文件可以为空；它表明当前目录作为普通 Python 包组织。':'先核对文件在 README 中的用途，再观察其输入和输出。');
 return `<article class="article"><div class="eyebrow">SOURCE READER / ${esc(kind)}</div><h1>${p.title} · 源码阅读</h1><p class="intro">按文件追踪完整流程。文件内容与下载包一致；代码运行需要相应的本地环境。</p><div class="source-files">${files.map(f=>`<a class="${f.path===path?'selected':''}" href="#source-${kind}~${f.path}">${esc(f.path)}</a>`).join('')}</div><section class="block"><h2>${esc(path)}</h2><div class="notice">${esc(guide)}</div><div class="codehead"><span>完整文件</span><button type="button" id="copy-source">复制文件</button></div><pre class="lined"><code>${codeMarkup(selected.content)}</code></pre></section><div class="actions"><a class="primary" href="${p.file}" download>下载全部文件</a><a class="secondary" href="#python-projects">返回项目路线</a></div></article>`;
}

function scoreWorkshop() {
  return `<section class="roster-course" aria-label="教材第 14 章上机课"><p>教材第 14 章 · 记分</p>
  <h2>从上一局的最高分开始新的一局</h2>
  <p>把记分牌看成四个独立的格子。Score 记录本局累计分，Best 记录最高分，Lives 是剩余生命，Level 是当前关卡。先猜一猜：重开后，哪一个格子该保留？</p>
  <h3>走完两波，再重新开始</h3><p>为方便逐步观察，下面每波只有两个目标。依次开始、命中三次，再失误三次。预测重开前后的四个数字。原游戏每波有 24 个目标。</p>
  <div id="score-lab"><button data-step="start">开始 / 重开</button> <button data-step="hit" disabled>命中一个</button> <button data-step="miss" disabled>失误一次</button><p role="status">准备 · 本局 0 · 最高 0 · 生命 3 · 关卡 1 · 目标 2</p></div>
  <details><summary>核对预测</summary><p>前两个目标各得 10 分。第二个命中先按第一关计分，然后升级。第三个目标值 20 分，所以本局累计 40 分。前两次失误会重排当前关的目标，第三次结束。重开后本局 0、最高 40、生命 3、关卡 1。</p></details>
  <h3>在原工程里找到每一次变化</h3><p>下载工程，解压并按 README 安装依赖，运行 <code>python game.py</code>。在准备画面按空格观察，再按 Enter 开始。游戏中再按 Enter，已有分数应保留。结束后点击中央按钮，观察哪些数字恢复初值。</p>
  <p>打开 game.py：run() 处理 Enter 和按钮点击，reset() 初始化本局。step() 用命中目标数 × 10 × 当前关卡加分，再取最高分。draw() 每帧读取这些值绘制记分牌。把加分写进 draw() 会让同一命中随着重绘反复加分。</p>
  <h3>关掉程序，纪录还在吗？</h3><p>在原游戏中刷新最高分，按 Q 正常退出后重新启动。Best 应显示刚才的纪录。游戏在结束或正常退出时把最高分写入用户目录中的 JSON 文件，启动时读取；首次运行没有文件时从 0 开始。上方网页实验的纪录只保留在本次课堂交互中。</p>
  <a href="python-game.zip?v=29">下载游戏工程</a> · <a href="#source-game~game.py">阅读 game.py</a> · <a href="#unit-game-collision">回看第 13 章</a></section>`;
}

function bindScoreLab() {
  const lab = document.getElementById('score-lab');
  if (!lab) return;
  let state = '准备', score = 0, best = 0, lives = 3, level = 1, targets = 2;
  lab.onclick = event => {
    const action = event.target.dataset.step;
    if (action === 'start' && state !== '进行中') {
      state = '进行中';
      score = 0; lives = 3; level = 1; targets = 2;
    } else if (state === '进行中' && action === 'hit') {
      score += 10 * level;
      best = Math.max(best, score);
      targets--;
      if (!targets) { level++; targets = 2; }
    } else if (state === '进行中' && action === 'miss') {
      lives--;
      if (lives) targets = 2;
      else state = '结束';
    } else return;
    lab.querySelector('[role=status]').textContent =
      `${state} · 本局 ${score} · 最高 ${best} · 生命 ${lives} · 关卡 ${level} · 目标 ${targets}`;
    for (const button of lab.querySelectorAll('button')) {
      button.disabled = button.dataset.step === 'start' ? state === '进行中' : state !== '进行中';
    }
  };
}
