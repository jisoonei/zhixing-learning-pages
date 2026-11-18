-- MySQL 8.4；在新建的空数据库中运行。CHECK 在 8.0.16 起执行。
CREATE TABLE events (id INT PRIMARY KEY, title VARCHAR(100) NOT NULL) ENGINE=InnoDB;
CREATE TABLE posts (id INT PRIMARY KEY, event_id INT NOT NULL, likes INT NOT NULL CHECK (likes >= 0), text TEXT NOT NULL, FOREIGN KEY (event_id) REFERENCES events(id)) ENGINE=InnoDB;
INSERT INTO events (id,title) VALUES (1,'校园音乐节'),(2,'科技展'),(3,'读书会');
INSERT INTO posts (id,event_id,likes,text) VALUES (1,1,12,'音乐节开幕'),(2,1,3,'校园舞台'),(3,1,30,'合唱现场'),(4,2,8,'展览开门'),(5,2,12,'机器人演示');
