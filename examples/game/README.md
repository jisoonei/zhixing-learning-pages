# 信号守卫：原创 Pygame 练习

Python 3.12；建议 Windows 在本目录执行 `py -m venv .venv`，随后用 `.venv\Scripts\python.exe -m pip install -r requirements.txt` 安装。
macOS/Linux 对应 `python3 -m venv .venv` 与 `.venv/bin/python -m pip install -r requirements.txt`。
下文 python 均指这个环境中的解释器。

运行 `python game.py`。Enter 或点击按钮开始，左右键移动，空格发射，Q/Esc 退出。`python game.py --fullscreen` 可全屏。
执行 `python -m pytest -q` 运行测试。程序不需要外部图片或网络，使用几何素材。

依次阅读：Settings → Box → reset/spawn_wave → fire → step → draw → run。
每帧先处理事件，再更新状态，最后绘制；浮点位置与 Rect 绘制位置分开。
最高分只保存到用户目录的 `.zhixing_signal_guard_score.json`，损坏内容留一份 `.invalid.json`。

可尝试：改成两行目标；调整速度；给玩家绘制自己的图像（load 后 convert_alpha，再保留 rect）；把逻辑按 settings/sprites/game 拆成模块。
验收：不会越界；最多四颗子弹；命中计分一次；出界子弹删除；三次失败后结束；重开重置难度但保留最高分。

已执行无窗口状态测试和绘制冒烟检查；没有在你的 Windows 电脑上人工试玩。
