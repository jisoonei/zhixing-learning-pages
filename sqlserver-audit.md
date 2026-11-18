# SQL Server 安全性与方言静态审计

日期：2026-11-16。范围：网站现有 16 个 SQL Server 章节的示例、练习、答案、正文中的 SQL 表述，以及 SQL Server 项目包。39 章及原章节链接全部保留。历史 MySQL/SQLite 速查文件仍是明确标识的旧版本，不作为 SQL Server 练习代码。

## 全局结论与前提

- 目标为 SQL Server 2012+ / 兼容级别 110+，SSMS 每个脚本单独完整执行，无未提交事务；权限和对象结构必须符合脚本要求。
- 每章提供完整的可复制参考答案；解释文字中的条件片段不是独立 SQL 语句，请复制代码块。
- 可执行示例/答案未使用 MySQL LIMIT、IFNULL、DATE_FORMAT、AUTO_INCREMENT、ENGINE 或 SQLite PRAGMA、INSERT OR IGNORE、ON CONFLICT。保留正文中对 LIMIT 的反例说明，避免读者混淆。
- `TOP` 或 `OFFSET/FETCH` 配合排序；CTE 前加分号；普通分组列列入 GROUP BY；中文使用 Unicode 字面量；日期使用 DATEFROMPARTS/DATEADD，避免依赖本机日期设置。
- 查询持久表统一使用 dbo 架构，执行前切换固定沙盒并检查标记。临时表实验不改变正式数据，不会占用已有记录 id。
- 新数据库初始化只能由有 CREATE DATABASE 权限的账号完成；已存在但无标记的同名库拒绝操作。数据库标记用于误操作防护，不是防攻击认证机制。

## 逐章审计

| SQL 章 | 主题 | 结果及修正 |
|---|---|---|
| 01 | 关系模型与建表 | 整体使用固定沙盒、专属标记、TRY/CATCH；缺失才建表/插入，已存在数据不重置；补正正文中“省略 text”的错误说明。 |
| 02 | 类型、约束与建模 | INFORMATION_SCHEMA 使用 dbo 和 posts 过滤；明确 CHECK 不替代 NOT NULL；答案提供完整元数据查询。 |
| 03 | 单表查询与 NULL | TOP (5)、ORDER BY、IS NULL 规范正确；练习条件补成完整 SELECT，AND/OR 保持括号语义。 |
| 04 | 条件表达式与空值 | CASE、N 字符串、COALESCE 正确；输出类型一致，不把 NULL 无条件解释为 0。 |
| 05 | 排序、分页与去重 | OFFSET/FETCH 有 ORDER BY id；答案完整；说明 DISTINCT 对整行去重。 |
| 06 | 新增、修改与删除 | UPDATE 演示改为临时副本，成功也回滚；增加 TRY/CATCH，不改变正式数据。无 WHERE 的片段仅为风险判断题。 |
| 07 | 分组与逻辑流水线 | 补 dbo 架构，修正允许函数依赖省略分组列的泛化说法；HAVING 聚合和输出列符合 T-SQL。 |
| 08 | JOIN | 补 dbo 架构；LEFT JOIN 与 COUNT(p.id) 保留无博文事件；ON/WHERE 差别解释正确。 |
| 09 | 子查询与 EXISTS | EXISTS/NOT EXISTS 关联键正确；将省略号答案补充为独立完整 SQL 代码块。 |
| 10 | CTE 与窗口函数 | 补 dbo 架构，增加最终 ORDER BY；ROW_NUMBER 前两条与 RANK 并列第一名分别提供完整代码。 |
| 11 | 集合运算 | UNION ALL 保留重复、UNION 去重；列数和类型一致。 |
| 12 | 日期和时间边界 | DATEFROMPARTS/DATEADD；半开区间答案改用 VALUES + datetime2 实例，避免引用不存在的“时间”字段。 |
| 13 | 视图 | 检查存在；CREATE VIEW 独立动态批次，后续查询也独立编译；不覆盖已有视图定义。 |
| 14 | 索引和执行计划 | sys.indexes 检查名称，重复执行跳过；查询增加稳定排序；主页 EXPLAIN 改为 SSMS 执行计划。 |
| 15 | 事务 | 临时双表插入后回滚，不再依赖 id 9/90 空闲；拒绝外层未提交事务，防止误回滚用户事务。 |
| 16 | 事务异常处理 | TRY/CATCH、XACT_STATE、THROW 检查；只在临时表修改，成功/异常路径均不改变持久记录。 |

## 导入策略

1. CSV 校验：SQL int 范围、非负点赞、事件编号、NVARCHAR UTF-16 容量和首条有效 id 去重。
2. 新连接实际 DB_NAME() 必须等于 Zhixing_Sandbox，数据库扩展属性必须为 sandbox-v1；所有写操作发生在验证之后。
3. 同一事务内获取应用锁，写入 #Incoming，使用 UPDLOCK/HOLDLOCK 查重后只插入缺失 id。
4. 同 ID 不同内容不更新，输出 conflicts.csv；不在 CSV 中的已有行不删除。
5. 任一数据库操作失败回滚；报表 CSV 在提交后输出，导出失败可以安全重试。

## 验证范围

已进行全部 16 章人工静态审阅、SQLFluff 的 tsql 方言解析（39 个不同批次，包含动态 SQL）、可执行 SQL 的方言与保护规则扫描、网页/项目源代码一致性检查、ZIP 内容检查，以及 12 项 Python 行为回归测试（使用数据库替身）。测试覆盖错误库、无标记、重复导入、冲突、缺失行、空输入、异常回滚、整数与 UTF-16 边界。

本环境没有连接真实 SQL Server；行为替身不验证 T-SQL 引擎、ODBC 行为、权限或实际并发。安全拒绝、已有对象被改动、兼容级别不足和权限不足都可能合法报错，不承诺任意环境 100% 零报错。

## 依据

- https://learn.microsoft.com/en-us/sql/relational-databases/databases/create-a-database
- https://learn.microsoft.com/en-us/sql/t-sql/statements/create-view-transact-sql
- https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-getapplock-transact-sql
- https://learn.microsoft.com/en-us/sql/t-sql/queries/hints-transact-sql-table
