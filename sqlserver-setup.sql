-- SQL Server 2012+ / SSMS。整体执行，不要仅选中后半段。
-- 需要 CREATE DATABASE 权限（首次）及沙盒对象权限。无 GO，创建失败不会继续执行后续批次。
IF @@TRANCOUNT <> 0
    THROW 51003, N'请在无未提交事务的新查询窗口运行初始化。', 1;
SET IMPLICIT_TRANSACTIONS OFF;
BEGIN TRY
IF DB_ID(N'Zhixing_Sandbox') IS NULL
BEGIN
    EXEC(N'CREATE DATABASE [Zhixing_Sandbox];');
    -- 只有本脚本新建的数据库才能自动写入标记。
    EXEC(N'USE [Zhixing_Sandbox];
        EXEC sys.sp_addextendedproperty @name=N''Zhixing_Workbook'', @value=N''sandbox-v1'';');
END;
-- USE 与全部对象操作处于同一动态批次；权限/切库失败时不会回落到 master 或原业务库。
EXEC sys.sp_executesql N'USE [Zhixing_Sandbox];
IF DB_NAME() <> N''Zhixing_Sandbox''
    THROW 51000, N''拒绝操作非沙盒数据库。'', 1;
IF NOT EXISTS (
    SELECT 1 FROM sys.extended_properties
    WHERE class = 0 AND name = N''Zhixing_Workbook''
      AND CONVERT(nvarchar(128), value) = N''sandbox-v1''
)
    THROW 51001, N''同名数据库不属于本手册；停止，不修改现有对象。'', 1;
SET XACT_ABORT ON;
BEGIN TRY
    BEGIN TRANSACTION;
    DECLARE @lock_result int;
    EXEC @lock_result = sys.sp_getapplock
        @Resource = N''Zhixing_Workbook_Write'', @LockMode = N''Exclusive'',
        @LockOwner = N''Transaction'', @LockTimeout = 10000;
    IF @lock_result < 0 THROW 51002, N''无法取得沙盒写入锁，请稍后重试。'', 1;
    IF OBJECT_ID(N''dbo.events'', N''U'') IS NULL
        CREATE TABLE dbo.events (
            id int NOT NULL PRIMARY KEY CHECK (id > 0),
            title nvarchar(100) NOT NULL
        );
    IF OBJECT_ID(N''dbo.posts'', N''U'') IS NULL
        CREATE TABLE dbo.posts (
            id int NOT NULL PRIMARY KEY CHECK (id > 0),
            event_id int NOT NULL,
            likes int NOT NULL CHECK (likes >= 0),
            [text] nvarchar(500) NOT NULL,
            FOREIGN KEY (event_id) REFERENCES dbo.events(id)
        );
    -- 只补充缺失的样本行：重复执行不会清空、修改或覆盖已有记录。
    INSERT INTO dbo.events (id, title)
    SELECT s.id, s.title
    FROM (VALUES (1, N''校园音乐节''), (2, N''科技展''), (3, N''读书会'')) AS s(id, title)
    WHERE NOT EXISTS (SELECT 1 FROM dbo.events WITH (UPDLOCK, HOLDLOCK) WHERE id = s.id);
    INSERT INTO dbo.posts (id, event_id, likes, [text])
    SELECT s.id, s.event_id, s.likes, s.[text]
    FROM (VALUES (1, 1, 12, N''音乐节开幕''), (2, 1, 3, N''校园舞台''),
                 (3, 1, 30, N''合唱现场''), (4, 2, 8, N''展览开门''),
                 (5, 2, 12, N''机器人演示'')) AS s(id, event_id, likes, [text])
    WHERE NOT EXISTS (SELECT 1 FROM dbo.posts WITH (UPDLOCK, HOLDLOCK) WHERE id = s.id);
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
SELECT DB_NAME() AS database_name;
SELECT e.id, e.title, COUNT(p.id) AS post_count,
       COALESCE(SUM(CONVERT(bigint, p.likes)), 0) AS total_likes
FROM dbo.events AS e LEFT JOIN dbo.posts AS p ON p.event_id = e.id
GROUP BY e.id, e.title ORDER BY e.id;
';

END TRY
BEGIN CATCH
    THROW;
END CATCH;
