// 第 12 章与原 game-loop 专题共用地址和掌握记录。
function gameWorkshop() {
  const files = sourcebook.game;
  const source = name => files.find(file => file.path === name).content;
  return `<section class="roster-course" aria-label="教材第 12 章上机课">
    <p class="course-kicker">教材第 12 章 · 信号守卫</p>
    <p class="intro">先让一个窗口留在桌面上，再画出角色，最后让它跟随方向键。准备一台能打开窗口的电脑；在手机上也可以先做下面的单帧实验。</p>
    <div class="actions"><a class="primary" href="python-game.zip?v=27" download>下载本章工程</a><a class="secondary" href="#chapter-20">回看第 11 章测试</a></div>
    <section class="roster-stage"><h2>1　让窗口持续显示</h2>
    <p>解压工程，在能看到 <code>first_window.py</code> 和 <code>requirements.txt</code> 的目录打开终端。下面选自己系统的一组命令。激活环境后，后面的 <code>python</code> 都在这个窗口里运行。</p>
    <details open><summary>Windows · 命令提示符（cmd）</summary>${readingCode('py -3.12 -m venv .venv\n.venv\\Scripts\\activate.bat\npython -m pip install -r requirements.txt\npython first_window.py', '逐行执行')}</details>
    <details><summary>macOS / Linux · 终端</summary>${readingCode('python3.12 -m venv .venv\n. .venv/bin/activate\npython -m pip install -r requirements.txt\npython first_window.py', '逐行执行')}</details>
    <p>屏幕上应出现一个 800 × 600 的深绿色窗口。拖动它，再点关闭，终端应重新出现提示符。一次循环是一帧：取出事件，填满背景，再用 <code>flip()</code> 显示画面。<code>tick(60)</code> 限制帧率上限。</p>
    <details><summary>对照 first_window.py 全文</summary>${readingCode(source('first_window.py'), 'first_window.py')}</details>
    <p>如果提示找不到文件，在终端输入 <code>dir</code>（Windows）或 <code>ls</code> 检查目录；如果找不到 pygame，用同一个 <code>python -m pip show pygame</code> 检查安装位置。</p></section>
    <section class="roster-stage"><h2>2　先画一个静止的角色</h2>
    <p>把 <code>first_window.py</code> 另存为 <code>still_player.py</code>。在 <code>running = True</code> 上一行加入下面一行，缩进与它相同：</p>
    ${readingCode('player = pygame.Rect(380, 540, 40, 24)', '位置与大小')}
    <p>把下面一行放在循环里的 <code>screen.fill(...)</code> 和 <code>pygame.display.flip()</code> 之间，缩进与这两行相同。保存后运行 <code>python still_player.py</code>。</p>
    ${readingCode('pygame.draw.rect(screen, "#80d9bc", player)', '每帧画出角色')}
    <p>浅绿色小矩形应出现在底部中央。左上角坐标为 (380, 540)，宽 40、高 24。把 540 改成 100，再运行一次。先猜它会往哪边移。</p>
    <details><summary>核对位置与绘制顺序</summary><p>它向上移动 440 像素。原点在窗口左上角，y 向下增大。如果只看到背景，先检查是否在绘制角色之后又调用了 fill，把角色涂掉了。</p></details></section>
    <section class="roster-stage"><h2>3　让按键改变下一帧的位置</h2>
    <p>关闭上个窗口，运行 <code>python move_player.py</code>。点击游戏窗口取得焦点。按住右键，角色持续右移；松开就停。再同时按下左右键、长按到左右边缘，各观察一次。Esc 退出。</p>
    <p><code>event.get()</code> 处理关窗、按下 Esc 这样的一次动作。持续移动则每帧读取 <code>get_pressed()</code>。右键的真假值减去左键的真假值，得到 +1、0 或 −1。两键都按时，1 − 1 等于 0。</p>
    <p>下一帧的位置 = 原位置 + 方向 × 速度 × 秒数。速度为每秒 320 像素，<code>tick()</code> 返回毫秒，除以 1000 才能代入。保留浮点坐标 x，绘制前再取整；窗口停顿后，每次最多按 0.05 秒推进。</p>
    <details><summary>对照 move_player.py 全文</summary>${readingCode(source('move_player.py'), 'move_player.py')}</details>
    <fieldset class="notice" id="player-frame"><legend>先猜，再推一帧</legend>
    <label>起始横坐标 <select id="frame-origin"><option value="380">380（中央）</option><option value="755">755（接近右边）</option><option value="5">5（接近左边）</option></select></label>
    <div class="actions"><button type="button" data-direction="1">按住右键</button><button type="button" data-direction="-1">按住左键</button><button type="button" data-direction="0">同时按两键</button></div>
    <p aria-live="polite" id="frame-result">选择起点，再选按键。每次从该起点推进 0.05 秒。</p></fieldset>
    <p>回到 <code>move_player.py</code>，把 <code>speed = 320</code> 改成 160。若从 380 向右走 0.05 秒，你预期走到哪里？</p>
    <details><summary>核对结果</summary><p>走 8 像素，到 388。角色宽 40，最右横坐标是 800 − 40 = 760；即使继续按右键，角色也完整留在画面内。</p></details></section>
    <section class="roster-stage"><h2>4　在完整工程里找到同一次移动</h2>
    ${readingCode('python -m pytest -q test_movement.py\npython game.py', '验证练习，再打开完整游戏')}
    <p>第一条命令的预期结果是 <code>9 passed</code>。测试传入固定秒数，能复查松键、两端边界和小数位移。第二条命令打开完整游戏，先按 Enter 开始，再按方向键。</p>
    <p>打开 <a href="#source-game~game.py">game.py 源码</a>，顺着 <code>Game.run</code>、<code>Game.step</code>、<code>Game.draw</code> 读一遍：方向在哪里算出、x 在哪里更新、谁把新位置显示出来？</p>
    <details><summary>对照完整工程</summary><p>run 读取方向键并传给 step；step 用 Settings.player_speed 更新 player.x，限制范围后写入 player.rect.x；draw 把图像贴到这个矩形并刷新。首次停在开始画面时，step 会提前返回。</p></details>
    <div class="actions"><a class="secondary" href="#source-game~test_movement.py">查看 9 个测试用例</a><a class="secondary" href="#unit-game-collision">接着看目标与碰撞</a></div>
    <p class="muted"><a href="https://www.pygame.org/docs/ref/key.html" target="_blank" rel="noreferrer">Pygame 键盘文档</a> · <a href="https://www.pygame.org/docs/ref/time.html" target="_blank" rel="noreferrer">时钟与毫秒</a></p></section></section>`;
}

function bindPlayerFrame() {
  const panel = document.getElementById('player-frame');
  if (!panel) return;
  const origin = panel.querySelector('#frame-origin');
  const result = panel.querySelector('#frame-result');
  origin.onchange = () => { result.textContent = '从 ' + origin.value + ' 出发。选择按键，查看这一帧的位置。'; };
  for (const button of panel.querySelectorAll('[data-direction]')) {
    button.onclick = () => {
      const x = Number(origin.value);
      const direction = Number(button.dataset.direction);
      const raw = x + direction * 320 * 0.05;
      const actual = Math.max(0, Math.min(760, raw));
      result.textContent = x + ' + (' + direction + ' × 320 × 0.05) = ' + raw + '。' +
        (actual === raw ? '本帧横坐标为 ' + actual + '。' : '到达边缘，横坐标限制为 ' + actual + '。');
    };
  }
}
