// 新专题采用稳定字符串 ID，与原 46 章的数字 ID、学习进度相互独立。
let curriculum = [];
let sourcebook = {};
let unitCompleted;
try { unitCompleted = JSON.parse(localStorage.getItem('zx-unit-completed') || '[]'); if (!Array.isArray(unitCompleted)) unitCompleted=[]; } catch { unitCompleted=[]; }
const projectPackages = {
  game: {title:'信号守卫', file:'python-game.zip', path:'game', description:'Pygame：移动、发射、碰撞、计分、重开。', validation:'6 项无窗口逻辑测试通过，完成绘制冒烟检查；未在你的 Windows 上人工试玩。'},
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
function knowledgeHome() {
  const groups=[...new Set(curriculum.map(u=>u.group))];
  return `<div class="eyebrow">READ · TRACE · PRACTISE · BUILD</div><h1>全景学习地图</h1><p class="intro">顺着基础走，也能按问题查。把一个概念拆成运行机制、代码行为、失败边界和项目用途，再用练习检验是否真正理解。</p><div class="knowledge-stats"><b>${chapters.length} 章原有课程</b><b>${curriculum.length} 篇专题拆解</b><b>3 个新增独立工程</b></div><div class="notice"><b>如何使用这套教材</b><p>刚开始编程，先读三章零基础，再进入下面的基础分类。复习时按标签查知识点；完成基础后，可分别进入游戏、数据图表和 Web 应用。SQL Server 继续使用原有双册主线。</p><p>下表对照上传教材的全部章级主题与附录，讲解和练习采用独立编写的案例。主题已有对应入口，不等于逐页、逐道习题复刻；云平台操作采用可迁移的部署流程。每项验证范围在项目入口明示。</p><div class="actions"><a href="#chapter-39" class="primary">从零基础开始</a><a href="#coverage" class="secondary">教材主题对照</a><a href="#python-projects" class="secondary">三个实践项目</a></div></div><div class="category-links">${groups.map((g,i)=>`<button type="button" data-jump="category-${i}">${esc(g)}</button>`).join('')}</div>${groups.map((g,i)=>`<section class="knowledge-category" id="category-${i}"><div class="sectionhead"><h2>${esc(g)}</h2><span>${curriculum.filter(u=>u.group===g).length} 篇专题</span></div><div class="grid">${curriculum.filter(u=>u.group===g).map(u=>`<a class="card knowledge-card" href="#unit-${u.id}"><span class="label">${esc(u.book)} ${unitCompleted.includes(u.id)?'· ✓ 已掌握':''}</span><h3>${esc(u.title)}</h3><p>${esc(u.goal)}</p><div class="chips">${u.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><span>${u.sections.length} 个知识拆解 · 示例 · 练习解析 →</span></a>`).join('')}</div></section>`).join('')}<div class="notice"><b>贯穿应用：</b>原始博文 → Python 清洗 → SQL Server 幂等导入 → 统计报表。<a href="#integrated">进入交叉应用</a>。扩展练习使用独立目录，不需要先初始化数据库才能学习 Python。</div>`;
}
function coveragePage() {
  return `<div class="eyebrow">COVERAGE MAP</div><h1>教材主题对照</h1><p class="intro">按《Python 编程：从入门到实践（第 3 版）》的章级学习主题核对，结合网站原有章节与新增专题。点击进入具体正文，不把一个标题算作学会。</p><div class="notice">基础内容可按原章节学习，再读专题深入；三类项目使用原创工程。不同于原书的素材、例题及某一云平台部署界面，不列作“逐节同版完成”。</div><div class="table-scroll"><table><thead><tr><th>教材章节</th><th>主题</th><th>专题讲解</th><th>原有课程</th></tr></thead><tbody>${coverage.map(([n,title,units,old])=>`<tr><td>${esc(n)}</td><td>${esc(title)}</td><td>${units.map(unitLink).join('<br>')}</td><td>${old.map(i=>`<a href="#chapter-${i}">${esc(chapters[i].title)}</a>`).join('<br>')||'新增独立项目路线'}</td></tr>`).join('')}</tbody></table></div><div class="block"><h2>网站增加的学习维度</h2><ul><li>对象引用、浅深拷贝、数据契约、迭代器与生成器、装饰器。</li><li>脏数据拒绝、冲突审计、幂等导入、事务和 SQL Server 项目。</li><li>按知识类别查阅、双册交叉链接、可折叠答案、浏览器本地掌握记录。</li><li>样本与实时数据分开标识，测试替身与真实服务的验证结果分别报告。</li></ul></div>`;
}
function unitPage(id) {
  const u=curriculum.find(u=>u.id===id);
  if(!u)return '<h1>没有找到这个专题</h1><a href="#knowledge">返回学习地图</a>';
  const position=curriculum.indexOf(u);
  return `<article class="article"><div class="eyebrow">${esc(u.group)} / 专题 ${String(position+1).padStart(2,'0')}</div><h1>${esc(u.title)}</h1><p class="intro">${esc(u.goal)}</p><div class="chips">${u.tags.map(t=>`<span>${esc(t)}</span>`).join('')}</div><p class="muted">主题对照：${esc(u.book)} · ${u.sections.length} 个拆解 · 代码演练 · 练习解析</p>${u.before.length?`<div class="notice"><b>基础衔接：</b>${u.before.map(i=>`<a href="#chapter-${i}">${esc(chapters[i].title)}</a>`).join(' / ')}</div>`:''}<nav class="unit-toc" aria-label="本专题目录">${u.sections.map((s,i)=>`<button type="button" data-jump="point-${i}">${i+1}. ${esc(s.title)}</button>`).join('')}</nav>${u.sections.map((s,i)=>`<section class="block point" id="point-${i}"><span class="label">知识拆解 ${String(i+1).padStart(2,'0')}</span><h2>${esc(s.title)}</h2><p>${esc(s.text)}</p></section>`).join('')}<section class="block"><h2>代码演练与预期行为</h2><p class="muted">${u.runner==='shell'?'以下是终端命令；请先满足正文中的环境前提。':u.runner==='project'?'以下是完整工程中的片段；需在下载包的 Django 上下文中使用。':'以下使用 Python 3。第三方库请先按对应工程 requirements.txt 安装。'}</p><div class="codehead"><span>${u.runner==='shell'?'TERMINAL':u.runner==='project'?'PROJECT CONTEXT':'PYTHON'}</span><button type="button" data-copy-unit="main">复制</button></div><pre class="lined"><code>${codeMarkup(u.code)}</code></pre><div class="output">${esc(u.output)}</div></section><section class="block"><h2>常见错误与正确做法</h2>${u.pitfalls.map(p=>`<p class="pitfall-line">${esc(p)}</p>`).join('')}</section><section class="block"><h2>练习与解题过程</h2>${u.exercises.map((e,i)=>`<div class="exercise-card"><h3>练习 ${i+1}</h3><p>${esc(e.question)}</p><details><summary>先看思路提示</summary><p>${esc(e.thinking)}</p></details><details><summary>查看步骤、参考代码与结果</summary><p><b>思路：</b>${esc(e.thinking)}</p><p><b>步骤：</b>${esc(e.steps)}</p><div class="codehead"><span>参考解法</span><button type="button" data-copy-unit="${i}">复制</button></div><pre class="lined"><code>${codeMarkup(e.code)}</code></pre><div class="output">${esc(e.output)}</div></details></div>`).join('')}</section>${u.project?`<section class="block"><h2>把这个知识放进完整项目</h2>${projectCard(u.project)}</section>`:''}<section class="block"><h2>掌握检查</h2><p>合上示例，能够完成下面三项，再标记掌握。</p><ul>${u.mastery.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><a href="${esc(u.source)}" target="_blank" rel="noreferrer">官方资料：核对定义与 API ↗</a></section><div class="lessonfoot">${position?`<a class="secondary" href="#unit-${curriculum[position-1].id}">← 上一专题</a>`:'<a class="secondary" href="#knowledge">学习地图</a>'}<button class="primary" id="unit-complete" data-unit="${u.id}">${unitCompleted.includes(u.id)?'✓ 已掌握 · 点击取消':'标记专题已掌握'}</button>${position<curriculum.length-1?`<a class="secondary" href="#unit-${curriculum[position+1].id}">下一专题 →</a>`:'<a class="secondary" href="#python-projects">项目验收 →</a>'}</div></article>`;
}
function pythonProjectsPage() {
 return `<div class="eyebrow">BUILD THREE WAYS</div><h1>三条实践路线</h1><p class="intro">学过函数、类、文件和测试后，把它们组合成可以运行的作品。每个工程都提供源码、依赖、运行说明与验证用例。</p><div class="grid">${Object.keys(projectPackages).map(projectCard).join('')}</div><div class="notice"><b>从哪条路线开始：</b>想练持续状态与对象协作，选游戏；想连接数据专业，选图册；想给其他人用，先通过 Web 本地权限测试，再做独立部署。你可以全部完成，也可以按自己的节奏推进。</div><div class="actions"><a href="#unit-game-loop" class="secondary">游戏正文</a><a href="#unit-plotting" class="secondary">可视化正文</a><a href="#unit-web-foundations" class="secondary">Web 正文</a><a href="#project" class="secondary">原 SQL Server 项目</a></div><p>这些包是独立练习，原 sqlserver-demo.zip 与现有章节数据保持原样。Django 框架入门包使用本地 SQLite；现有数据工程仍以 SQL Server 为主。</p>`;
}
function bindKnowledge() {
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
