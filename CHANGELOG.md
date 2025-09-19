# 更新日志

所有重要的项目变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.1]

### 修复
- 🐛 修复了 "Cannot find module 'axios'" 错误
  - 将axios替换为Node.js原生HTTPS模块
  - 移除了外部依赖，提高扩展稳定性
- 🐛 修复了配置属性和命令注册冲突错误
  - 确保了publisher字段与Marketplace账户一致("xixifu")
  - 将所有配置属性名称从"englishTranslate.*"更改为"xixifuTranslate.*"
  - 将所有命令名称从"englishTranslate.*"更改为"xixifuTranslate.*"
  - 彻底解决了扩展ID冲突问题
  - 建议用户完全卸载旧版本后再安装新版本

### 变更
- 🔄 改进了命名建议功能的交互方式
  - 移除了有bug的"+"按钮
  - 现在可以直接点击翻译结果调用命名建议
  - 修复了"请先选择单词"的错误提示问题
  - 命名建议功能使用最近的翻译结果，避免选择状态丢失
- 📦 优化了扩展打包方式
  - 使用原生模块替代第三方依赖
  - 移除了不需要的webpack相关依赖
  - 减小了扩展包大小和node_modules体积

## [1.0.0]

### 新增
- 🌐 智能中英文翻译功能
  - 自动语言检测
  - 选中文本自动翻译
  - Google Translate API集成
  - 翻译结果缓存机制

- 🔧 变量命名助手
  - camelCase 驼峰命名法
  - PascalCase 帕斯卡命名法
  - snake_case 下划线命名法
  - CONSTANT_CASE 常量命名法
  - kebab-case 短横线命名法

- 💡 用户界面
  - 状态栏翻译结果显示
  - 命名建议快速选择面板
  - 一键复制到剪贴板
  - 光标位置直接插入

- ⚙️ 配置选项
  - 自动翻译开关
  - 状态栏显示时长配置
  - 状态栏位置选择
  - 首选命名风格设置

- 🎯 快捷键支持
  - `Ctrl+Shift+T` 翻译选中文本
  - 键盘导航支持

- 🛡️ 错误处理
  - 网络异常友好提示
  - API调用失败备用方案
  - 输入验证和清理

### 技术实现
- TypeScript 开发
- VSCode Extension API
- Axios HTTP客户端
- 模块化架构设计
- 单元测试覆盖

### 性能优化
- 翻译结果本地缓存
- 防抖处理避免频繁API调用
- 异步处理提升响应速度
- 内存使用优化

---

## 计划中的功能

### [1.1.0] - 计划中
- [ ] 更多翻译服务支持（百度翻译、有道翻译）
- [ ] 批量翻译功能
- [ ] 翻译历史记录
- [ ] 自定义命名模板

### [1.2.0] - 计划中
- [ ] 代码注释翻译
- [ ] 多语言界面支持
- [ ] 翻译质量评分
- [ ] 离线词典支持

### [2.0.0] - 长期计划
- [ ] AI驱动的上下文翻译
- [ ] 代码重构建议
- [ ] 团队协作功能
- [ ] 插件生态系统

---

## 贡献指南

欢迎提交Issue和Pull Request！

### 如何贡献
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 开发环境
```bash
# 克隆项目
git clone https://github.com/your-username/vscode-english-translate.git

# 安装依赖
npm install

# 开发模式
npm run watch

# 运行测试
npm test

# 打包扩展
npm run package
```

---

**感谢所有贡献者！** 🙏
