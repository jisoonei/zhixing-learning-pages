function webWorkshop(id) {
  if (id === 'web-deploy') return deployWorkshop();
  if (id === 'web-foundations') {
    return `<section class="roster-course"><p>教材第 18 章 · Django 入门</p>
    <h2>从空目录搭一份事件研习簿</h2>
    <p>上一章的程序主动请求数据。这次让浏览器来请求你的程序。目标是打开本地研习簿，看见登录页，并能沿着一个网址找到负责生成页面的代码。</p>
    <h3>先启动空站点</h3><p>安装 Python 3.12，<a href="python-web.zip">下载并解压研习簿工程</a>。另建一个空目录作为工作目录，在其中运行 <code>python -m venv .venv</code>。Windows 命令提示符用 <code>.venv\\Scripts\\activate.bat</code> 激活，macOS 或 Linux 用 <code>source .venv/bin/activate</code>。将下载包中的 requirements.txt 复制到工作目录，然后依次运行：</p>
    ${readingCode('python -m pip install -r requirements.txt\npython -m django startproject notebook .\npython manage.py startapp notes\npython manage.py migrate\npython manage.py runserver','终端 · 最后一条命令会持续运行')}
    <p>末尾的点表示把项目建在当前目录。浏览器打开终端给出的本地地址，应看到 Django 欢迎页。按 Ctrl+C 停止服务。manage.py 所在层是后续命令的工作目录。</p>
    <h3>把空站点接上研习簿</h3><p>从解压目录把 notebook、notes、templates、static 四个目录复制到刚建的工作目录，合并同名目录并替换脚手架文件。只在这次新建的练习目录里操作。现在 settings.py 已登记 notes，并指定研习簿自己的 SQLite 文件。</p>
    ${readingCode('python manage.py migrate\npython manage.py showmigrations notes\npython manage.py runserver','终端 · 接入模型')}
    <p>看到 <code>[X] 0001_initial</code> 表示建表迁移已执行。刷新本地首页，预期从欢迎页变成登录页。若出现缺表错误，先停服务，在当前 manage.py 所在目录重新检查迁移。</p>
    <h3>追踪“我的研究主题”从哪里来</h3><p>登录后的首页请求先由 notebook/urls.py 转给 notes/urls.py。空路径交给 index 视图，它取出当前用户的 Topic，再把 topics 交给 index.html 循环显示。Topic 是研究主题，Entry 是一条笔记；一条笔记用外键指向一个主题，一个主题可以有多条笔记。</p>
    <details><summary>还没有主题时，页面为什么仍能显示？</summary><p>查询返回空集合。模板的 for 循环走 empty 分支，显示“还没有主题”。这是正常的首次使用状态。</p></details>
    <a href="#source-web~notes/views.py">对照视图源码</a> · <a href="#unit-web-users">继续第 19 章：注册并写第一条笔记</a></section>`;
  }
  return `<section class="roster-course"><p>教材第 19 章 · 用户账户</p>
  <h2>用两个账户管理各自的研究笔记</h2>
  <p>沿用上一章的本地服务。若从这里开始，可直接<a href="python-web.zip">下载工程</a>，在解压后的 manage.py 所在目录按 README 安装依赖、执行 migrate 和 runserver。以下操作都在本地研习簿完成。</p>
  <h3>账户 A：创建、修改、重新登录</h3><ol><li>点击“注册”，创建普通用户 reader_a，自己设置练习密码。成功后会自动登录，在“我的研究主题”页点“新建主题”，保存“校园影展”。</li><li>点击“新增笔记”，写下“收到 3 份报名”。返回主题后点击“编辑”，改成“收到 5 份报名”。应只看到一条更新后的笔记。</li><li>点击“退出”，再用 A 登录。打开“校园影展”，检查修改后的文字仍在。</li></ol>
  <p>点开编辑页是 GET，提交表单是 POST。edit_entry 将现有笔记作为 instance 交给表单，所以保存后更新同一条记录。浏览器负责提交正文，视图从登录会话确定操作者。</p>
  <h3>账户 B：检查两份名单</h3><p>用隐私窗口注册 reader_b。先预测它的首页内容，再创建“读书会”和一条笔记。在两个窗口分别刷新：首页应各有自己的主题。A 修改报名人数时，B 的读书会笔记应保持原样。</p>
  <details><summary>两个账户能创建同名主题吗？</summary><p>可以。标题用于展示，每条主题有自己的主键和 owner。列表按 owner 筛选，笔记通过所属主题确定归属。可在两个窗口各建一个“周记”，写不同正文验证。</p></details>
  <p>另开终端，激活同一虚拟环境，在工作目录运行 <code>python manage.py test notes</code>。自动检查使用独立测试数据库，覆盖注册、表单、读写归属和退出。把两次登录、编辑前后的文字、两个首页的主题写成验收记录。</p>
  <a href="#source-web~notes/models.py">对照数据模型</a> · <a href="#unit-web-foundations">回看第 18 章</a> · <a href="#unit-web-deploy">下一章：样式与部署</a></section>`;
}

function deployWorkshop() {
  return `<section class="roster-course"><p>教材第 20 章 · 样式与部署</p>
  <h2>让研习簿重启后还记得上一条笔记</h2>
  <p>沿用第 19 章的账户和笔记。最终要同时看到三个结果：登录页有样式，登录后能保存笔记，重启应用后重新登录还能读到原文。<a href="python-web.zip">下载研习簿工程</a>。</p>
  <h3>给正在使用的按钮加上键盘焦点</h3>
  <p>打开 static/notebook.css，追加下面这条规则。启动开发服务，打开登录页，按 Tab 直到焦点落在按钮上。用鼠标和键盘各操作一次，观察描边何时出现。</p>
  ${readingCode('button:focus-visible {\n  outline: 3px solid #ad561a;\n  outline-offset: 3px;\n}', 'static/notebook.css')}
  <p>templates/base.html 通过 static 标签引用这份样式，登录页和笔记页继承它。浏览器网络面板里应能看到 notebook.css 返回 200。开发时改源文件，发布时 collectstatic 将它收集到 staticfiles，再由 WhiteNoise 提供给浏览器。</p>
  <h3>准备 Python 服务和持久数据库</h3>
  <p>下面采用单台 Linux 主机、systemd 和 Caddy。域名须指向该主机，公网允许 80、443，Waitress 只监听本机。用专用系统账户 notebook，把解压后含 manage.py 的文件放入 /srv/notebook，在其中创建 .venv 并安装 requirements.txt。创建 /var/lib/notebook，所有者设为 notebook，仅该账户可读写。首次部署需要转移旧笔记时，先停旧服务，用 SQLite 备份功能复制数据库到新路径。</p>
  <p>在主机上创建仅管理员可读的 /etc/notebook.env。将下列示例值替换为自己的域名和用 <code>python -c "import secrets; print(secrets.token_urlsafe(64))"</code> 在主机生成的私密值。每次启动使用同一个密钥、同一块持久磁盘。</p>
  ${readingCode('DJANGO_DEBUG=0\nDJANGO_SECRET_KEY=替换为生成的私密值\nDJANGO_ALLOWED_HOSTS=你的真实域名\nDJANGO_DB_PATH=/var/lib/notebook/notebook.sqlite3','/etc/notebook.env')}
  <p>在新主机上先为数据库准备可写目录，然后让迁移和运行服务读取同一份配置。在下面的命令中，notebook 是事先建立的应用账户；项目与依赖已放在 /srv/notebook。</p>
  ${readingCode("sudo install -d -m 700 -o notebook -g notebook /var/lib/notebook\nsudo systemd-run --wait --pipe --collect --uid=notebook --working-directory=/srv/notebook --property=EnvironmentFile=/etc/notebook.env /srv/notebook/.venv/bin/python manage.py migrate\nsudo systemd-run --wait --pipe --collect --working-directory=/srv/notebook --property=EnvironmentFile=/etc/notebook.env /srv/notebook/.venv/bin/python manage.py collectstatic --noinput\nsudo systemd-run --wait --pipe --collect --uid=notebook --working-directory=/srv/notebook --property=EnvironmentFile=/etc/notebook.env /srv/notebook/.venv/bin/python manage.py check --deploy",'Linux · 迁移、收集样式、检查')}
  <p>当前工程的部署检查会提示 HSTS 子域和预加载选项。它们影响域名及子域的 HTTPS 策略，应由域名管理者根据实际站点决定。</p>
  <p>将<a download href="examples/deploy/notebook.service">服务配置</a>安装到 /etc/systemd/system/notebook.service，执行 <code>sudo systemctl daemon-reload</code> 和 <code>sudo systemctl enable --now notebook</code>。该配置面向仅由本机 HTTPS 代理转发请求的后端。下载<a download href="examples/deploy/Caddyfile">代理配置</a>，把域名占位符整段替换为真实域名，将该站点块加入 Caddy 配置，校验后重载。Caddy 接受 HTTPS，再转给本机 8000 端口。</p>
  <h3>验收一次真实操作</h3><ol><li>用 HTTPS 打开域名，按 Tab 检查按钮描边；未登录访问首页应进入登录页。</li><li>用普通账户登录，新建主题“发布验收”，写下“重启前保存”，退出。</li><li>运行 <code>sudo systemctl restart notebook</code>，用同一账户重新登录，读回原文。再用另一个账户确认自己的首页只列出自己的主题。</li></ol>
  <details><summary>页面能打开，但重启后笔记消失，先查什么？</summary><p>核对服务进程实际使用的 DJANGO_DB_PATH 和磁盘挂载。迁移成功只能证明当前数据库有表。若打开的是另一份新库，也会显示空列表。先定位旧库并备份，再恢复正确的路径。</p></details>
  <details><summary>样式仍然是旧版，怎样定位？</summary><p>先查看浏览器实际请求的 CSS 内容，再对照 staticfiles/notebook.css 与 static/notebook.css。收集目录里没有新规则时重新执行 collectstatic 并重启服务；响应中已有规则时检查浏览器缓存和选择器。</p></details>
  <a href="#unit-web-users">回看第 19 章账户练习</a> · <a href="https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/">Django 部署清单</a></section>`;
}
