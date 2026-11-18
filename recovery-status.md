# 知行学习网站：中断恢复与续建记录

检查日期：2026-11-18（北京时间）。本次是第 15 版内容的维护发布，不重写课程、不更换架构。

## 恢复依据与保护范围

- 实际恢复原站源码，基线提交 `d111dc33c252a669958cece9bf965126ad0a0734`；原站第 15 版已发布成功。因此中断没有留下未提交的教学文件，缺少的是最终交付说明和持久续建记录。
- 修改前工作区干净，建立本地快照标签 `recovery-before-20261118`；原保存版本仍可回溯。
- `tests/recovery-baseline.json` 固定记录基线全部 22 个发布资源的 SHA-256。本次这些资源全部保持逐字节一致，包括 `chapters.json`、`curriculum.json`、`sourcebook.json`、四个 ZIP、SQL 初始化、原 HTML、样式与导航脚本。
- 原 `python_ch01.html` 页面及章节结构保留；46 章顺序与所有原章节字段保持原样。SQL 沙盒初始化、应用锁、幂等写入、冲突审计和回滚逻辑未改动。
- 根目录保持原工作目录。源码保存在现有 Sites 版本仓库；这不代表已迁移至用户 GitHub。

## 真实进度清单

| 状态 | 文件 / 模块 | 实际依据与边界 |
| --- | --- | --- |
| 已完成且本轮验证 | `dist/chapters.json` | 46 章数据完整、标题无重复；Python 26 章、SQL 18 章、交叉应用 2 章；全文件哈希未变。并非本轮逐条执行了所有原章节代码。 |
| 已完成且本轮验证 | `dist/curriculum.json` | 23 篇专题、91 段知识拆解；结构校验及 42 项示例/答案检查通过，其中 pytest 示例含 6 个参数案例。需项目环境的 Django 片段通过整体工程验证，终端/生产命令未逐条执行。 |
| 已完成且本轮验证 | `dist/app.js`、`dist/curriculum.js` | JS 语法通过；112 个页面模板成功渲染，检查 1,144 个链接引用的站内路由/本地文件目标；外部资料站点可用性未逐个检测。 |
| 已完成且本轮验证 | `dist/sourcebook.json`、三个 Python ZIP、`projects/` | 35 个在线源码文件与源目录、ZIP 内容一致；三个 Python 包与 SQL 包均通过 ZIP 完整性检查。Web 包额外包含未展示的 `.gitignore`。 |
| 已完成且本轮验证 | `projects/game` | 6 项逻辑测试、无窗口绘制冒烟检查通过。 |
| 已完成且本轮验证 | `projects/analysis` | 7 项测试、离线生成 6 个结果文件通过；包含脏数据拒绝审计。 |
| 已完成且本轮验证 | `projects/web` | 10 项 Django 测试通过；系统检查无问题；迁移检查无新增变化。 |
| 已完成且本轮验证 | `tests/test_sqlserver_safety.py`、`scripts/verify_sql_safety.py` | 12 项安全测试（含 10 子测试）通过；16 章 SQL 规则与 38 个 ZIP 文件/网页同源检查通过。静态规则与测试替身不能替代真实 SQL Server 执行。 |
| 已完成且线上抽查 | 原首页、零基础 print 章、全景地图、项目源码阅读、事务实验、搜索 | 原站第 15 版可访问，抽查正文与导航正常；事务暂存/回滚恢复 5 条已提交和 0 条暂存，搜索“生成器”命中对应原章及专题。其他页面以渲染和链接自动检查为依据。 |
| 已编写但未实测完整运行环境 | SQL 16 章及 `sqlserver-demo.zip` | 本环境没有用户的 SQL Server 2022 Express 实例；不宣称 SSMS 实机零报错。 |
| 已编写但未实测完整运行环境 | 游戏、API、Web 生产说明 | 未在用户 Windows 上人工试玩；未请求真实 GitHub API；未部署 Django 公网后端或验证生产 HTTPS/代理配置。 |
| 已编写但未验证所有设备 | 响应式布局与手机交互 | 保留原 CSS；本轮未进行手机真机、所有视口与大陆网络可达性测试。 |
| 中断相关，已修复 | `tests/verify_curriculum.py` | 原脚本依赖 `/tmp` 快照且在缺失时跳过保护。现改为强制读取仓库内基线，补测解释器路径、模块导入无副作用、键盘脏输入三项。临时虚拟环境已重建。 |
| 中断半成品 | 全部受检源码和资源 | 未发现残缺 JSON、半写入文件、缺失原项目包；没有依据将已发布模块重新开发。 |
| 尚未开始完整验收 | 教材小节级覆盖与教学深度审计 | 当前对照表是第 1–20 章及 A–E 附录的章级主题映射，不能视作每个小节/知识点都达到全书标准。需要逐点建立已有内容、缺口、练习、项目对应证据。 |
| 后续需要具体环境信息 | 真实 SQL Server / 独立 Web 部署 / GitHub 迁移 | 只有进入相应任务时才需实例与目标仓库/主机信息；不阻塞现站继续学习与本次恢复。 |

## 专题文件中的现有内容

基础与表达式：runtime（解释器/终端/排错）、values（引用/数值/精度）、text（字符串/Unicode/格式化）。

容器与流程：sequence（列表/切片/元组）、branch（条件/循环）、mapping（字典/集合）、input（输入/while）。

代码组织与可靠性：functions（参数/返回/作用域）、modules（模块/包/入口）、objects（类/继承）、files（文件/JSON）、errors（异常/测试）。

游戏：game-loop、game-collision、game-state。可视化：plotting、datasets、api。Web：web-foundations、web-users、web-deploy。工程延伸：git、advanced。

这些 ID 的实际内容以 `dist/curriculum.json` 为准。原课程仍在 `dist/chapters.json`，不能只检查其中一个 JSON 就判断全站内容。

## 本次新增的可重复检查

- `tests/verify_site_integrity.py`：固定发布资源不变、章节唯一、项目包完整、在线源码同源。
- `tests/verify_routes.cjs`：实际调用页面渲染函数，核对原章节归属无遗漏/重复、生成的所有站内链接目标存在。
- `.gitignore`：防止验证产生的 Python 缓存混入提交。

在独立 Python 环境安装三个 `projects/*/requirements.txt` 后，从项目根执行：

```sh
python tests/verify_curriculum.py
python tests/verify_site_integrity.py
python -m pytest -q projects/game projects/analysis tests/test_sqlserver_safety.py
python scripts/verify_sql_safety.py
node tests/verify_routes.cjs
node --check dist/app.js
node --check dist/curriculum.js
```

进入 `projects/web` 执行 `python manage.py test` 和 `python manage.py makemigrations --check --dry-run`。游戏无窗口/离线报告的冒烟检查已在本轮独立临时目录完成，不把生成文件加入项目包。

## 下一次继续工作的起点

1. 先读取本记录、当前提交和 `tests/recovery-baseline.json`，运行保护检查；不得从旧聊天推断当前状态。
2. 从教材第 1–4 章对应 `runtime/values/text/sequence` 开始建立“小节 → 当前内容位置 → 示例/练习 → 缺口”的清单。先核对，不盲目重写。
3. 仅对有证据的缺口补写原创解释、最小案例、错误对比和解题步骤；保留原 46 章与已锁定 SQL 包。对新增内容逐例执行，再做整站回归。
4. 继续推进第 5–11 章、游戏、可视化、Web 的同等深度审计。章级主题已具备入口，不等于长期“完整深入全书”目标已经达成。
5. 每个独立批次更新记录并提交版本；如下一批明确要修改受保护资源，先另存新基线并记录批准范围，不能静默绕过校验。
