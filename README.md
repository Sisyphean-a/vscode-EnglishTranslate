# English Translate for Programmers

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
1. 选中中文词汇
2. 状态栏显示英文翻译和"Create"按钮
3. 点击按钮查看各种命名格式
4. 选择格式复制到剪贴板

### 快捷键
- `Ctrl+Shift+T` (Mac: `Cmd+Shift+T`): 翻译选中文本

## 配置选项

```json
{
  "englishTranslate.autoTranslate": true,          // 自动翻译
  "englishTranslate.displayDuration": 5000,       // 显示时长(毫秒)
  "englishTranslate.statusBarPosition": "right",  // 状态栏位置
  "englishTranslate.preferredNamingStyle": "camelCase" // 首选命名风格
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

### 场景2: 中文→英文 + 命名建议
```javascript
// 选中 "用户信息"
// 状态栏显示: "user info [Create]"
// 点击后显示:
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

## 许可证

MIT License

---

**享受编程，让命名更简单！** 🚀
