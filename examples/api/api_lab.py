"""与 report.py、api_snapshot.json 放在同一目录，运行 python api_lab.py --help。"""
import argparse
import json
from pathlib import Path

import plotly.graph_objects as go
import requests

from report import fetch_repositories, repository_rows


def read_rows(mode):
    if mode == "live":
        payload = fetch_repositories()
    else:
        path = Path(__file__).with_name("api_snapshot.json")
        payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict):
        raise ValueError("响应顶层应为 JSON 对象")
    return repository_rows(payload)


def main():
    parser = argparse.ArgumentParser(description="从 GitHub 搜索结果画出仓库收藏数")
    parser.add_argument("--mode", choices=["offline", "live"], default="offline")
    parser.add_argument("--out", type=Path, required=True, help="新的 HTML 输出文件")
    args = parser.parse_args()
    try:
        rows = read_rows(args.mode)
    except requests.Timeout:
        parser.exit(1, "请求超时。可去掉 --mode live，用离线样本继续。\n")
    except requests.HTTPError as exc:
        response = exc.response
        parser.exit(1, f"HTTP {response.status_code}。检查响应消息和限流提示，可切换 offline。\n")
    except (requests.RequestException, ValueError, KeyError, TypeError, OSError) as exc:
        parser.exit(1, f"读取失败：{exc}。请检查网络、数据字段或样本文件。\n")
    source = "GitHub 实时响应" if args.mode == "live" else "离线合成样本"
    print(source, "本页记录数", len(rows))
    if not rows:
        print("本页为空，没有可绘制的仓库。")
        return
    names, stars, _ = zip(*rows)
    for name, count in zip(names, stars):
        print(name, count)
    chart = go.Figure(go.Bar(x=names, y=stars))
    chart.update_layout(title=f"仓库收藏数 · {source}", xaxis_title="仓库", yaxis_title="Stars")
    html = chart.to_html(include_plotlyjs=True)
    try:
        with args.out.open("x", encoding="utf-8") as stream:
            stream.write(html)
    except FileExistsError:
        parser.exit(1, "该文件已存在，请换一个 --out 文件名。\n")
    print(args.out)


if __name__ == "__main__":
    main()
