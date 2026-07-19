---
title: "最新guisingbox路由规则"
date: 2026-07-01T22:24:49+08:00
draft: false
author: "M.Liu"
description: ""
image: "/images/guiforsingbox.jpg"
tags: ["guisingbox"]
categories: ["网络收藏"]
archives: ["guisingbox"]
---


# 最新guisingbox路由规则，规则-dns修改---

## 🛠️ 第一部分：路由规则（Route Rules）大扫除与完美排序

请在客户端左侧菜单进入 \*\*「路由规则 / Route Rules」\*\* 页面，完成以下三步：

### 1. 清理垃圾与多余规则

点击规则右侧的 \*\*「垃圾桶图标」\*\*，彻底删除以下条目：

\* ❌ 删掉名字拼错的 \`category-ad5-al-geosite.srs\` 规则。

\* ❌ 删掉没有 \`.srs\` 后缀的 \`Category-Ads\` 规则。

\* ❌ 删掉带有 \`gfw-geosite.srs\` 的最后一行规则（已用海外大网完美兜底，无需重叠）。

### 2. 修正 YouTube 的“套娃”指向

\* 找到条件为 \`youtube-geosite.srs\` 的那一行，点击 \*\*「编辑」\*\*。

\* 将它的 \*\*「目标出站 / Outbound」\*\* 选项，从原本套娃的虚拟组改为直连主策略： \*\*\`🚀 节点选择\`\*\*。

\* \*(随后去左侧「策略组」页面，把原本那个叫 \`📹️ YouTube视频\` 的空壳策略组直接删掉)\*。

### 3. 鼠标拖动，完成黄金排序（从上到下）

用鼠标拖动规则，严格调整为以下顺序：

\* 🔝 \*\*【最顶部：基石与拦截】\*\*

1. \`protocol: dns\` ➡️ \`hijack-dns\`
2. \`inbound: tun-in\` ➡️ \`sniff\`
3. \`category-ads-all-geosite.srs\` ➡️ \`🛑 全球拦截\`
4. \`protocol: quic\` ➡️ \`🛑 全球拦截\`
5. \`network: icmp\` ➡️ \`🎯 全球直连\`
6. \`clash\_mode: direct\` ➡️ \`🎯 全球直连\`
7. \`clash\_mode: global\` ➡️ \`GLOBAL\`

\* 🚀 \*\*【重点：特种海外精准分流】\*\*（必须排在大陆直连上方，防止 AI 误伤走香港）

8. \`openai-geosite.srs\` ➡️ \`🅾️ OpenAI\`
9. \`gemini-geosite.srs\` ➡️ \`Gemini\`
10. \`youtube-geosite.srs\` ➡️ \`🚀 节点选择\`
11. \`github-geosite.srs\` ➡️ \`github\`

\* 🇨🇳 \*\*【无缝：国内大厂直连放行】\*\*（排在海外大网传统上方，保证国内秒开、不绕路）

12. \`GeoSite-CN\` ➡️ \`🎯 全球直连\`
13. \`GeoIP-CN\` ➡️ \`🎯 全球直连\`

\* 🗺️ \*\*【底部：海外大网终极兜底】\*\*

14. \`GeoLocation-!CN\` ➡️ \`🚀 节点选择\`

---

## 🌐 第二部分：DNS 规则（DNS Rules）去繁就简

请在客户端左侧菜单进入 \*\*「DNS」\*\* 页面，下拉找到 \*\*「DNS 规则 / DNS Rules」\*\* 列表：

### 1. 拔除死循环与重复项

\* ❌ 删掉带有 \`invert: true\`（反转）且勾选了 \`GeoIP-CN\` 的那一行（避免“先判断还是先解析”的底层逻辑死循环）。

\* ❌ 删掉那三行一模一样、重复生成的 \`GeoIP-CN\` ➡️ \`dns\_direct\` 规则。

### 2. 最终保留的核心 4 行 DNS 路由

精简后，确保你的 DNS 规则列表\*\*只留下以下 4 条\*\*（如缺少可点新建，顺序列队）：
```
| 顺序 | 匹配条件 (Match) | 目标服务器 (Server) | 作用 |

| --- | --- | --- | --- |

| \*\*1\*\* | \`clash\_mode: direct\` | \`Local-DNS\` | 直连模式走国内阿里 DNS |

| \*\*2\*\* | \`clash\_mode: global\` | \`Remote-DNS\` | 全局模式走国外谷歌 DNS |

| \*\*3\*\* | \`rule\_set: GeoSite-CN\` | \`Local-DNS\` | \*\*国内域名\*\*找阿里 DNS 秒解析 |

| \*\*4\*\* | \`rule\_set: GeoLocation-!CN\` | \`Remote-DNS\` | \*\*国外域名\*\*精炼走加密 DNS 防污染 |

> 💡 \*\*检查兜底\*\*：确保 DNS 页面底部的 \*\*「Final / 默认服务器」\*\* 选项勾选的是 \*\*\`Remote-DNS\`\*\*。
```

## 🎯 第三部分：高灵活性策略组（Outbounds）勾选

最后，进入左侧 \*\*「策略组 / 节点选择」\*\* 页面，检查这两个日常高频使用的独立开关：
```
1. \*\*\`🐟 漏网之鱼\` 组\*\*：确保里面包含了 \*\*\`🚀 节点选择\`\*\* 和 \*\*\`🎯 全球直连\`\*\*。

\* \*日常用法\*：默认勾选 \`🚀 节点选择\`。万一遇到极个别分类不明确的冷门国内小网站被误伤，随手在这里切成 \`全球直连\` 即可，极为灵活。

2. \*\*\`github\` 组\*\*：确保里面包含了 \*\*\`🚀 节点选择\`\*\* 以及 \*\*「全部节点列表」\*\*。

\* \*日常用法\*：平时默认跟大部队走；当遇到 GitHub 频繁弹验证码或者下载卡顿时，可以直接在里面点选一个干净的、速度快的节点单独伺候它。
```


### 🏁 终点站

全部核对无误后，点击界面右上角或右下角的 \*\*「保存并应用 (Save & Apply)」\*\*。  
这一整套组合拳下来，你的 Sing-Box 核心配置就完成了从“臃肿打架”到“丝滑高效”的完美蜕变，彻底封盘毕业，安心冲浪吧！
  
---
![img](/images/guisingbox1.jpg)

> # gui-singbox路由规则集设置

1. 第一条：国内域名分流 (geosite-cn)
* 类型： 选择 规则集 (rule set)
* 规则动作： 选择 路由
* 规则集 (rule set) 名字： 勾选或填入 geosite-cn
* 目标 DNS 服务器标签： 选择 dns_direct
* 反向匹配： 不勾选（关闭）
* 点击保存。
2. 第二条：国内地理位置分流 (geosite-geolocation-cn)
* 类型： 选择 规则集 (rule set)
* 规则动作： 选择 路由
* 规则集 (rule set) 名字： 勾选或填入 geosite-geolocation-cn
* 目标 DNS 服务器标签： 选择 dns_direct
* 反向匹配： 不勾选（关闭）
* 点击保存。
3. 第三条：关闭国外 IPv6 优化（专门解决报错的那一条！）
既然不能留空，我们就让它强制接管国内规则的 IPv6 请求，这样既不会报错，又完美实现了策略：
* 类型： 选择 规则集 (rule set)
* 规则动作： 选择 路由
* 规则集 (rule set) 名字： 依然填入或勾选 geosite-cn
* 解析策略组 (Strategy)： 必须选择 ipv4_only（强制关闭国外 IPv6，防止网页卡顿）
* 目标 DNS 服务器标签： 选择 dns_direct
* 反向匹配： 不勾选（关闭）
* 点击保存。
4. 第四条：漏网之鱼平替（抓取所有国外网站）
* 类型： 选择 规则集 (rule set)
* 规则动作： 选择 路由
* 规则集 (rule set) 名字： 填入或勾选 geosite-cn
* 目标 DNS 服务器标签： 必须选择你的国外加密服务器 dns_proxy
* 反向匹配： 必须勾选（开启）

---
![img](/images/guisingbox2.jpg)

> # 添加两组 DNS 服务器（Servers）
在添加规则之前，必须先在 “服务器 (Servers)” 列表里点击“添加”，建立好这两名接线员：
### 1. 国内直连 DNS
* 类型： udp
* 名称： dns_direct
* 服务器/地址： 223.5.5.5
* 端口： 53
* 出站标签： direct
* 解析本 DNS 服务器域名的 DNS： 留空 / 无
### 2. 国外加密 DNS
* 类型： https
* 名称： dns_proxy
* 服务器/地址： 1.1.1.1
* 路径： /dns-query
* 端口： 443
* 出站标签： 选择你的主力代理组（如 🚀 节点选择 或 Proxy）
* 解析本 DNS 服务器域名的 DNS： 下拉选择 dns_direct