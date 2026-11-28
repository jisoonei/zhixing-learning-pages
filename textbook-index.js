// 教材章名按所附中文版第三版目录排列。链接描述本站对应单元的实际内容。
const textbookIndex = [
  {
    label: '第 1 章', title: '起步', status: '已有对应内容',
    summary: '从显示第一行文字开始，再学习保存 .py 文件、选择解释器和读懂报错。',
    links: [{label: '动手运行第一行 print', href: '#chapter-39'}, {label: '在电脑上运行', href: '#unit-runtime'}]
  },
  {
    label: '第 2 章', title: '变量和简单的数据类型', status: '已有对应内容',
    summary: '把名字和一个值关联起来，再试文字、整数、小数和运算。',
    links: [{label: '动手修改变量与节目名', href: '#chapter-40'}, {label: '数值与注释', href: '#unit-values'}, {label: '字符串', href: '#unit-text'}]
  },
  {
    label: '第 3 章', title: '列表简介', status: '已有对应内容',
    summary: '按位置找到一项，观察添加、修改、删除以及重新排序后各项的位置。',
    links: [{label: '读懂一份节目名单', href: '#chapter-41'}, {label: '列表、位置与修改', href: '#unit-sequence'}]
  },
  {
    label: '第 4 章', title: '操作列表', status: '已有对应内容',
    summary: '逐项读出一个列表，取出其中一段，再用 range 生成连续的数。',
    links: [{label: '第一次使用 for', href: '#chapter-41'}, {label: '切片与元组', href: '#unit-sequence'}, {label: '范围与缩进', href: '#unit-branch'}]
  },
  {
    label: '第 5 章', title: 'if 语句', status: '已有对应内容',
    summary: '预测门槛刚好相等时走哪条分支，再用两个名单判断一条报名记录。',
    links: [{label: '条件、列表与分支', href: '#unit-branch'}]
  },
  {
    label: '第 6 章', title: '字典', status: '已有对应内容',
    summary: '用键查栏目资料，区分零值和字段缺失，再看如何更新嵌套名单。',
    links: [{label: '字典的查找与遍历', href: '#unit-mapping'}]
  },
  {
    label: '第 7 章', title: '用户输入和 while 循环', status: '已有对应内容',
    summary: '接收键盘输入，跟踪一轮循环如何改变待办清单，以及什么时候跳出。',
    links: [{label: '输入与循环', href: '#unit-input'}]
  },
  {
    label: '第 8 章', title: '函数', status: '已有对应内容',
    summary: '跟着一次调用看实参如何进入函数、返回值如何回到调用处，再从另一个文件导入函数。',
    links: [{label: '参数与返回值', href: '#unit-functions'}, {label: '函数与模块', href: '#unit-modules'}]
  },
  {
    label: '第 9 章', title: '类', status: '已有对应内容',
    summary: '创建两台独立的计数器，观察调用方法时哪台的数字变化，再读继承与组合。',
    links: [{label: '计数器与 self', href: '#unit-objects'}, {label: '模块与标准库', href: '#unit-modules'}]
  },
  {
    label: '第 10 章', title: '文件和异常', status: '已补连续实验',
    summary: '写入报名名单，逐行读取，处理空文件和缺失文件，再用 JSON 把报名结果留给下次运行。',
    links: [{label: '开始名单实验', href: '#chapter-5'}, {label: '10.1 读取', href: '#chapter-5/read'}, {label: '10.2 写入', href: '#chapter-5/write'}, {label: '10.3 异常', href: '#chapter-5/exceptions'}, {label: '10.4 JSON', href: '#chapter-5/json'}, {label: '文件专题', href: '#unit-files'}]
  },
  {
    label: '第 11 章', title: '测试代码', status: '已补连续实验',
    summary: '沿用报名名单，运行第一个 pytest 测试，读懂一次失败，再用边界输入和夹具测试函数与类。',
    links: [{label: '开始名单测试', href: '#chapter-20'}, {label: '11.1 安装', href: '#chapter-20/install'}, {label: '11.2 函数测试', href: '#chapter-20/function'}, {label: '11.3 类与夹具', href: '#chapter-20/class'}, {label: '测试专题', href: '#unit-errors'}]
  },
  {
    label: '第 12 章', title: '武装飞船', status: '已补窗口、移动与弹体实验',
    summary: '从空窗口画出角色，使用方向键持续移动，验证松键和边界。在课堂内继续练习弹体的生成、移动、出界清理和数量上限。',
    links: [{label: '从窗口到第一个可控角色', href: '#unit-game-loop'}, {label: '最小移动程序', href: '#source-game~move_player.py'}, {label: '弹体验证程序', href: '#source-game~bullet_lab.py'}]
  },
  {
    label: '第 13 章', title: '外星人', status: '已补阵列与碰撞实验',
    summary: '沿原游戏验证 3 × 8 阵列、整队折返、贴边与重叠、命中移除及新波次。',
    links: [{label: '编组、碰撞与波次', href: '#unit-game-collision'}]
  },
  {
    label: '第 14 章', title: '记分', status: '已补计分与重开实验',
    summary: '在游戏中把开始、运行、结束区分开，学习计分和重开时怎样恢复状态。',
    links: [{label: '按钮、计分与重开', href: '#unit-game-state'}]
  },
  {
    label: '第 15 章', title: '生成数据', status: '已补上机实验',
    summary: '观察随机游走怎样累加每一步，以及两颗骰子相加为什么更常出现中间的和。',
    links: [{label: '绘图与随机模拟', href: '#unit-plotting'}]
  },
  {
    label: '第 16 章', title: '下载数据', status: '已补上机实验',
    summary: '从 CSV 表头找到日期和测量值，再读 GeoJSON 里的地理位置。',
    links: [{label: '读取 CSV 与 GeoJSON', href: '#unit-datasets'}]
  },
  {
    label: '第 17 章', title: '使用 API', status: '已补请求、离线与绘图实验',
    summary: '读取一次请求的结果，了解记录分多页返回、请求超时或受限时会发生什么。',
    links: [{label: 'API 与结果验证', href: '#unit-api'}]
  },
  {
    label: '第 18 章', title: 'Django 入门', status: '已补研习簿上机课',
    summary: '顺着一次网页请求，找到 Django 怎样读取模型中的数据并生成页面。',
    links: [{label: '模型、请求与页面', href: '#unit-web-foundations'}]
  },
  {
    label: '第 19 章', title: '用户账户', status: '已补研习簿上机课',
    summary: '学习提交表单和登录，并检查登录后能否编辑某一条记录。',
    links: [{label: '表单、账户与所有权', href: '#unit-web-users'}]
  },
  {
    label: '第 20 章', title: '设置应用程序的样式并部署', status: '已补部署上机课',
    summary: '学习静态样式怎样到达浏览器，以及服务上线时要准备哪些配置和检查。',
    links: [{label: '样式、部署与排障', href: '#unit-web-deploy'}]
  },
  {
    label: '附录 A', title: '安装及故障排除', status: '部分主题',
    summary: '按系统检查 Python 命令、实际运行版本和文件路径。',
    links: [{label: '安装与检查解释器', href: '#unit-runtime'}]
  },
  {
    label: '附录 B', title: '文本编辑器和 IDE', status: '部分主题',
    summary: '已有 VS Code 选择解释器和运行脚本的步骤；其他编辑器的逐项操作待补。',
    links: [{label: '用 VS Code 运行文件', href: '#unit-runtime'}]
  },
  {
    label: '附录 C', title: '寻求帮助', status: '部分主题',
    summary: '把启动命令、最小输入、预期结果和报错整理成别人能够复现的问题。',
    links: [{label: '写一份可复现的求助说明', href: '#unit-git'}]
  },
  {
    label: '附录 D', title: '使用 Git 进行版本控制', status: '部分主题',
    summary: '观察文件从修改到提交的状态，查看历史和差异，理解怎样保留可恢复的版本。',
    links: [{label: 'Git 提交与恢复', href: '#unit-git'}]
  },
  {
    label: '附录 E', title: '部署故障排除', status: '部分主题',
    summary: '已有 Web 服务的配置、静态资源和上线检查；各系统的排错步骤待补。',
    links: [{label: '排查部署问题', href: '#unit-web-deploy'}]
  }
];
