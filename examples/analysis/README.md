# 校园事件数据图册

Python 3.12；新建虚拟环境后运行 `python -m pip install -r requirements.txt`。
执行 `python report.py --output output-01`。输出目录必须尚不存在，重跑用新目录名，避免覆盖旧报告。
执行 `python -m pytest -q` 验证脏日期、空值、随机复现、频数总和、坐标边界和 HTTP 调用契约。

默认数据全为合成练习数据。四条有效日期、两条拒绝记录；位置数据两条有效、一条越界。
HTML 图包含 Plotly 脚本可本地打开；places.html 为经纬度坐标散点，不是有地理投影的底图。

显式 `python report.py --output output-live --live` 才会调用 GitHub 公共 API，需要可访问网络；未配置认证时可能限流。
真实请求失败会报错，不会把离线样本伪装为实时结果。requests 的 timeout 参数不是整个下载的总截止时间。
本包已验证离线生成和 HTTP 替身测试，未验证实时接口响应。

阅读顺序：load_daily 的记录原子性 → walk/dice 的随机种子 → load_places 的结构校验 → build 的图层 → fetch_repositories 的请求边界。
验收：日期和数值不会错位；拒绝行有原因；同种子可复现；骰子总次数正确；图有轴名和来源；旧输出不被覆盖。
