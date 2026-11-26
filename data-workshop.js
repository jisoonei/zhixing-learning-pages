function dataWorkshop(id) {
  const project = '<a href="python-analysis.zip">下载校园事件数据图册工程</a>';
  if (id === 'plotting') {
    const code = 'from report import walk, dice\npoints = walk(seed=7, count=5)\nprint(points)\ncounts = dice(seed=7, count=12)\nprint(sum(counts.values()), counts[3])';
    return `<section class="roster-course"><p>教材第 15 章 · 生成数据</p><h2>从五个位置读懂一张随机游走图</h2>
    <p>${project}，解压后在 report.py 所在目录运行 <code>python -m pip install -r requirements.txt</code>。在同一目录新建 explore.py，复制以下程序并运行 <code>python explore.py</code>。</p>
    <pre class="lined"><code>${codeMarkup(code)}</code></pre>
    <details><summary>预测：五个位置，需要移动几次？</summary><p>四次。第一个位置是起点。输出为 [(0, 0), (0, -1), (0, 0), (-1, -1), (0, -2)]。把每一步的位移加在上一个坐标上，就得到下一个点。第三个位置回到原点，散点可以重叠。</p></details>
    <h3>比较两颗骰子的和</h3><p>一颗有 6 面，另一颗有 8 面。和为 2 只有 (1,1)；和为 3 有 (1,2)、(2,1)。counts 的键是点数和，值是出现次数。第二行输出 12 4，表示总共投了 12 次，其中 4 次的和是 3。小样本频数会波动。</p>
    <p>把种子改成 8 后跑两遍，再把 count 改为 1000。检查同一组参数的结果是否一致、各柱频数之和是否等于投掷次数。固定种子便于同学复现你的结果。</p>
    <h3>生成自己的两张图</h3><p>运行 <code>python report.py --output output-01</code>，打开 walk.png，观察颜色怎样记录 500 个位置的先后。再打开 dice.html，把指针移到柱子上，分别读出横轴的点数和与纵轴的频数。重跑请换新目录名。</p>
    <a href="#source-analysis~report.py">查看 walk、dice 和绘图代码</a> · <a href="#unit-datasets">继续第 16 章：读取数据文件</a></section>`;
  }
  if (id !== 'datasets') return '';
  return `<section class="roster-course"><p>教材第 16 章 · 下载数据</p><h2>先核对拒绝了哪些行，再解释图上的点</h2>
  <p>沿用第 15 章的工程和 output-01。单独从本章开始时，先${project}，按 README 安装依赖并生成报告。</p>
  <h3>在 daily.csv 中追踪一行</h3><p>表头是 date、low、high。一行代表一天，同一行的日期、低值和高值必须一起保留或一起拒绝。先找出 low 为 0 的行，再找出 low 留空的行：哪一行能画进 daily.png？</p>
  <details><summary>对照 audit.json</summary><p>1 月 5 日的 0 是有效测量。文件第 5 行日期无效，第 6 行缺少 low，两行均被拒绝。有效记录共 4 条。图中跨过 1 月 4 日的连线不能证明当天有观测。把工程副本第 6 行的空格位填为 2，换新目录重跑，预期有效 5 条、拒绝 1 条。</p></details>
  <h3>读真实事件的 CSV 和 GeoJSON</h3><p>下载下面三个文件到同一新目录。两个数据文件摘录自 USGS 的两条地震记录，日期使用 UTC，坐标取三位小数。CSV 提供震级，GeoJSON 的每个 Feature 提供一个事件的位置。</p>
  <p><a download href="examples/earthquakes/events.csv">events.csv</a> · <a download href="examples/earthquakes/events.geojson">events.geojson</a> · <a download href="examples/earthquakes/plot_events.py">plot_events.py</a></p>
  <p>在刚才安装依赖的环境中运行 <code>python plot_events.py</code>，打开 epicentres.png。脚本用事件 ID 将两份文件配对，因为两个事件的日期相同，单凭日期无法区分。试着调换 CSV 两行顺序再运行，两个点仍应拿到各自的震级。</p>
  <details><summary>核对坐标、图轴与结论</summary><p>us6000jllz 在 (37.014, 37.226)，震级 7.8；us6000jlqa 在 (37.196, 38.011)，震级 7.5。先经度、后纬度，所以第二个点更偏北。两组数字交换后仍在合法范围，要用来源核对。此图是经纬度散点，轴上单位是度。</p></details>
  <p>数据来源：<a href="https://earthquake.usgs.gov/earthquakes/eventpage/us6000jllz/origin/detail">USGS 第一个事件</a> · <a href="https://earthquake.usgs.gov/earthquakes/eventpage/us6000jlqa/origin/detail">USGS 第二个事件</a></p>
  <a href="#unit-plotting">回看第 15 章</a> · <a href="#unit-api">下一章：使用 API</a></section>`;
}
