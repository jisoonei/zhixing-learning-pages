function targetWorkshop() {
  const file = sourcebook.game.find(item => item.path === 'target_lab.py');
  return `<section class="roster-course" aria-label="教材第 13 章上机课">
  <p class="course-kicker">教材第 13 章 · 目标编组与碰撞</p>
  <p class="intro">沿用上一章的弹体，把一个目标排成一队，再解释一次命中怎样改变对象数量。先预测，再用原游戏的固定输入复核。</p>
  <div class="actions"><a class="secondary" href="#unit-game-loop">回看第 12 章弹体</a><a class="primary" href="python-game.zip?v=29" download>下载本章工程</a></div>
  <section class="roster-stage"><h2>1　两层循环怎样排出 24 个目标</h2>
  <p>在解压目录运行 <code>python game.py</code>，按 Enter 开始。先数一数，屏幕上应有 3 行，每行 8 个目标。打开 <a href="#source-game~game.py">game.py</a> 的 <code>spawn_wave()</code>，外层 row 取 0、1、2；每次外层循环都让 column 重新从 0 取到 7。</p>
  ${readingCode('x = 70 + column * 70\ny = 65 + row * 45', '每个目标左上角的位置')}
  <p>第一个目标在 (70, 65)，最后一个在 (560, 155)。目标宽 32、高 24，所以横向空隙是 70 − 32 = 38，纵向空隙是 45 − 24 = 21。把行数改成 2，预期应有 16 个；还原后再做下一步。</p>
  <details><summary>为什么新波次先调用 empty？</summary><p>先移除上一波残留，再生成固定数量的目标。连续调用 spawn_wave 两次，目标数仍应是 24。它也把方向恢复为向右。</p></details></section>
  <section class="roster-stage"><h2>2　一个目标到边缘，整队一起折返</h2>
  <p>在 <code>step()</code> 里，<code>any(...)</code> 检查是否至少有一个目标的下一步会越过左右边界。初始速度 55 像素/秒，0.05 秒走 2.75 像素。若某个目标的 x 是 767、宽 32，向右下一步的右边就是 801.75，超出窗口宽 800。</p>
  <p>这时 direction 乘 −1，整组的 y 都增加 22，再按新方向移动。所有目标共享方向，才能保持阵列。只反转最靠边的一个，会把队伍拆开。</p></section>
  <section class="roster-stage"><h2>3　贴边和命中相差一个像素</h2>
  <p>矩形碰撞要求有面积重叠。目标左边在 100，弹体宽 6。弹体 x 为 94 时，右边是 100，恰好贴边；x 为 95 时，右边是 101，已重叠一个像素。下面固定 y 为 100，先猜两种结果。</p>
  <fieldset class="notice" id="target-demo"><legend>固定两个目标，检查一次碰撞</legend>
  <label>弹体横坐标 <select id="target-x"><option value="94">94（右边贴住目标）</option><option value="95">95（重叠一像素）</option></select></label>
  <div class="actions"><button type="button" id="target-check">检查碰撞</button><button type="button" id="target-reset">重置两个目标</button></div>
  <p aria-live="polite" id="target-result">目标 2，弹体 1，分数 0。选择位置后检查。</p></fieldset>
  <p>原工程调用 <code>groupcollide(self.bullets, self.enemies, True, True)</code>，后两个 True 表示移除发生碰撞的弹体和目标。返回结果按弹体记录它命中的目标。工程再把目标放进集合，按独立目标计分。</p>
  <details><summary>再次检查为什么不能重复加分？</summary><p>第一颗弹体和被命中的目标都已移出各自组。下一帧遍历现有对象，已经找不到这一对。仍有其他目标时，游戏继续当前波次。</p></details></section>
  <section class="roster-stage"><h2>4　把预测交给真实游戏验证</h2>
  ${readingCode('python target_lab.py', '在解压后的 python-game 目录运行')}
  <p>脚本调用同一个 Game 类，固定时间和位置。0 秒让所有对象暂时停住，便于单独观察碰撞判断。结果应依次如下。</p>
  ${readingCode('阵列 24 (70, 65) (560, 155)\n折返 -1 87.0 177.0\n贴边 2 0\n重叠一像素 1 0 10\n再检查一次 10\n最后一个命中 2 24 20\n接触角色 2\n生命耗尽 0 over', '预期输出')}
  <p>“重叠一像素”一行依次是剩余目标数、弹体数、累计分数。“最后一个命中”一行依次是关卡、重新生成的目标数、累计分数。清空当前目标后，程序立即生成下一波，所以检查时看到的已经是 24 个新目标。</p>
  <p>目标触碰角色或底边到达 600，会扣一条生命并清空弹体。还有生命时，角色归位并生成新阵列；第三次失误后进入 over。计分展示和重新开始的完整练习接到第 14 章。</p>
  <details><summary>阅读本步验证程序</summary>${readingCode(file.content, 'target_lab.py')}</details>
  <p><b>改一处再验证</b>　在工程副本里把 spawn_wave 的 <code>range(3)</code> 改成 <code>range(2)</code>。脚本会在检查 24 个目标的断言处停止。先说明为什么应为 16，再改回 3 重跑。</p>
  <div class="actions"><a class="secondary" href="#source-game~target_lab.py">逐文件阅读实验</a><a class="secondary" href="#unit-game-state">第 14 章 · 计分与游戏状态</a></div>
  <p><a href="https://www.pygame.org/docs/ref/sprite.html" target="_blank" rel="noreferrer">Pygame 精灵组与碰撞文档</a></p></section></section>`;
}

function bindTargetDemo() {
  const panel = document.getElementById('target-demo');
  if (!panel) return;
  const result = panel.querySelector('#target-result');
  const position = panel.querySelector('#target-x');
  let hit = false;
  position.onchange = () => {
    hit = false;
    result.textContent = '已按所选位置重新准备。目标 2，弹体 1，分数 0。';
  };
  panel.querySelector('#target-reset').onclick = () => {
    hit = false;
    result.textContent = '已重置。目标 2，弹体 1，分数 0。';
  };
  panel.querySelector('#target-check').onclick = () => {
    if (hit) {
      result.textContent = '弹体已移除。目标 1，弹体 0，分数仍为 10。';
    } else if (Number(position.value) + 6 > 100) {
      hit = true;
      result.textContent = '重叠一像素。目标 1，弹体 0，分数 10。';
    } else {
      result.textContent = '仅贴边。目标 2，弹体 1，分数 0。';
    }
  };
}
