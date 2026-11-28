// A single lesson body is shared by the textbook index, search, and topic pages.
const appendixLessons = {
  'appendix-a': {label: '附录 A', title: '安装及故障排除', task: '让终端运行第一份脚本', unit: 'runtime',
    summary: '按 Windows、macOS 或 Linux 核对解释器，再定位命令找不到、文件找不到和环境不一致。',
    sources: [['Windows 安装指南', 'https://docs.python.org/3/using/windows.html'], ['macOS 安装指南', 'https://docs.python.org/3/using/mac.html'], ['Unix 安装指南', 'https://docs.python.org/3/using/unix.html']], body: installationLesson},
  'appendix-b': {label: '附录 B', title: '文本编辑器和 IDE', task: '用编辑器运行同一份文件', unit: 'runtime',
    summary: '用 IDLE 或 VS Code 运行、修改和重新执行同一个文件，比较编辑器与终端使用的解释器。',
    sources: [['IDLE 操作手册', 'https://docs.python.org/3/library/idle.html'], ['VS Code 的 Python 环境', 'https://code.visualstudio.com/docs/python/environments']], body: editorLesson},
  'appendix-c': {label: '附录 C', title: '寻求帮助', task: '把报错整理成可复现的问题', unit: 'git',
    summary: '从一处相对路径报错出发，在新目录复现，为同学写一份能重跑的求助说明。',
    sources: [['Python 异常说明', 'https://docs.python.org/3/tutorial/errors.html']], body: helpLesson},
  'appendix-d': {label: '附录 D', title: '使用 Git 进行版本控制', task: '提交、改错并恢复一份节目单', unit: 'git',
    summary: '在空白练习仓库观察工作区与暂存区，让一次错误提交可追溯地恢复。',
    sources: [['Git diff', 'https://git-scm.com/docs/git-diff'], ['Git revert', 'https://git-scm.com/docs/git-revert']], body: gitLesson},
  'appendix-e': {label: '附录 E', title: '部署故障排除', task: '定位研习簿的部署故障', unit: 'web-deploy',
    summary: '用静态文件故障练习收集证据，再按域名、证书、代理、应用和数据逐层验收。',
    sources: [['Django 5.2 部署检查', 'https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/']], body: deploymentLesson}
};

const probeCode = 'import sys\nfrom pathlib import Path\n\nprint("节目单 v1")\nprint(sys.executable)\nprint(Path(__file__).resolve())';

function installationLesson() {
  return `<section class="block"><h2>先让终端找到 Python 3</h2><p>打开自己系统对应的一栏，在终端输入命令。看到以 <code>Python 3.</code> 开头的版本号后，保留这个终端。</p>
  <details><summary>Windows · PowerShell</summary><p>在开始菜单打开 PowerShell，运行 <code>py -3 --version</code>。若 py 无法识别，再试 <code>python --version</code>。两者都没有给出 Python 3 版本时，从 Python 官方 Windows 下载页安装 Python 3，重新打开终端再试。若 python 打开商店，但 py 已能返回版本号，后面直接用 py -3。</p></details>
  <details><summary>macOS · 终端</summary><p>在“终端”运行 <code>python3 --version</code>。若提示 command not found，从 python.org 安装适合 macOS 的 Python 3 安装包，打开新终端重试。用 <code>command -v python3</code> 查看当前选中的程序。保留系统组件，在自己的练习目录使用虚拟环境。</p></details>
  <details><summary>Linux · 终端</summary><p>运行 <code>python3 --version</code>。若找不到，在发行版的软件管理器中安装 Python 3。创建虚拟环境时若报 ensurepip 不可用，在 Debian 或 Ubuntu 的软件管理器中补装与解释器相配的 python3-venv 包，再在一个新目录创建环境。</p></details></section>
  <section class="block"><h2>让脚本报出自己的位置</h2><p>新建空文件夹 python-start，用文本编辑器把下面的代码以 UTF-8 保存为 probe.py。在这个文件夹打开终端。Windows 运行 <code>py -3 probe.py</code>（若前一步只找到 python，就用 <code>python probe.py</code>），macOS 和 Linux 运行 <code>python3 probe.py</code>。</p>
  ${readingCode(probeCode,'probe.py')}
  <p>第一行应为“节目单 v1”，第二行是解释器路径，第三行应指向你刚保存的 probe.py。路径随电脑变化。</p>
  <details><summary>有版本号，却提示 can't open file</summary><p>版本号已经证明解释器能启动。PowerShell 用 <code>Get-Location</code> 和 <code>Get-ChildItem -Name</code>，macOS 或 Linux 用 <code>pwd</code> 和 <code>ls</code>。对照当前目录、文件名和扩展名，特别检查 probe.py.txt。在文件所在目录再运行一次。</p></details>
  <details><summary>同一个包在编辑器能导入，在终端却报 ModuleNotFoundError</summary><p>在两边各运行 probe.py，比较第二行。若路径不同，让编辑器选择项目所用的解释器；用这个解释器执行 <code>python -m pip --version</code> 核实包管理器路径，再按项目依赖安装。路径中有空格时，PowerShell 用调用运算符，例如 <code>&amp; "解释器完整路径" -m pip --version</code>。</p></details></section>`;
}

function editorLesson() {
  return `<section class="block"><h2>选一种编辑器，做两次运行</h2><p>已完成附录 A 就打开刚才的 probe.py。单独进入本课时，请在新建的 python-start 文件夹里把以下代码保存为 probe.py。</p>
  ${readingCode(probeCode,'probe.py')}
  <details open><summary>IDLE · 在编辑窗口写代码，在 Shell 看结果</summary><ol><li>启动 Python 自带的 IDLE。若系统将 IDLE 单独打包，先通过系统软件管理器安装对应的 IDLE。</li><li>在 File → Open 打开 probe.py。看到多行源码的窗口就是编辑窗口。</li><li>选择 Run → Run Module（F5）。Shell 会显示节目名、解释器和文件的路径。</li><li>回编辑窗口把 v1 改为 v2，保存，再按 F5。在 Shell 的本次 RESTART 下方找 v2。</li></ol></details>
  <details><summary>VS Code · 用项目解释器运行文件</summary><ol><li>用 File → Open Folder 打开 python-start，打开 probe.py，并启用 Microsoft 的 Python 扩展。</li><li>在命令面板中执行 Python: Select Interpreter，选择要用于此项目的 Python 3。</li><li>执行 Python: Run Python File in Terminal，读出三行结果。把 v1 改成 v2，保存，再运行。</li><li>若输出仍为旧值，比较第三行与编辑器里当前文件的位置。若包的导入结果不同，比较第二行与附录 A 的解释器路径。</li></ol></details>
  <p>验收时先核对文件路径，再核对改动。两次结果应指向同一份 probe.py，第二次的节目名应是“节目单 v2”。Windows 的 IDLE 可能显示 pythonw.exe；核对它与终端的 python.exe 是否属于同一个安装目录或虚拟环境。</p></section>`;
}

const reproCode = 'from pathlib import Path\n\nprint(Path("shows.txt").read_text(encoding="utf-8").strip())';
const fixedRepro = 'from pathlib import Path\n\nsource = Path(__file__).with_name("shows.txt")\nprint(source.read_text(encoding="utf-8").strip())';
function helpLesson() {
  return `<section class="block"><h2>复现一次“文件明明在旁边”的报错</h2><p>在新建的 help-lab 中建立 src 子目录。把代码保存为 src/read_show.py，再在 src 中以 UTF-8 保存 shows.txt，内容只有“夜读”。让 help-lab 本身只包含 src 文件夹。</p>
  ${readingCode(reproCode,'src/read_show.py')}
  <p>在 help-lab 中打开终端，运行 <code>python src/read_show.py</code>。本课的 python 指附录 A 已确认的 Python 3 命令。记录异常末行，再进入 src，运行 <code>python read_show.py</code>。这次应看到“夜读”。代码和数据相同，找出两次运行中变化的条件。</p>
  <h3>把“帮我看看”写成别人能重跑的提问</h3><p>先自己写，再展开示例。保留命令、目录关系、最小代码、实际和预期结果。把本机用户名改成占位符，示例文件使用上面的虚构节目名。</p>
  <details><summary>对照一份完整提问</summary><p>标题：从上一级运行 read_show.py 时，为什么找不到与脚本放在一起的 shows.txt？</p><p>环境：填入实际系统和 Python 3 小版本。文件是 src/read_show.py（代码见上）和 src/shows.txt（UTF-8，内容为“夜读”）。在 help-lab 下执行 python src/read_show.py，预期显示“夜读”，实际异常末行包含 FileNotFoundError 和 shows.txt。在 src 下执行 python read_show.py 却成功。怎样从两个目录启动都能读到脚本旁的文件？</p></details>
  <details><summary>验证解决办法</summary><p>相对文件名从进程的当前目录开始查找。改用脚本的位置定位同目录的数据文件，然后从刚才两个目录各执行一次，都应输出“夜读”。</p>${readingCode(fixedRepro,'替换 src/read_show.py 后复测')}</details></section>`;
}

const gitStart = 'git init\ngit config --local user.name "Course Learner"\ngit config --local user.email "learner@example.invalid"';
const gitFirst = 'git status --short\ngit add lineup.txt\ngit diff --cached\ngit commit -m "Save first lineup"';
const gitMistake = 'git diff -- lineup.txt\ngit add lineup.txt\ngit diff --cached\ngit commit -m "Try alternate lineup"';
const gitRecover = 'git revert --no-edit HEAD\ngit log -3 --oneline\ngit status --short';
function gitLesson() {
  return `<section class="block"><h2>给一份节目单留下三个版本</h2><p>先运行 <code>git --version</code>。在项目之外新建一个空白文件夹 git-lineup，在其中打开终端。下面的身份信息只写入这份新仓库。各组命令逐行执行。</p>
  ${readingCode(gitStart,'初始化练习仓库')}
  <h3>第一次提交 · 留下正确的节目</h3><p>用编辑器新建 lineup.txt，写入“早间新闻”并保存。执行第一行时，应看到 <code>?? lineup.txt</code>；加入暂存区后，差异里应有新增的节目名。</p>${readingCode(gitFirst,'保存基准版本')}
  <h3>第二次提交 · 观察错误去了哪里</h3><p>把文件内容改成“临时占位”并保存。第一条命令会显示工作区的改动。暂存后，带 --cached 的命令显示即将提交的同一处替换。</p>${readingCode(gitMistake,'提交一次演练用的错误')}
  <h3>第三次提交 · 恢复并核对历史</h3><p>确认刚提交的是这次练习的错误，再执行下面三行。revert 为这次改动创建反向提交。</p>${readingCode(gitRecover,'撤销最近一次提交的内容')}
  <details><summary>怎样证明恢复成功？</summary><p>重新打开 lineup.txt，应看到“早间新闻”。日志应有三条记录，从新到旧依次为撤销、错误改动和首次提交；最后的 status 应无输出。若日志只有一条，先核对终端是否在 git-lineup 中，以及第二次提交是否成功。</p></details></section>`;
}

const staticFind = 'python manage.py findstatic notebook.css --verbosity 2\npython manage.py findstatic missing-appendix.css --verbosity 2';
const staticCollect = 'python manage.py collectstatic --noinput\npython -c "from pathlib import Path; print(Path(\'staticfiles/notebook.css\').is_file())"';
function deploymentLesson() {
  return `<section class="block"><h2>本机先练一次：CSS 在哪一层丢了？</h2><p>下载并解压<a href="python-web.zip" download>事件研习簿</a>到新的练习目录。在含 manage.py 的目录打开终端，按 README 使用虚拟环境安装 requirements.txt。下面的 python 是该环境的解释器。</p>
  ${readingCode(staticFind,'查找真实文件，再故意查一个不存在的名字')}
  <p>第一条应列出 notebook.css 的源路径；第二条应提示没有找到 missing-appendix.css。比较列出的搜索目录。若真实文件也查不到，检查解压目录、拼写和 static/notebook.css。</p>
  ${readingCode(staticCollect,'收集静态资源并检查目的文件')}
  <p>最后一行应输出 True。部署后再打开浏览器的网络面板，刷新登录页，查看实际请求的 CSS URL、状态和响应正文。如果正文是 HTML，即使状态为 200，也要核对代理路由和请求路径。</p></section>
  <section class="block"><h2>按浏览器看到的症状往回查</h2>
  <details><summary>域名打不开，或浏览器提示证书错误</summary><p>先查域名是否解析到部署平台给出的入口。把示例域名换成自己的：Windows PowerShell 运行 <code>Resolve-DnsName study.example.org</code>，macOS 或 Linux 运行 <code>dig +short study.example.org</code>。再分别用 <code>curl.exe -I https://study.example.org/accounts/login/</code>（Windows）或 <code>curl -I https://study.example.org/accounts/login/</code>（macOS、Linux）查看连接是否成功以及 HTTP 状态。再查看浏览器显示的证书域名与有效期，并核对系统时间。验收时用正式域名通过 HTTPS 打开登录页。</p></details>
  <details><summary>域名能打开，页面返回 502</summary><p>先确定后端是否启动。使用本站 Linux 服务配置时运行 <code>systemctl status notebook</code> 和 <code>journalctl -u notebook -n 30</code>；检查工作目录、虚拟环境和启动异常。在主机上核对 <code>ss -ltn</code> 是否列出 127.0.0.1:8000，以及 Caddy 的上游地址是否一致。托管平台可在应用日志和启动命令中核对同样的信息。</p></details>
  <details><summary>页面返回 400，或 HTTPS 重定向反复发生</summary><p>400 先看应用日志。有 DisallowedHost 时，把实际访问的主机名加入 DJANGO_ALLOWED_HOSTS，重新加载进程。重定向循环则对照第 20 章的服务配置，检查 TLS 在哪一层终止，以及后端如何识别原始协议。按同一网址复测，记录最终状态和跳转次数。</p></details>
  <details><summary>页面正常，重启后笔记消失</summary><p>在服务配置中核对 DJANGO_DB_PATH 的绝对路径及其持久卷挂载。确认迁移命令与运行服务读的是同一配置。用一个测试账户保存一条带标记的笔记，重启应用进程后再登录读回。托管平台若在重新部署时替换实例，还需在替换后复验。</p></details>
  <p>本机实验验证静态文件的查找与收集。公网验收另记录实际域名、证书、登录页状态、CSS 响应及重启读回结果。</p></section>`;
}

function appendixPage(id) {
  const lesson = appendixLessons[id];
  return `<article class="article"><p class="course-kicker">${lesson.label} · ${lesson.title}</p><h1>${lesson.task}</h1>
    ${lesson.body()}<section><h2>进一步核对</h2><div class="index-links">${lesson.sources.map(([label, href]) =>
      `<a href="${esc(href)}" target="_blank" rel="noreferrer">${esc(label)}</a>`).join('')}</div></section>
    <div class="actions">${unitLink(lesson.unit)}<a href="#coverage">返回教材目录</a></div></article>`;
}
