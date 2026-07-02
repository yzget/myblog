---
title: "gui-singbox路由服务器设置"
date: 2026-07-01T22:05:53+08:00
draft: false
author: "蝴蝶飞"
description: ""
image: "/images/guisingbox1.jpg"
tags: ["singbox"]
categories: ["网络收藏"]
archives: ["guisingbox"]
---
添加两组 DNS 服务器（Servers）
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