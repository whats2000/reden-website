# Reden 网站

🌍 **语言**: [English](README.en_US.md) | [中文](README.md)

### 🎯 关于 Reden

Reden 是一个专为 Minecraft 红石爱好者打造的综合平台，提供工具、资源和社区功能来分享和创造红石装置。"Reden" 这个名字来源于 "Redstone Eden"（红石伊甸园）—— 红石爱好者的天堂。

### ✨ 功能特色

- **🔧 投影生成器**: 在线生成红石机器，如世界吞噬者和隧道钻孔机
- **📋 原理图分享**: 上传、分享和下载投影文件
- **🎮 Minecraft 集成**: 通过 Microsoft 认证验证 Minecraft 账户绑定
- **🌐 多语言支持**: 支持英语、中文（简体/繁体）和俄语
- **👥 社区功能**: 用户档案、关注系统和社交互动
- **🛠️ 工作室工具**: 在线投影编辑器，支持方块替换和版本转换
- **📊 数据分析**: 下载追踪和热度指标
- **🎨 现代化界面**: 使用 Vuetify 和现代网络技术构建

### 🛠️ 技术栈

- **前端框架**: [Nuxt 3](https://nuxt.com/) (Vue.js)
- **UI 库**: [Vuetify 3](https://vuetifyjs.com/)
- **样式**: CSS3 现代设计模式
- **国际化**: @nuxtjs/i18n 多语言支持
- **内容管理**: @nuxt/content 文档系统
- **状态管理**: Pinia
- **身份验证**: Microsoft OAuth 集成
- **PWA**: 渐进式网络应用功能

### 🚀 开始使用

#### 环境要求

- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

#### 安装步骤

1. 克隆仓库:
```bash
git clone https://github.com/RedenMC/reden-website.git
cd reden-website
```

2. 安装依赖:
```bash
npm install
```

3. 启动开发服务器:
```bash
npm run dev
```

4. 打开浏览器访问 `http://localhost:3000`

#### 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 生产环境构建
- `npm run generate` - 生成静态站点
- `npm run preview` - 预览生产构建
- `npm run dev-prod-backend` - 使用生产后端的开发模式

### 📁 项目结构

```
├── components/          # Vue 组件
│   ├── layout/         # 布局组件（头部、底部）
│   ├── litematica/     # 投影相关组件
│   ├── profile/        # 用户档案组件
│   └── admin/          # 管理面板组件
├── pages/              # Nuxt 页面（自动路由）
├── layouts/            # 布局模板
├── middleware/         # 路由中间件
├── plugins/            # Nuxt 插件
├── store/              # Pinia 状态库
├── utils/              # 工具函数
├── i18n/               # 国际化文件
├── assets/             # 静态资源
├── public/             # 公共静态文件
└── content/            # 内容文件（markdown）
```

### 🌍 国际化

网站支持多种语言:
- **en**: 英语
- **zh_cn**: 中文（简体）
- **zh_tw**: 中文（繁体）
- **ru**: 俄语

语言文件位于 `i18n/` 目录中。

### 🤝 贡献

我们欢迎大家为改进 Reden 做出贡献！以下是您可以参与的方式：

1. Fork 此仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 📄 许可证

此项目是开源的，采用相应的开源许可证。

### 🙏 致谢

- Minecraft 社区的灵感启发
- 让这个项目成为可能的贡献者和赞助者
- 项目中使用的开源库和工具

### 📞 联系方式

- Discord: [Discord 服务器](https://discord.gg/fCxmEyFgAd)
- GitHub: [RedenMC 组织](https://github.com/RedenMC)
- 网站: [redenmc.com](https://redenmc.com)

---

**免责声明**: 这不是 Minecraft 官方服务。与 Mojang、网易或微软无关。
