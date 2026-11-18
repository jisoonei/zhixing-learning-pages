# 事件研习簿：原创 Django 入门工程

Python 3.12，Django 5.2 系列。先创建独立虚拟环境，后续 python 均指该环境。
1. `python -m pip install -r requirements.txt`
2. `python manage.py migrate`
3. `python manage.py createsuperuser`（管理后台可选）
4. `python manage.py runserver`
5. 浏览器打开终端提供的本地地址，注册普通用户，新建主题、添加和修改笔记。
6. `python manage.py test`，核对隔离、表单和授权测试。

该独立框架练习使用本目录 notebook.sqlite3，不操作 SQL Server 项目和 Zhixing_Sandbox。
SQL Server 仍是双册数据工程主线。不要把 Django migrate 指向已有业务数据库尝试。
源文件顺序：models → migrations → forms → urls → views → templates → tests。
修改模型后 `python manage.py makemigrations notes`，检查生成的差异，再运行 migrate。
在管理后台可以管理 Topic 和 Entry；普通用户用网站界面，权限由服务端 owner 过滤。

## 部署演练（这里没有替你创建服务器）
静态学习网站不执行 Django 后端。部署需要支持 Python 进程的主机、持久磁盘、域名及 HTTPS 入口。
复制源码、安装依赖，把数据库存储放到持久磁盘。小型单实例教学应用可使用该 SQLite；多实例写入先设计生产数据库迁移。
设置环境变量 DJANGO_DEBUG=0、DJANGO_SECRET_KEY（用 secrets.token_urlsafe(64) 生成私密值）、DJANGO_ALLOWED_HOSTS（真实域名，逗号分隔）、DJANGO_DB_PATH（持久磁盘绝对路径）。
执行 migrate、collectstatic --noinput、check --deploy。使用 `waitress-serve --listen=127.0.0.1:8000 notebook.wsgi:application` 启动应用。
反向代理负责 HTTPS，应用端口只供可信代理访问。只有代理剥离外部 X-Forwarded-Proto 再设置可信值时，才设置 DJANGO_TRUST_PROXY=1。
否则可能出现重定向循环或错误信任客户端头。上线前检查登录、POST、静态文件、404、跨用户拒绝、数据重启后仍存在。
内置 WhiteNoise 提供 collectstatic 收集后的静态资源；生产不使用 runserver。
HSTS 子域和 preload 默认关闭；只有理解域名范围并确认全站 HTTPS 才自行扩大。
定期备份数据库和私密配置，更新失败可回滚代码；回滚数据库必须考虑迁移兼容性。

本包通过本地 Django 测试；未部署独立公网后端，也未验证真实代理和证书。
