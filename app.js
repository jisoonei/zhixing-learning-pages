let chapters=[],current=-1;let completed;try{completed=JSON.parse(localStorage.getItem('zx-completed')||'[]');if(!Array.isArray(completed))completed=[]}catch{completed=[]}const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));function persist(){try{localStorage.setItem('zx-completed',JSON.stringify(completed))}catch{}}function updateProgress(){$('#progressText').textContent=`已掌握 ${completed.length} / ${chapters.length} 章`;$('#progress').max=chapters.length;$('#progress').value=completed.length;$('#progressText').textContent+=` · 专题 ${unitCompleted.length}/${curriculum.length}`}const collections = [
  { id: 'python', title: 'Python 课程', label: 'PYTHON', indexes: [39, 40, 41, 0, 35, 1, 15, 16, 2, 27, 4, 17, 44, 3, 5, 18, 6, 20, 45, 19, 28, 29, 30, 36, 37, 38], desc: '从基础语法、容器与函数，走到文件处理与代码组织。' },
  { id: 'sql', title: 'SQL Server 课程', label: 'SQL', indexes: [42, 43, 7, 31, 8, 23, 22, 21, 9, 10, 33, 11, 32, 26, 24, 25, 12, 34], desc: '从关系模型与查询，走到关联、分析与事务。' },
  { id: 'integrated', title: 'Python × SQL 综合应用', label: 'BUILD', indexes: [13, 14], desc: '连接 Python 与数据库，完成可复现的数据处理项目。' }
];

const reviewLinks = [
  ['coverage', '按教材查找'], ['knowledge', '按知识点查找'], ['labs', '互动实验汇总']
];
const projectTitle = '热点事件观察站 · 从原始数据到统计报表';
const projectsTitle = '学完基础后，选一个 Python 项目';
const navPreferences = new Map();
function navLink(id, label, active, done = false) {
  return `<a href="#${esc(id)}"${active === id ? ' class="active" aria-current="page"' : ''}>${esc(label)}${done ? ' ✓' : ''}</a>`;
}
function navGroup(id, label, body, open) {
  return `<details class="nav-group" data-group="${id}" ${open ? 'open' : ''}><summary>${esc(label)}</summary><div>${body}</div></details>`;
}
function nav() {
  const q = $('#search').value.trim().toLowerCase();
  const raw = canonicalLesson(location.hash.slice(1) || 'home');
  const routeId = rosterSection(raw) ? raw.split('/')[0] : raw;
  const active = routeId.startsWith('project/') ? 'project' : routeId;
  const includes = value => value.toLowerCase().includes(q);
  let html = navLink('home', '全书导览', active);
  let hits = 0;
  const review = reviewLinks.filter(([id, title]) => includes(title) || (id === 'labs' && includes('原理实验室')));
  let reviewBody = review.map(([id, title]) => navLink(id, title, active.startsWith('lab-') ? 'labs' : active)).join('');
  const units = curriculum.filter(u => q && includes(JSON.stringify(u)));
  reviewBody += units.map(u => navLink('unit-' + u.id, u.title, active, unitCompleted.includes(u.id))).join('');
  hits += review.length + units.length;
  if (reviewBody) html += navGroup('review', '查找与复习', reviewBody, q || (navPreferences.get('review') ?? true));
  for (const group of collections) {
    const entries = group.indexes.filter(i => !q || includes(chapterTitle(i)) || includes(JSON.stringify(chapters[i])));
    const extra = group.id === 'python' ? ['python-projects', projectsTitle] : group.id === 'integrated' ? ['project', projectTitle] : null;
    const showExtra = extra && (includes(extra[1]) || (group.id === 'python' && includes('游戏 可视化 Web 实践路线')));
    const showOverview = q && includes(group.title);
    if (!entries.length && !showExtra && !showOverview) continue;
    const inside = active === group.id || group.indexes.includes(current) || active === extra?.[0] ||
      (group.id === 'python' && active.startsWith('source-'));
    const defaultOpen = inside || (group.id === 'python' && active === 'home');
    let body = entries.map(i => {
      const position = group.indexes.indexOf(i) + 1;
      const title = i >= 39 && i <= 43 ? chapterTitle(i) : (group.id === 'python' ? '课 ' : '') + String(position).padStart(2, '0') + '　' + chapterTitle(i);
      return navLink('chapter-' + i, title, active, completed.includes(i));
    }).join('');
    if (!q || showOverview) body += navLink(group.id, group.title + '总览', active);
    if (showExtra) body += navLink(...extra, active);
    hits += entries.length + Number(Boolean(showExtra)) + Number(Boolean(showOverview));
    html += navGroup(group.id, group.title, body, q || inside || (navPreferences.get(group.id) ?? defaultOpen));
  }
  if (q && !hits) html += '<p class="muted">没有匹配内容，请换一个关键词。</p>';
  $('#nav').innerHTML = html;
  if (!q) $('#nav').querySelectorAll('details > summary').forEach(summary => {
    summary.onclick = () => navPreferences.set(summary.parentElement.dataset.group, !summary.parentElement.open);
  });
  updateProgress();
}

function sqlLearningRoutes() {
  return `<section class="notice">
    <p><b>按自己的节奏练。</b> 想先熟悉语法，可从两章零基础开始，每次练一点。想直接尝试项目，也可以先初始化沙盒，回头再补练。</p>
    <div class="actions"><a class="secondary" href="#chapter-42">先练 SELECT →</a><a class="secondary" href="#chapter-7">准备项目沙盒 →</a></div>
    <p>前两章可直接在 SSMS 练习。后续读取观察站样本数据的章节，需要先运行沙盒初始化脚本。</p>
  </section>`;
}
function book(id){
 const g=collections.find(x=>x.id===id);
 return `<div class="eyebrow">${g.label} · 学习分区</div><h1>${g.title}</h1><p class="intro">${g.desc}</p>${id==='python' ? textbookTrail() : ''}<div class="notice"><b>当前版本说明：</b>原有章节完整保留。新增全景知识库按概念分类，补充机制拆解、三类独立项目和教材主题对照。<a href="#knowledge">进入分类学习 →</a></div>${id==='python'?'<div class="actions"><a class="secondary" href="python_ch01.html">阅读五模块排版示例 ↗</a></div>':''}${id==='sql'?sqlLearningRoutes():''}${id==='python'?'<div class="notice"><b>从基础到实战</b><p>先学输出、变量和循环，再练容器、函数、文件与测试。每次可以读一段讲解，运行示例，先自己做题，再展开参考解法。</p><div class="actions"><a class="secondary" href="#chapter-39">从第一条输出开始</a><a class="secondary" href="#chapter-45">练习 CSV 事件简报 →</a></div><p>基础主题和学习顺序参考埃里克·马瑟斯的《Python 编程：从入门到实践（第 3 版）》。站内练习使用独立编写的博文示例。</p></div>':''}<div class="chapterlist booklist">${g.indexes.map((i,n)=>`<a href="#chapter-${i}"><span><b>${String(n+1).padStart(2,'0')}</b>　${esc(chapterTitle(i))}<small>${esc(chapters[i].goal)}</small></span><span>${completed.includes(i)?'✓ 已掌握　':''}→</span></a>`).join('')}</div>${id==='integrated' ? `<div class="actions"><a class="primary" href="#project">${projectTitle}</a></div>` : id==='python' ? `<div class="actions"><a class="secondary" href="#python-projects">${projectsTitle}</a></div>` : ''}<div class="sectionhead"><h2>接下来</h2></div><p class="muted">每章按“核心概念、通俗类比、最小代码、贯穿项目、原理与避坑”组织；专题讲解与原有章节相互链接，可按顺序学习，也可按知识点查阅。</p><div class="actions">${collections.filter(x=>x.id!==id).map(x=>`<a class="secondary" href="#${x.id}">${x.title} →</a>`).join('')}</div>`;
}
function home(){return `${startingPanel()}<div class="sectionhead"><h2>选择学习分区</h2><span>两册独立学习，最后汇合到项目</span></div><div class="grid book-grid">${collections.map(g=>`<a href="#${g.id}" class="card book-card"><span class="label">${g.label} · ${g.indexes.length} 章</span><h3>${g.title}</h3><p>${g.desc}</p><span>进入分区 →</span></a>`).join('')}</div><div class="notice"><b>内容进度：</b>原有 ${chapters.length} 章之外，新增 ${curriculum.length} 篇分主题正文和三个独立工程。<a href="#coverage">核对教材主题</a>，或<a href="#knowledge">按知识分类查阅</a>。</div><div class="sectionhead"><h2>现有章节地图</h2><span>按依赖关系学习，不按视频时长打卡</span></div><div class="grid">${collections.map(g=>`<section class="card"><div class="label">${g.label}</div><h3>${g.title}</h3><p>${g.desc}</p><div class="chapterlist">${g.indexes.map((i,n)=>`<a href="#chapter-${i}"><span>${String(n+1).padStart(2,'0')}　${esc(chapterTitle(i))}</span><span>→</span></a>`).join('')}</div></section>`).join('')}</div><div class="sectionhead"><h2>理解难点，动手看一遍</h2><a href="#labs">进入实验室 →</a></div><div class="grid">${['引用与拷贝：究竟改了谁？','SQL 流水线：数据在哪一步减少？','JOIN：为什么多了这么多行？','事务：提交之前发生了什么？'].map((x,i)=>`<a href="#lab-${i}" class="card"><span class="badge">交互实验 0${i+1}</span><h3 style="margin-top:12px">${x}</h3><span class="muted">操作 → 观察 → 解释　↗</span></a>`).join('')}</div><div class="notice"><b>怎么学：</b>每次 30–45 分钟：读原理 10 分钟 → 手写代码 20 分钟 → 解释结果 5 分钟。卡住时留下一条“下一步做什么”，不必从头重学。完成练习后再标记掌握。</div><div class="sectionhead"><h2>从知识点走向完整作品</h2><a href="#python-projects">查看源码与验证 →</a></div><div class="grid">${Object.keys(projectPackages).map(projectCard).join('')}</div><div class="block source"><b>官方资料入口</b><p><a href="https://docs.python.org/3.14/" target="_blank" rel="noreferrer">Python 3.14：教程 · 语言参考 · 标准库 ↗</a>　 /　<a href="https://learn.microsoft.com/zh-cn/sql/t-sql/" target="_blank" rel="noreferrer">SQL Server T-SQL 参考手册 ↗</a>　 /　<a href="https://sqlite.org/docs.html" target="_blank" rel="noreferrer">SQLite 文档 ↗</a></p><span class="muted">按官方章节组织的原创中文讲解，并非官方手册全文翻译。各章提供对应来源，视频作为可选补充。原两份速查手册：<a href="original-python.html">Python</a> / <a href="original-sql.html">SQL</a>（历史版本，部分表述已在新书修正）。</span></div>`}
function codeMarkup(source){
 const token=/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|--[^\n]*|\b(?:def|return|for|in|if|else|elif|import|from|as|with|try|except|raise|class|yield|print|SELECT|FROM|WHERE|ORDER|BY|GROUP|HAVING|JOIN|LEFT|ON|AS|CREATE|TABLE|INSERT|INTO|VALUES|UPDATE|DELETE|BEGIN|TRANSACTION|ROLLBACK|COMMIT|WITH|CASE|WHEN|THEN|END|NULL|NOT|AND|OR|SELECT|TOP|DECLARE|INT|NVARCHAR|PRIMARY|KEY|FOREIGN|REFERENCES)\b|\b\d+\b)/gi;
 return source.split('\n').map(line=>{let offset=0,out='';for(const m of line.matchAll(token)){out+=esc(line.slice(offset,m.index));let t=m[0],kind=t[0]==='#'||t.startsWith('--')?'comment':t[0]==='"'||t[0]==="'"?'string':/^\d/.test(t)?'number':'keyword';out+=`<span class="syntax-${kind}">${esc(t)}</span>`;offset=m.index+t.length}out+=esc(line.slice(offset));return `<span class="code-line">${out||' '}</span>`}).join('');
}
function pythonWorkshop(workshop) {
  if (!workshop) return '';
  return `<section class="block">
    <h2>${esc(workshop.title)}</h2>
    <ol>${workshop.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>
    <pre class="lined"><code>${codeMarkup(workshop.code)}</code></pre>
    <p><b>预期输出</b></p><div class="output">${esc(workshop.output)}</div>
    <p><b>自己试一遍</b>　${esc(workshop.task)}</p>
    <details><summary>看提示</summary><p>${esc(workshop.hint)}</p></details>
    <details><summary>对照参考解法</summary>
      <pre class="lined"><code>${codeMarkup(workshop.solution)}</code></pre>
      <p><b>预期输出</b></p><div class="output">${esc(workshop.expected)}</div>
    </details>
  </section>`;
}

function rosterIntroduction() {
  const example = 'shows = ["早间新闻", "晚间电台"]\nfor show in shows:\n    print(show)';
  return `<section class="block roster"><h2>从一个节目到一份名单</h2>
    <p>上一课的 <code>show</code> 保存一个节目名。现在有两个节目。用方括号把它们按播出顺序放在一起，中间用英文逗号隔开，这就是一个列表。把整份名单取名为 <code>shows</code>。</p>
    ${readingCode(example, '节目播出顺序')}
    <p><code>for show in shows:</code> 表示从名单中依次取出一项，临时叫它 <code>show</code>。末尾的英文冒号引出每一轮要做的事。下一行向右缩进四个空格，所以每取出一个节目，Python 就显示一次节目名。</p>
    <details><summary>先猜两行的顺序，再核对结果</summary>${readingCode('早间新闻\n晚间电台', '预期输出')}
    <p>第一轮取到“早间新闻”，第二轮取到“晚间电台”。名单读完后循环结束。把名单里两个节目交换位置，输出也会交换顺序。</p></details>
    <p>在电脑上把这三行保存为 <code>shows.py</code>，运行 <code>python shows.py</code>。再把名单改成 <code>[]</code>，观察这次会显示几行。</p>
    <details><summary>核对空名单</summary><p>零行。名单里没有节目，缩进的那条指令一次也不会执行。</p></details>
    <p><a href="#chapter-2">想只显示符合条件的节目？接着学 if 筛选。</a></p></section>`;
}
const labQuestions = {
  copy: ['lab-0', '改动副本，原列表会跟着变吗？'],
  pipeline: ['lab-1', '加上分组条件后，还剩哪些行？'],
  join: ['lab-2', '改成左连接，多出来的是哪一行？'],
  transaction: ['lab-3', '这一批改动回滚后，还剩下多少赞？']
};
function projectStep(i) {
  if ([18, 37, 45].includes(i)) return ['clean', '回到热点事件观察站，核对 CSV 清洗和拒绝记录'];
  if ([8, 9, 10, 13].includes(i)) return ['query', '回到热点事件观察站，核对数据关系和查询结果'];
  if (i === 14) return ['report', '回到热点事件观察站，逐行核对最终报表'];
  return null;
}

function lesson(i){let c=chapters[i];let group=collections.find(g=>g.indexes.includes(i));
const starter = Object.hasOwn(starterLessons, i);
const guided = Object.hasOwn(rosterCourse, i);
const labLink = labQuestions[c.lab];
const step = projectStep(i);
return `<article class="article"><div class="eyebrow">${group.title} / 站内第 ${group.indexes.indexOf(i)+1} 课</div><h1>${esc(chapterTitle(i))}</h1>
${guided ? rosterTask(i) : starter ? starterActivity(i) : i === 41 ? rosterIntroduction() : ''}
${guided ? '<details class="chapter-extension"><summary>拓展练习 · 原站内课程与案例</summary>' : starter ? '<details class="chapter-extension"><summary>继续深读 · 本章讲解和电脑练习</summary>' : ''}
${chapterReadings(i)}<p class="intro">${esc(c.goal)}</p><div class="chips">${c.topics.map(t=>`<span>${esc(t)}</span>`).join('')}</div>
<section><div class="block"><h2>01　核心概念</h2><p>${esc(c.concept)}</p>${c.why && c.why!==c.concept?`<p>${esc(c.why)}</p>`:''}${(c.explanation||[]).map((paragraph,n)=>`<p><b>要点 ${n+1}：</b>${esc(paragraph)}</p>`).join('')}<a href="${c.source}" target="_blank" rel="noreferrer">对应官方文档 ↗</a></div>
<div class="block"><h2>02　通俗类比</h2><div class="notice">${esc(c.analogy)}</div></div>
<div class="block"><h2>03　最小代码与预期结果</h2><p>${(i>=7&&i<=12)||c.language==='SQL'?(c.beginner_sql?'SQL 入门示例使用 SQL Server 的 T-SQL，操作独立的临时数据。':'SQL 示例使用 SQL Server 的 T-SQL；查询示例先按下方说明准备样本数据。'):'Python 示例使用 Python 3；pandas 和数据库连接章节需要额外安装依赖。'}页面实验为教学模型，不是在线解释器。</p>${c.prerequisites?`<div class="notice"><b>运行前提：</b>${esc(c.prerequisites)}</div>`:''}${!c.beginner_sql&&((i>=8&&i<=12)||c.language==='SQL')?'<p><a href="sqlserver-setup.sql?v=safety-20261116-1" download>下载 SQL Server 样本建表与数据脚本</a>：整体运行后会创建或检查固定沙盒；不要自行选择业务库建表。</p>':''}<div class="codehead"><span>EXAMPLE · ${(i>=7&&i<=12)||c.language==='SQL'?'SQL SERVER / T-SQL':'PYTHON'}</span><button id="copycode">复制代码</button></div><pre class="lined"><code>${codeMarkup(c.code)}</code></pre><div class="muted" style="margin-top:12px">预期结果 / 行为</div><div class="output">${esc(c.output)}</div></div>
<div class="block"><h2>04　贯穿式 Demo 演进</h2><p>${esc(c.demo)}</p>${c.practice_steps?.length?`<h3>跟着做</h3><ol>${c.practice_steps.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}<p><b>动手练习：</b>${esc(c.task)}</p><details><summary>查看参考思路</summary><p>${esc(c.answer)}</p>${c.answer_code?`<div class="codehead"><span>完整 T-SQL 参考答案</span><button id="copyanswer">复制答案 SQL</button></div><pre class="lined"><code>${codeMarkup(c.answer_code)}</code></pre>`:''}</details>${c.exercise2 && c.exercise2!==c.task?`<p><b>巩固练习：</b>${esc(c.exercise2)}</p><details><summary>查看巩固练习答案</summary><p>${esc(c.answer2)}</p></details>`:''}${step ? `<p><a href="#project/${step[0]}">${step[1]}</a></p>` : ''}${labLink ? `<p><a href="#${labLink[0]}">${labLink[1]}</a></p>` + lab(c.lab) : ''}</div>
<div class="block"><h2>05　底层原理 / 避坑指南</h2><details><summary>展开原理与常见错误</summary><p>${esc(c.deep)}</p><p>${esc(c.pitfall)}</p></details></div></section>
${pythonWorkshop(c.python_workshop)}${starter || guided ? '</details>' : ''}
<div class="lessonfoot"><button id="prev" ${group.indexes.indexOf(i)===0?'disabled':''}>上一节站内课</button><button id="complete" class="primary">${completed.includes(i)?'✓ 已掌握 · 点击取消':'标记本章已掌握'}</button>${group.indexes.indexOf(i)<group.indexes.length-1?'<button id="next">下一节站内课</button>':(group.id === 'python' ? '<a class="secondary" href="#python-projects">选择 Python 项目</a>' : '<a class="secondary" href="#project">项目验收 →</a>')}</div></article>`}
function project(){return `<div class="eyebrow">THE THROUGHLINE PROJECT</div><h1>热点事件观察站</h1><p class="intro">同一套数据，一步步从 Python 字典走到 SQL 报表。使用合成数据，不需要爬虫、账号或外部 API。</p><div class="actions"><a href="sqlserver-demo.zip?v=safety-20261116-1" download class="primary">↓ 下载 SQL Server 安全项目包</a><a href="#chapter-14" class="secondary">阅读交付章节 →</a><a class="secondary" href="sqlserver-audit.md" download>↓ 16 章 SQL 审计记录</a></div><div class="notice">SQL Server 安全版：固定连接 Zhixing_Sandbox 并核验手册标记；只新增缺失 ID，相同数据跳过，不同内容写入 conflicts.csv。不会清空或覆盖已有博文。旧 SQLite 包仅供历史对照。</div><div class="grid">${[['01 / 内存版','Python 基础','用字典表示博文、用列表保存记录；实现筛选、去重与统计函数。'],['02 / 文件版','Python 文件处理','读取 UTF-8 CSV，保留被拒绝记录及原因；拆分职责并验证边界。'],['03 / 数据库版','SQL Server 核心','定义事件与博文两张表；完成关联、分组、窗口排名和事务实验。'],['04 / 完整流水线','交叉应用 1–2','参数化批量写入，生成含零博文事件的报表；重复运行结果不翻倍。']].map((a,i)=>`<div class="card project-step" id="project-${['memory','clean','query','delivery'][i]}"><span class="label">${a[1]}</span><h3>${a[0]}</h3><p>${a[2]}</p></div>`).join('')}</div><div class="sectionhead"><h2>数据契约</h2></div><div class="card"><table><tr><th>表</th><th>一行的含义</th><th>字段</th></tr><tr><td>events</td><td>一件热点事件</td><td>id、title</td></tr><tr><td>posts</td><td>一条独立博文</td><td>id、event_id、likes、text</td></tr></table><p>events.id → posts.event_id：一对多。id 不重复，likes 是非负整数，event_id 必须存在。时间分析、用户关系和情感分类留到后续扩展，避免初版模型过大。</p></div><div class="sectionhead project-step" id="project-report"><h2>预期产物与验收</h2></div><div class="card"><table><tr><th>事件</th><th>博文数</th><th>点赞总量</th></tr><tr><td>校园音乐节</td><td>3</td><td>45</td></tr><tr><td>科技展</td><td>2</td><td>20</td></tr><tr><td>读书会</td><td>0</td><td>0</td></tr></table><p>7 行输入，1 行重复 ID、1 行非法点赞值，最终 5 行有效记录。初始化已写入相同样本，原样导入新增 0、相同跳过 5；已有额外记录会保留，汇总不会被重置。运行 SQL Server 版 main.py 生成 report.csv、rejected.csv 和 conflicts.csv；README 提供操作步骤与改进任务。</p><div class="output">py main.py\n# 或 python3 main.py\n# 连续运行两次：5 条有效记录，不翻倍。</div></div>`}
const rows=[{id:1,event_id:1,likes:12},{id:2,event_id:1,likes:3},{id:3,event_id:1,likes:30},{id:4,event_id:2,likes:8},{id:5,event_id:2,likes:12}],events=[{id:1,title:'校园音乐节'},{id:2,title:'科技展'},{id:3,title:'读书会'}];let state={};function table(rows){if(!rows.length)return '<p>结果为空：没有满足条件的记录。</p>';const keys=Object.keys(rows[0]);return `<table><tr>${keys.map(k=>`<th>${esc(k)}</th>`).join('')}</tr>${rows.map(r=>`<tr>${keys.map(k=>`<td>${r[k]===null?'<i>NULL</i>':esc(r[k])}</td>`).join('')}</tr>`).join('')}</table>`}
function lab(type){let content={copy:`<select id="copyMode" aria-label="拷贝方式"><option value="alias">赋值 b = a</option><option value="shallow">浅拷贝 b = a.copy()</option><option value="deep">深拷贝 b = deepcopy(a)</option></select><button id="nested">修改 b[0]["likes"] = 99</button><button id="append">向 b 追加一条记录</button>`,pipeline:`<label>点赞阈值 ≥ <output id="thresholdValue">10</output>　<input id="threshold" type="range" min="0" max="30" value="10"></label><button id="stepback">上一步</button><button id="stepnext">下一步 →</button>`,join:`<select id="joinMode" aria-label="连接类型"><option value="inner">INNER JOIN · 只保留匹配</option><option value="left">LEFT JOIN · 保留全部事件</option></select>`,transaction:`<button id="stage">暂存 2 条记录</button><button id="commit">COMMIT 提交</button><button id="rollback">ROLLBACK 回滚</button>`}[type];return `<section class="lab" data-type="${type}"><div class="eyebrow">INTERACTIVE LAB · 教学模型</div><h3>${{copy:'引用与拷贝',pipeline:'SQL 逻辑执行顺序',join:'看见 JOIN 的结果',transaction:'事务状态实验'}[type]}</h3><div class="controls">${content}<button id="resetlab">重置</button></div><div id="labView" class="labview" aria-live="polite"></div><p class="muted">可改变参数观察结果。示意模型不等同于解释器内存布局或数据库物理执行机制。</p></section>`}
function initLab(){let el=$('.lab');if(!el)return;let type=el.dataset.type;state={mode:'alias',nested:false,append:false,step:0,threshold:10,join:'inner',saved:5,pending:0,message:'尚未开始新批次。'};const update=()=>{let html='';if(type==='copy'){let a=[{likes:12}],b=state.mode==='alias'?a:state.mode==='shallow'?[...a]:JSON.parse(JSON.stringify(a));if(state.nested)b[0].likes=99;if(state.append)b.push({likes:20});html=`<div class="nodes"><div class="node">名称 a<strong>${esc(JSON.stringify(a))}</strong></div><div class="node">名称 b<strong>${esc(JSON.stringify(b))}</strong></div></div><p>${state.mode==='alias'?'a 与 b → 同一外层列表 → 同一内部字典':state.mode==='shallow'?'a 与 b → 不同外层列表 → 共享原有内部字典':'a 与 b → 不同外层列表 → 不同内部字典'}</p><span class="badge">${a===b?'a is b：True':'a is b：False'} · ${a[0]===b[0]?'a[0] is b[0]：True':'a[0] is b[0]：False'}</span>`}if(type==='pipeline'){const labels=['FROM','WHERE','GROUP BY','HAVING','ORDER BY'];let rs=rows.filter(r=>r.likes>=state.threshold),gr=Object.values(rs.reduce((a,r)=>{a[r.event_id]??={event_id:r.event_id,n:0,total:0};a[r.event_id].n++;a[r.event_id].total+=r.likes;return a},{}));let views=[rows,rs,gr,gr.filter(r=>r.n>=2),gr.filter(r=>r.n>=2).sort((a,b)=>b.total-a.total)];html=`<div class="steps">${labels.map((x,i)=>`<span class="${i===state.step?'on':''}">${i+1}. ${x}</span>`).join('')}</div><p>${['取 posts 中的全部 5 行。','逐行保留 likes ≥ '+state.threshold+' 的记录。','按 event_id 分组，计算 COUNT(*) 与 SUM(likes)。','只保留 n ≥ 2 的分组。','按 total 降序排序。这是逻辑理解模型，SELECT 投影合并展示在分组结果中。'][state.step]}</p>${table(views[state.step])}`;$('#thresholdValue').textContent=state.threshold;$('#stepback').disabled=state.step===0;$('#stepnext').disabled=state.step===4}if(type==='join'){let joined=events.flatMap(e=>{let p=rows.filter(r=>r.event_id===e.id);return p.length?p.map(r=>({event:e.title,post_id:r.id,likes:r.likes})):state.join==='left'?[{event:e.title,post_id:null,likes:null}]:[]});html=table(joined)+`<p>结果 ${joined.length} 行。${state.join==='left'?'读书会占位行的 COUNT(*) = 1，但 COUNT(post_id) = 0。':'读书会没有匹配记录，因此不在结果中。'}</p>`}if(type==='transaction'){html=`<div class="nodes"><div class="node">已提交记录<strong>${state.saved}</strong>已确认状态</div><div class="node">本批暂存<strong>${state.pending}</strong>尚未提交</div></div><p>${state.message}</p>`;$('#stage').disabled=state.pending>0;$('#commit').disabled=$('#rollback').disabled=!state.pending}$('#labView').innerHTML=html};$('#resetlab').onclick=()=>{const html=lab(type);el.outerHTML=html;initLab()};if(type==='copy'){$('#copyMode').onchange=e=>{state.mode=e.target.value;state.nested=false;state.append=false;update()};$('#nested').onclick=()=>{state.nested=true;update()};$('#append').onclick=()=>{state.append=true;update()}}if(type==='pipeline'){$('#threshold').oninput=e=>{state.threshold=+e.target.value;update()};$('#stepnext').onclick=()=>{state.step=Math.min(4,state.step+1);update()};$('#stepback').onclick=()=>{state.step=Math.max(0,state.step-1);update()}}if(type==='join')$('#joinMode').onchange=e=>{state.join=e.target.value;update()};if(type==='transaction'){$('#stage').onclick=()=>{state.pending=2;state.message='本事务暂存 2 条；已提交状态仍是 '+state.saved+' 条。';update()};$('#commit').onclick=()=>{state.saved+=state.pending;state.pending=0;state.message='提交成功，两条修改一起生效。';update()};$('#rollback').onclick=()=>{state.pending=0;state.message='暂存记录已撤销，已提交状态不变。';update()}}update()}
function route(){const requested = location.hash.slice(1) || 'home';
  const section = rosterSection(requested);
  const h = section ? 'chapter-' + section.chapter : canonicalLesson(requested);
  if (!section && h !== requested) history.replaceState(history.state, '', '#' + h);
  current = -1;
  let html;
  if(h.startsWith('source-')){current=-4;const [kind,path]=h.slice(7).split('~');html=sourcePage(kind,path)}if(h==='knowledge'){current=-4;html=knowledgeHome()}if(h==='coverage'){current=-4;html=coveragePage()}if(h==='python-projects'){current=-4;html=pythonProjectsPage()}if(h.startsWith('unit-')){current=-4;html=unitPage(h.slice(5))}if(collections.some(g=>g.id===h))html=book(h);if(h.startsWith('chapter-')){let i=Number(h.split('-')[1]);if(Number.isInteger(i)&&i>=0&&i<chapters.length){current=i;html=lesson(i)}}const projectAnchor = /^project\/(clean|query|report)$/.exec(h);if(h==='project'||projectAnchor){current=-2;html=project()}if(h==='labs'||h.startsWith('lab-')){current=-3;let n=Number(h.split('-')[1]);if(!Number.isInteger(n)||n<0||n>3)n=0;html=`<div class="eyebrow">UNDER THE HOOD</div><h1>原理实验室</h1><p class="intro">不靠死记结论。改一个条件，看看数据怎样变化。</p><div class="actions">${['引用与拷贝','SQL 流水线','JOIN','事务'].map((x,i)=>`<a class="${i===n?'primary':'secondary'}" href="#lab-${i}">${x}</a>`).join('')}</div>${lab(['copy','pipeline','join','transaction'][n])}<div class="notice">先预测，再操作，再解释。这个简化模型只呈现当前概念；完整代码可以在本地 Python / 数据库中验证。</div>`}$('#main').innerHTML=html||home();$('#crumb').textContent=current>=0?chapterTitle(current):current===-2?'贯穿项目':current===-3?'原理实验室':(collections.find(g=>g.id===h)?.title||'全书导览');if(current===-4)$('#crumb').textContent=h.startsWith('unit-')?(curriculum.find(u=>u.id===h.slice(5))?.title||'专题'):({'coverage':'按教材查找','knowledge':'按知识点查找','python-projects':projectsTitle}[h] || '工程源码');nav();$('#sidebar').classList.remove('open');syncMenu();if(section)document.getElementById('roster-'+section.stage.id).scrollIntoView();else if(projectAnchor)document.getElementById('project-'+projectAnchor[1]).scrollIntoView();else window.scrollTo(0,0);if(current>=0){$('#copycode').onclick=async()=>{try{await navigator.clipboard.writeText(chapters[current].code);$('#copycode').textContent='已复制'}catch{$('#copycode').textContent='请选中代码复制'}};if($('#copyanswer'))$('#copyanswer').onclick=async()=>{try{await navigator.clipboard.writeText(chapters[current].answer_code);$('#copyanswer').textContent='已复制'}catch{$('#copyanswer').textContent='请选中代码复制'}};$('#complete').onclick=()=>{completed=completed.includes(current)?completed.filter(i=>i!==current):[...completed,current];persist();$('#complete').textContent=completed.includes(current)?'✓ 已掌握 · 点击取消':'标记本章已掌握';nav()};const group=collections.find(g=>g.indexes.includes(current));const position=group.indexes.indexOf(current);$('#prev').onclick=()=>location.hash='chapter-'+group.indexes[position-1];if($('#next'))$('#next').onclick=()=>location.hash='chapter-'+group.indexes[position+1]}initLab();bindKnowledge();if(Object.hasOwn(rosterCourse,current))bindRosterCopy();if(Object.hasOwn(starterLessons,current))bindStarter(current);if(studyRouteTitle(h))writeStudyValue('zx-last-lesson',section ? requested : h)}
const menu=$('#menu');
function syncMenu(){const mobile=matchMedia('(max-width:700px)').matches;const opened=mobile?$('#sidebar').classList.contains('open'):!document.body.classList.contains('sidebar-collapsed');menu.setAttribute('aria-expanded',String(opened));menu.setAttribute('aria-label',opened?'收起目录':'打开目录');}
menu.onclick=()=>{if(matchMedia('(max-width:700px)').matches)$('#sidebar').classList.toggle('open');else document.body.classList.toggle('sidebar-collapsed');syncMenu()};
const themeButton=$('#theme');let theme;try{theme=localStorage.getItem('zx-theme')}catch{};if(theme==='dark'||theme==='light')document.documentElement.dataset.theme=theme;
function syncTheme(){themeButton.textContent=document.documentElement.dataset.theme==='dark'?'浅色':'深色'}
themeButton.onclick=()=>{let t=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem('zx-theme',t)}catch{}syncTheme()};syncTheme();syncMenu();window.addEventListener('resize',syncMenu);
$('#nav').addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link && link.hash === location.hash && matchMedia('(max-width:700px)').matches) {
    $('#sidebar').classList.remove('open');
    syncMenu();
  }
});
$('#search').oninput=nav;window.onhashchange=route;document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#sidebar').classList.remove('open');syncMenu()}});Promise.all(['chapters.json?v=14-preserved','curriculum.json?v=23','sourcebook.json?v=29'].map(url=>fetch(url).then(r=>{if(!r.ok)throw Error();return r.json()}))).then(([c,u,s])=>{chapters=c;curriculum=u;sourcebook=s;route()}).catch(()=>$('#main').textContent='章节加载失败，请刷新页面重试。');
