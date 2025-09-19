# English Translate for Programmers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/Sisyphean-a.english-translate)](https://marketplace.visualstudio.com/items?itemName=Sisyphean-a.english-translate)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/Sisyphean-a.english-translate)](https://marketplace.visualstudio.com/items?itemName=Sisyphean-a.english-translate)
[![GitHub issues](https://img.shields.io/github/issues/Sisyphean-a/vscode-EnglishTranslate)](https://github.com/Sisyphean-a/vscode-EnglishTranslate/issues)
[![GitHub stars](https://img.shields.io/github/stars/Sisyphean-a/vscode-EnglishTranslate)](https://github.com/Sisyphean-a/vscode-EnglishTranslate/stargazers)

一个专为程序员设计的VSCode翻译扩展，提供智能的中英文翻译功能和变量命名规范转换。

## 功能特性

### 🌐 智能翻译
- **自动语言检测**: 自动识别中文和英文
- **选中即翻译**: 选中文本后自动翻译，无需额外操作
- **状态栏显示**: 翻译结果显示在底部状态栏，不干扰编辑
- **翻译缓存**: 智能缓存翻译结果，提高响应速度

### 🔧 变量命名助手
支持多种编程命名格式转换：
- **camelCase** - 驼峰命名法（变量名、方法名）
- **PascalCase** - 帕斯卡命名法（类名、接口名）
- **snake_case** - 下划线命名法（Python变量名）
- **CONSTANT_CASE** - 常量命名法（常量定义）
- **kebab-case** - 短横线命名法（CSS类名、文件名）

### 💡 智能交互
- **一键复制**: 点击即可复制命名格式到剪贴板
- **批量操作**: 支持复制所有命名格式
- **光标插入**: 直接插入命名到光标位置
- **快捷键支持**: `Ctrl+Shift+T` 快速翻译

## 安装使用

1. 在VSCode扩展市场搜索 "English Translate for Programmers"
2. 点击安装
3. 重启VSCode

## 使用方法

### 基础翻译
1. 选中要翻译的文本
2. 翻译结果自动显示在状态栏
3. 5秒后自动清空（可配置）

### 命名建议
1. 选中中文词汇进行翻译
2. 状态栏显示英文翻译，并提示"点击查看命名建议"
3. 点击状态栏或通过命令面板调用"显示命名建议"
4. 选择格式复制到剪贴板或插入到光标位置

### 快捷键
- `Ctrl+Shift+T` (Mac: `Cmd+Shift+T`): 翻译选中文本

## 配置选项

```json
{
  "xixifuTranslate.autoTranslate": true,          // 自动翻译
  "xixifuTranslate.displayDuration": 5000,       // 显示时长(毫秒)
  "xixifuTranslate.statusBarPosition": "right",  // 状态栏位置
  "xixifuTranslate.preferredNamingStyle": "camelCase" // 首选命名风格
}
```

## 使用场景

### 场景1: 英文→中文翻译
```javascript
// 选中 "getUserInfo"
// 状态栏显示: "获取用户信息"
function getUserInfo() {
    // ...
}
```

### 场景2: 中文→英文翻译 + 命名建议
```javascript
// 选中 "用户信息"
// 状态栏显示: "user info - 点击查看命名建议"
// 点击状态栏或通过命令面板调用"显示命名建议":
// - camelCase: userInfo
// - PascalCase: UserInfo
// - snake_case: user_info
// - CONSTANT_CASE: USER_INFO
// - kebab-case: user-info
```

## 技术特性

- **轻量级**: 最小化资源占用
- **离线缓存**: 减少网络请求
- **错误处理**: 网络异常时的友好提示
- **主题适配**: 自动适配VSCode主题
- **多语言**: 支持中英文界面

## 隐私说明

- 翻译请求通过Google Translate API处理
- 本地缓存翻译结果，减少API调用
- 不收集或存储用户个人信息

## 反馈与支持

如果您遇到问题或有建议，请：
1. 在GitHub提交Issue
2. 发送邮件至开发者
3. 在VSCode市场留下评价

## 更新日志

### 1.0.0
- 初始版本发布
- 基础翻译功能
- 命名格式转换
- 状态栏显示

## 贡献

欢迎贡献代码！请查看 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 开发者
- [Sisyphean-a](https://github.com/Sisyphean-a)

### 贡献者
感谢所有为这个项目做出贡献的开发者！

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 支持

如果这个扩展对你有帮助，请考虑：
- ⭐ 给项目点个星
- 🐛 报告问题或建议
- 🔀 提交 Pull Request
- 📝 分享给其他开发者

## 相关链接

- [GitHub 仓库](https://github.com/Sisyphean-a/vscode-EnglishTranslate)
- [VSCode 市场](https://marketplace.visualstudio.com/items?itemName=Sisyphean-a.english-translate)
- [问题反馈](https://github.com/Sisyphean-a/vscode-EnglishTranslate/issues)
- [更新日志](CHANGELOG.md)

---

**享受编程，让命名更简单！** 🚀
