# 使用指南

## 开发和测试

### 1. 安装依赖
```bash
npm install
```

### 2. 编译项目
```bash
npm run compile
```

### 3. 在VSCode中测试扩展

1. 打开VSCode
2. 按 `F5` 或使用 "Run Extension" 配置启动扩展开发主机
3. 在新的VSCode窗口中测试扩展功能

### 4. 运行测试
```bash
npm test
```

### 5. 代码检查
```bash
npm run lint
```

## 功能测试

### 基础翻译测试
1. 在编辑器中选中英文文本，如 "hello world"
2. 查看状态栏是否显示中文翻译
3. 选中中文文本，如 "你好世界"
4. 查看状态栏是否显示英文翻译

### 命名建议测试
1. 选中中文文本，如 "用户信息"
2. 状态栏应显示英文翻译和 "Create" 按钮
3. 点击按钮查看各种命名格式选项
4. 测试复制功能

### 快捷键测试
1. 选中任意文本
2. 按 `Ctrl+Shift+T` (Windows/Linux) 或 `Cmd+Shift+T` (Mac)
3. 验证翻译功能是否正常工作

## 打包发布

### 1. 安装vsce
```bash
npm install -g vsce
```

### 2. 打包扩展
```bash
npm run package
```

这将生成 `.vsix` 文件，可以用于本地安装或发布到市场。

### 3. 本地安装测试
```bash
code --install-extension english-translate-1.0.0.vsix
```

## 配置选项

在VSCode设置中可以配置以下选项：

- `englishTranslate.autoTranslate`: 是否自动翻译选中文本
- `englishTranslate.displayDuration`: 状态栏显示时长
- `englishTranslate.statusBarPosition`: 状态栏显示位置
- `englishTranslate.preferredNamingStyle`: 首选命名风格

## 故障排除

### 翻译不工作
1. 检查网络连接
2. 确认选中的文本长度合适（1-100字符）
3. 查看开发者控制台的错误信息

### 编译错误
1. 确保安装了所有依赖：`npm install`
2. 清理并重新编译：`npm run compile`
3. 检查TypeScript版本兼容性

### 测试失败
1. 确保安装了测试依赖
2. 检查测试文件路径
3. 查看测试输出的具体错误信息

## 开发建议

1. 使用 `npm run watch` 进行开发时的自动编译
2. 定期运行 `npm run lint` 检查代码质量
3. 在提交前运行完整的测试套件
4. 遵循现有的代码风格和命名约定

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

详细信息请参考 CHANGELOG.md 中的贡献指南部分。
