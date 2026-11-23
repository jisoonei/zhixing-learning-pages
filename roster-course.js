// Original, runnable examples for textbook chapters 10 and 11. Shared files are
// rendered from these strings wherever the same learner task uses them.
const rosterFiles = {
  'write_list.py': String.raw`from pathlib import Path

path = Path("names.txt")
names = ["阿禾", "小北"]
path.write_text("\n".join(names) + "\n", encoding="utf-8")
print(path.read_text(encoding="utf-8").splitlines())`,
  'read_list.py': String.raw`from pathlib import Path

path = Path("names.txt")
try:
    text = path.read_text(encoding="utf-8")
except FileNotFoundError:
    print("没有找到名单，请检查目录或文件名")
else:
    names = text.splitlines()
    print("报名人数", len(names))
    for name in names:
        print(name)`,
  'scan.py': String.raw`from pathlib import Path

path = Path("numbers.txt")
with path.open("w", encoding="utf-8") as file:
    for number in range(100_000):
        file.write(f"{number:010d}\n")

target = "0000082715"
with path.open(encoding="utf-8") as file:
    found = any(line.strip() == target for line in file)
print("找到编号" if found else "没有这个编号")`,
  'summarize.py': String.raw`from pathlib import Path

def report(path, required=True):
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        if required:
            print(path.name, "缺少必交名单")
        return
    names = [line.strip() for line in lines if line.strip()]
    try:
        share = 1 / len(names)
    except ZeroDivisionError:
        print(path.name, "空名单，无法计算每人份额")
    else:
        print(path.name, len(names), "人，每人份额", share)

report(Path("names.txt"))
report(Path("empty.txt"))
report(Path("missing.txt"))
report(Path("extra.txt"), required=False)`,
  'remember.py': String.raw`import json
from pathlib import Path

def load_names(path):
    return json.loads(path.read_text(encoding="utf-8"))

def save_names(path, names):
    path.write_text(json.dumps(names, ensure_ascii=False), encoding="utf-8")

def main():
    path = Path("signup.json")
    try:
        names = load_names(path)
    except FileNotFoundError:
        names = []
    except json.JSONDecodeError:
        print("名单格式损坏，请检查 signup.json")
        return
    if not isinstance(names, list) or not all(isinstance(n, str) for n in names):
        print("名单应为姓名字符串列表")
        return
    name = input("报名姓名：").strip()
    if name and name not in names:
        names.append(name)
    save_names(path, names)
    print("当前名单", names)

if __name__ == "__main__":
    main()`,
  'roster.py': String.raw`def parse_names(text):
    return [line.strip() for line in text.splitlines() if line.strip()]`,
  'signup_book.py': String.raw`class Roster:
    def __init__(self):
        self.names = []

    def add(self, name):
        name = name.strip()
        if not name or name in self.names:
            return False
        self.names.append(name)
        return True`,
  'test_names.py': String.raw`from roster import parse_names

def test_two_names():
    names = parse_names("阿禾\n小北\n")
    assert len(names) == 2
    assert names == ["阿禾", "小北"]`,
  'test_edges.py': String.raw`from roster import parse_names

def test_blank_lines():
    assert parse_names("  阿禾  \n\n小北\n") == ["阿禾", "小北"]

def test_empty_text():
    assert parse_names("") == []`,
  'test_roster.py': String.raw`import pytest
from signup_book import Roster

@pytest.fixture
def roster():
    return Roster()

def test_add_one(roster):
    assert roster.add(" 阿禾 ")
    assert "阿禾" in roster.names
    assert len(roster.names) == 1

def test_reject_duplicate(roster):
    assert roster.names == []
    roster.add("小北")
    assert not roster.add("小北")
    assert roster.names == ["小北"]`
};

const rosterCourse = {
  5: {
    number: 10, title: '文件和异常',
    goal: '上次报名的名字，明天重新打开程序还能找到吗？先把两个人的名字写到磁盘，再分别处理文件缺失、空名单和损坏的数据。',
    setup: '新建一个空文件夹 signup，所有 .py 和数据文件都保存在里面。用终端进入该文件夹再运行命令。可先运行 python -c "from pathlib import Path; print(Path.cwd())" 核对工作目录。Windows 若使用 py，请把命令开头的 python 换成 py。',
    stages: [
      {id:'write', ref:'10.2.1–10.2.2', title:'把两行名字写进文件',
        guide:'先准备数据再读。Path("names.txt") 表示当前工作目录里的文件；创建 Path 对象时，磁盘上还没有这个文件。write_text 才负责写入。UTF-8 让下次读取时能按同一种编码还原汉字。',
        files:['write_list.py'], command:'python write_list.py', expected:"['阿禾', '小北']",
        trace:'join 把两个名字用换行符连接，末尾再加一个换行符。打开 names.txt 应看到两行，先是阿禾，再是小北。若名单只有一个人，join 不会插入分隔符，末尾的换行仍在。',
        challenge:'先猜再试：在列表中加上“小南”，连续运行两次，文件最终会有三行还是六行？',
        answer:'三行。write_text 每次重写整个文件。改成只有一个名字再运行，旧的第二、三行也会消失。请在练习目录中使用这个文件名。'},
      {id:'read', ref:'10.1.1–10.1.4、10.3.5', title:'重新打开名单，读出每一个名字',
        guide:'沿用上一步的 names.txt；若单独做这一步，请先新建 names.txt，分别输入阿禾和小北，各占一行。read_text 读入一整段文字，splitlines() 才把它拆成按行排列的列表。',
        files:['read_list.py'], command:'python read_list.py', expected:'报名人数 2\n阿禾\n小北',
        trace:'先计算相对路径，再尝试读取。只有成功读到文件才进入 else。len 数列表项，for 按原顺序显示名字。文件末尾的单个换行不会多出一个人；名单中间的空行会成为空字符串。本步假定每行有一个名字，第 4 步会过滤空白行。',
        challenge:'先把 names.txt 改名为 backup.txt 并运行。然后创建一个空的 names.txt 再运行。两次结果为什么不同？',
        answer:'第一次进入 except，显示“没有找到名单，请检查目录或文件名”。第二次读取成功，显示“报名人数 0”。Path("data") / "names.txt" 指向当前目录里的 data 子目录；path.resolve() 可以显示这次实际查找的绝对路径。'},
      {id:'scan', ref:'10.1.5–10.1.6', title:'在一百万个数字字符里找一个编号',
        guide:'报名规模变大后，用编号区分重名者。这次只查某个完整编号是否出现。程序生成十万行十位编号，数字字符合计一百万个。前导零也是编号的一部分，因此用字符串比较。',
        files:['scan.py'], command:'python scan.py', expected:'找到编号',
        trace:'010d 把整数补足十位。with 在退出代码块时关闭文件。第二次打开后逐行读取，strip 去掉行尾换行。any 遇到第一条相等记录就停，无须保留整份文件。',
        challenge:'把 target 改成 "0000100000"，再试短字符串 "82715"。先判断各会命中几次。',
        answer:'两次都输出“没有这个编号”。最大编号是 0000099999；短字符串也不等于任何完整的十位编号。若需求改为查找片段，可比较 target in line.strip()；此处搜索仍以一行为边界。'},
      {id:'exceptions', ref:'10.3.1–10.3.9', title:'区分缺交、空名单和可选文件',
        guide:'在练习目录准备 names.txt（阿禾、小北各占一行）和 empty.txt（空文件）。保持 missing.txt、extra.txt 缺席。每份名单平分一个录音时段。文件缺失与人数为零出现在不同的语句，需要不同的处理。',
        files:['summarize.py'], command:'python summarize.py', expected:'names.txt 2 人，每人份额 0.5\nempty.txt 空名单，无法计算每人份额\nmissing.txt 缺少必交名单',
        trace:'一次函数调用只处理一个文件。读不到时 return 结束本次调用，下一份仍可处理。空文件能成功读取，除法才触发 ZeroDivisionError。else 只在除法成功后执行。选交的 extra.txt 允许缺席，所以只有这份缺席时静默返回。',
        challenge:'给 empty.txt 只写几个空格。再在 extra.txt 写一行“小南”。预测哪一行提示会改变。',
        answer:'空白行被过滤，empty.txt 仍显示空名单。extra.txt 存在后也会统计，显示“extra.txt 1 人，每人份额 1.0”。必交名单缺席要报告；只捕获预期异常，其他读写错误仍保留诊断信息。'},
      {id:'json', ref:'10.4.1–10.4.3、10.5', title:'把报名结果留给下一次运行',
        guide:'在同一练习目录另存 remember.py。第一次运行前应没有 signup.json。每次运行输入一个名字。dumps 把 Python 列表转成 JSON 文本，write_text 写到磁盘；下次 read_text 读回文本，loads 恢复列表。保存、读取、交互各有自己的函数。',
        files:['remember.py'], command:'python remember.py', expected:"第一次输入 阿禾：当前名单 ['阿禾']\n第二次输入 小北：当前名单 ['阿禾', '小北']",
        trace:'第一次读不到文件，从空列表开始；第二次成功加载已有名字，只把新名字加在末尾。打开 signup.json，可以看到 JSON 使用双引号。',
        challenge:'再次输入阿禾，预测名单长度。然后在练习目录把 JSON 临时改成单独一个左方括号 [，运行后检查磁盘上的内容。',
        answer:'重复姓名不会再添加。损坏的 JSON 触发 JSONDecodeError，显示格式损坏并提前返回，原文件仍是 [。恢复为合法 JSON 后可继续。若 JSON 可解析但内容是一个数字，程序会提示姓名字符串列表的要求。'}
    ]
  },
  20: {
    number: 11, title: '测试代码',
    goal:'第 10 章靠眼睛核对名单。这次把“两个名字应该得到什么”写成可反复运行的检查，再验证空输入、重复报名和不同名单的独立性。',
    setup:'可沿用 signup 文件夹，也可从空目录单独开始。测试文件和 roster.py 放在同一层。以下命令都在该目录运行，Windows 已激活虚拟环境后也使用 python。',
    stages:[
      {id:'install', ref:'11.1.1–11.1.2', title:'为报名名单准备 pytest',
        guide:'在终端执行 python -m venv .venv。Windows PowerShell 可直接用 .\\.venv\\Scripts\\python.exe 代替下列所有命令开头的 python；macOS/Linux 用 ./.venv/bin/python。这样安装和运行都指向同一个解释器。',
        files:[],command:'python -m pip --version\npython -m pip install --upgrade pip\npython -m pip install pytest\npython -m pytest --version',expected:'最后一行显示 pytest 和本机安装的版本号。',
        trace:'-m 让当前解释器运行一个模块。pip 安装包，pytest 查找并运行测试。首次安装需要能访问包源；若已有 pytest，可以直接核对版本。',
        challenge:'终端提示 No module named pytest 时，首先检查什么？',
        answer:'用准备运行测试的同一个解释器执行 -m pip show pytest。找不到时用该解释器安装，再用它执行 -m pytest --version。'},
      {id:'function',ref:'11.2.1–11.2.3',title:'给读取名单的规则写第一项测试',
        guide:'把以下两个文件保存在同一目录。把上一章过滤空白行的规则提取成 parse_names 函数。它接收已经读出的文本，所以这个测试不依赖磁盘上的 names.txt。测试开始前，先手算输入含有几个有效名字。',
        files:['roster.py','test_names.py'],command:'python -m pytest -q test_names.py',expected:'1 passed（运行耗时依电脑而异）',
        trace:'pytest 找到以 test_ 开头的文件和函数。from roster 导入同目录里的实现。assert 后面放一个可判断真假的表达式；两个断言都为真，整个测试函数计作一项通过。',
        challenge:'如果只保留人数断言，错误地把“阿禾”和“小北”调换顺序还能通过吗？',
        answer:'能。人数不变。第二个断言比较整个列表，同时保护内容和顺序。'},
      {id:'failure',ref:'11.2.4–11.2.6',title:'读懂一次失败，再增加边界测试',
        guide:'沿用上一步的两个文件。单独开始时可展开下方“本步所需文件”取得同样的代码。暂时把 test_names.py 的 assert len(names) == 2 改为 == 3，再执行第一条命令。看完失败后改回 2，新增 test_edges.py，再执行第二条。',
        files:['roster.py','test_names.py','test_edges.py'],command:'python -m pytest -q test_names.py\npython -m pytest -q test_names.py test_edges.py',expected:'故意改成 3：1 failed，失败断言显示 assert 2 == 3。\n改回 2 并加上两个边界测试：3 passed。',
        trace:'失败报告给出文件名、测试名和出错断言。先读输入：它明确只有两个人，所以这次是预期值写错。若需求与断言一致而实现给错结果，应修实现再重跑全部测试。',
        challenge:'输入只包含一个换行符时应该返回什么？试着增加一个 test_only_newline，再运行第二条命令。',
        answer:'预期为 []。写下 assert parse_names("\\n") == []。此时两个测试文件合计应是 4 passed。'},
      {id:'class',ref:'11.3.1–11.3.4、11.4',title:'验证同一个名字只能报名一次',
        guide:'这里检查第 9 章学过的实例状态。使用下方 signup_book.py 和 test_roster.py。每项测试都需要一份开始时为空的报名册；名为 roster 的 fixture 会为每一个测试各创建一个新实例。',
        files:['signup_book.py','test_roster.py'],command:'python -m pytest -q test_roster.py',expected:'2 passed；与前面的三个基础函数测试一起运行 python -m pytest -q，可看到 5 passed（未加自选题时）。',
        trace:'第一项用真假、成员和长度断言检查新增成功。第二项先确认名单独立为空，再让同一个人报两次，检查返回值和最后的名单。@pytest.fixture 标记准备函数；pytest 按同名参数把创建的对象传入测试。',
        challenge:'独立补一项：只含空格的姓名应该被拒绝，报名册应当保持空。怎样同时验证这两个要求？',
        answer:'新建 test_blank_name(roster)，先写 assert not roster.add("   ")，再写 assert roster.names == []。单跑 test_roster.py 应为 3 passed。'}
    ]
  }
};


function rosterSection(route) {
  const match = /^chapter-(5|20)\/([a-z]+)$/.exec(route);
  if (!match) return null;
  const chapter = Number(match[1]);
  const stage = rosterCourse[chapter].stages.find(item => item.id === match[2]);
  return stage ? {chapter, stage} : null;
}

function textbookTrail() {
  return `<section class="notice"><h2>沿 Python 教材学习</h2>
    <p>教材第 9 章学类，第 10 章把报名名单保存到文件，第 11 章用测试检查程序。左侧的课号是站内学习顺序。跟书学习时，按这里的教材章号前进。</p>
    <div class="actions"><a class="secondary" href="#unit-objects">教材第 9 章 · 类</a>
    <a class="primary" href="#chapter-5">教材第 10 章 · 文件和异常</a>
    <a class="secondary" href="#chapter-20">教材第 11 章 · 测试代码</a></div></section>`;
}

function rosterTask(chapter) {
  const course = rosterCourse[chapter];
  const route = '#chapter-' + chapter;
  const next = chapter === 5 ? ['#chapter-20', '教材第 11 章 · 用测试核对名单'] :
    ['#unit-game-loop', '教材第 12 章 · 从第一个游戏窗口开始'];
  return `<section class="roster-course"><p class="intro">${esc(course.goal)}</p>
    <p><b>准备工作</b>　${esc(course.setup)}</p>
    <nav aria-label="本章实验步骤" class="roster-index">${course.stages.map((stage, i) =>
      `<a href="${route}/${stage.id}">${i + 1}　${esc(stage.title)}</a>`).join('')}</nav>
    ${course.stages.map((stage, i) => {
      const files = stage.files.map(name => `<div class="codehead"><span>${esc(name)}</span>
        <button type="button" data-roster-copy="${esc(name)}" aria-label="复制 ${esc(name)}">复制代码</button></div>
        <pre class="lined"><code>${codeMarkup(rosterFiles[name])}</code></pre>`).join('');
      const optional = stage.id === 'failure';
      return `<section class="roster-stage" id="roster-${stage.id}"><span class="course-kicker">教材 ${esc(stage.ref)}</span>
        <h2>${i + 1}　${esc(stage.title)}</h2><p>${esc(stage.guide)}</p>
        ${optional ? '<details><summary>本步所需文件</summary>' + files + '</details>' : files}
        ${readingCode(stage.command, '在终端运行')}<div class="output">${esc(stage.expected)}</div>
        <p>${esc(stage.trace)}</p><p><b>换一个输入</b>　${esc(stage.challenge)}</p>
        <details><summary>核对结果与原因</summary><p>${esc(stage.answer)}</p></details></section>`;
    }).join('')}
    <div class="actions"><a class="primary" href="${next[0]}">${next[1]}</a>
    <a class="secondary" href="#coverage">返回教材目录</a></div></section>`;
}

function bindRosterCopy() {
  document.querySelectorAll('[data-roster-copy]').forEach(button => {
    button.onclick = async () => {
      try {
        await navigator.clipboard.writeText(rosterFiles[button.dataset.rosterCopy]);
        button.textContent = '已复制';
      } catch {
        button.textContent = '请选中下方代码复制';
      }
    };
  });
}

