// 第 12 章与原 game-loop 专题共用地址和掌握记录。
function gameWorkshop() {
  const files = sourcebook.game;
  const source = name => files.find(file => file.path === name).content;
  return `<section class="roster-course" aria-label="教材第 12 章上机课">
    <p class="course-kicker">教材第 12 章 · 信号守卫</p>
    <p class="intro">先让一个窗口留在桌面上，再画出角色，最后让它跟随方向键。准备一台能打开窗口的电脑；在手机上也可以先做下面的单帧实验。</p>
    <div class="actions"><a class="primary" href="python-game.zip?v=28" download>下载本章工程</a><button type="button" data-jump="bullet-workshop">跳到弹体管理</button><a class="secondary" href="#chapter-20">回看第 11 章测试</a></div>
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
    <div class="actions"><a class="secondary" href="#source-game~test_movement.py">查看 9 个测试用例</a><button type="button" data-jump="bullet-workshop">继续练弹体管理</button></div>
    <p class="muted"><a href="https://www.pygame.org/docs/ref/key.html" target="_blank" rel="noreferrer">Pygame 键盘文档</a> · <a href="https://www.pygame.org/docs/ref/time.html" target="_blank" rel="noreferrer">时钟与毫秒</a></p></section>${bulletWorkshop()}</section>`;
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

function bulletWorkshop() {
  return `<section class="roster-stage" id="bullet-workshop"><p class="course-kicker">教材第 12 章 · 弹体管理</p>
    <h2>5　松开空格后，弹体为什么还在移动？</h2>
    <p>运行 <code>python game.py</code>，按 Enter 开始，轻按一下空格再松开。浅色短条会从角色中央向上移动。接下来追踪这颗短条的整个生命周期。</p>
    <h3>生成一次，之后每帧更新</h3>
    <p>在 <a href="#source-game~game.py">game.py</a> 的 <code>Game.run</code> 里，空格的 <code>KEYDOWN</code> 事件调用 <code>fire()</code>。角色左边在 380，宽 40，中心是 400。弹体宽 6，所以它的左边是 400 − 3 = 397，顶边起于角色的 540。</p>
    <p><code>self.bullets</code> 是保存当前弹体的精灵组。<code>add()</code> 把新对象放进去。以后即使没有新的键盘事件，<code>step()</code> 仍会更新组里的每一颗，<code>draw()</code> 再把它们画出来。</p>
    <h3>算一帧，再判断是否离开画面</h3>
    <p>屏幕 y 轴向下增大，向上移动要减。按工程里的每秒 440 像素，0.05 秒移动 22 像素，因此第一帧从 y = 540 到 518。程序把小数存在 <code>bullet.y</code>，绘制时把取整结果写进 <code>bullet.rect.y</code>。</p>
    <p>弹体高 14 像素。如果顶边是 −1，底下仍有一部分可见。原工程的清理条件是 <code>bullet.rect.bottom &lt; 0</code>：底边恰好等于 0 时已经看不见，但仍占一个名额；再上移 1 像素才调用 <code>kill()</code> 移出组。遍历 <code>list(self.bullets)</code> 得到这一帧的清单，清理一颗后仍能处理下一颗。</p>
    <fieldset class="notice" id="bullet-demo"><legend>试一试：四颗满员后，第五次按键会怎样？</legend>
      <p>只推演弹体和屏幕上边界。先连续点五次发射，再推进一帧。也可以快进，观察何时空出名额。</p>
      <div class="actions"><button type="button" data-bullet="fire">发射一次</button><button type="button" data-bullet="step">推进一帧</button><button type="button" data-bullet="exit">快进到有弹体出界</button><button type="button" data-bullet="reset">重新开始</button></div>
      <p aria-live="polite" data-bullet-result>组内 0 / 4。每帧 0.05 秒。</p></fieldset>
    <h3>用真实 Python 核对名额如何腾出</h3>
    ${readingCode('python bullet_lab.py', '在解压后的 python-game 目录运行')}
    <p>实验调用原游戏的 <code>fire()</code> 与 <code>step()</code>。它先连发五次，再只把第一颗挪到边界，方便区分“恰好贴边”与“已经越过”。运行前先猜最后三行。</p>
    <details><summary>核对终端输出与原因</summary>
    ${readingCode('连续发射 5 次，弹体数 4\n起点 (397, 540)\n一帧后 (397, 518)\n底边等于 0 4\n底边小于 0 3\n再次发射 4', '预期输出')}
    <p>上限 4 计算的是当前组内对象数。第五次请求没有生成对象，也不会排队；移除一颗后，需要再按一次空格才能补上。</p></details>
    <p><b>改一处再验证：</b>在工程副本中把 <code>Game.fire</code> 的上限从 4 改成 2。运行弹体实验，第一行应打印 2，随后旧断言会指出与原要求的差异。把上限改回 4 再运行，程序应打印到“再次发射 4”。</p>
    <div class="actions"><a class="secondary" href="#source-game~bullet_lab.py">阅读弹体实验源码</a><a class="secondary" href="https://www.pygame.org/docs/ref/sprite.html" target="_blank" rel="noreferrer">Pygame 精灵组文档</a></div></section>`;
}

function bindBulletDemo() {
  const panel = document.getElementById('bullet-demo');
  if (!panel) return;
  let positions = [];
  function advance() {
    positions = positions.map(y => y - 22).filter(y => y + 14 >= 0);
  }
  for (const button of panel.querySelectorAll('[data-bullet]')) {
    button.onclick = () => {
      const before = positions.length;
      let message = '';
      switch (button.dataset.bullet) {
        case 'fire':
          if (before < 4) { positions.push(540); message = '已生成一颗。'; }
          else message = '已满，本次未生成。';
          break;
        case 'step':
          advance();
          message = '已推进一帧。';
          break;
        case 'exit':
          if (before === 0) { message = '请先发射。'; break; }
          let frames = 0;
          while (positions.length === before) { advance(); frames++; }
          message = '已推进 ' + frames + ' 帧，移出 ' + (before - positions.length) + ' 颗。';
          break;
        case 'reset':
          positions = [];
          message = '已重置。';
          break;
      }
      panel.querySelector('[data-bullet-result]').textContent = message + '组内 ' + positions.length +
        ' / 4。' + (positions.length ? '顶边 y：' + positions.join('、') + '。' : '');
    };
  }
}
