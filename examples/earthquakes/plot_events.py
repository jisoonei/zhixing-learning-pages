"""由两个 USGS 事件的离线数据绘制震中图；与两个数据文件放在同一目录。"""
import csv
import json
from pathlib import Path

import matplotlib.pyplot as plt

folder = Path(__file__).resolve().parent
with (folder / "events.csv").open(encoding="utf-8", newline="") as stream:
    magnitudes = {row["id"]: float(row["magnitude"]) for row in csv.DictReader(stream)}

features = json.loads((folder / "events.geojson").read_text(encoding="utf-8"))["features"]
fig, ax = plt.subplots(layout="constrained")
for feature in features:
    lon, lat = feature["geometry"]["coordinates"]
    magnitude = magnitudes[feature["id"]]
    ax.scatter(lon, lat)
    ax.annotate(f'{feature["properties"]["name"]} M{magnitude}', (lon, lat),
                xytext=(4, 4), textcoords="offset points")
    print(feature["id"], lon, lat, magnitude)
ax.set(xlabel="Longitude (degrees E)", ylabel="Latitude (degrees N)",
       title="USGS | Two earthquakes on 2023-02-06 (UTC)")
ax.margins(x=0.6, y=0.2)
fig.savefig(folder / "epicentres.png", dpi=150)
plt.close(fig)
