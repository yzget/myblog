---
title: "gui-singbox路由规则集设置"
date: 2026-07-02T15:06:31+08:00
draft: false
author: "蝴蝶飞"
description: ""
image: "/images/shujia.jpg"
tags: ["singbox"]
categories: ["网络收藏"]
archives: ["guisingbox"]
---
gui-singbox路由规则集设置

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


