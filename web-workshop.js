function webWorkshop(id) {
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
