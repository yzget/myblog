---
title: "{{ replace .Name "-" " " | title }}"    #  文档名
date: {{ .Date }}
draft: false    # false 为发布状态，如是草稿可用 true 
author: "M.Liu"
description: ""  # 简介
image: ""  # 图片格式："/images/featared.jpg"或同文件夹下"featared.jpg "
tags: [""]  # 标签
categories: [""]  # 类别
archives: [""]  # 存档
---