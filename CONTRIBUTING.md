# 贡献指南

感谢您对 English Translate for Programmers 扩展的关注！我们欢迎各种形式的贡献。

## 如何贡献

### 报告问题
- 在 [Issues](https://github.com/Sisyphean-a/vscode-EnglishTranslate/issues) 页面创建新的问题报告
- 请详细描述问题，包括重现步骤和环境信息
- 如果可能，请提供截图或错误日志

### 功能建议
- 在 Issues 页面提交功能请求
- 详细说明建议的功能和使用场景
- 解释为什么这个功能对用户有价值

### 代码贡献

#### 开发环境设置
1. Fork 这个仓库
2. 克隆到本地：
   ```bash
   git clone https://github.com/your-username/vscode-EnglishTranslate.git
   cd vscode-EnglishTranslate
   ```
3. 安装依赖：
   ```bash
   npm install
   ```
4. 编译项目：
   ```bash
   npm run compile
   ```

#### 开发流程
1. 创建新的功能分支：
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. 进行开发和测试
3. 确保代码通过所有检查：
   ```bash
   npm run lint
   npm test
   npm run compile
   ```
4. 提交更改：
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```
5. 推送到你的 Fork：
   ```bash
   git push origin feature/your-feature-name
   ```
6. 创建 Pull Request

#### 代码规范
- 使用 TypeScript 开发
- 遵循现有的代码风格
- 添加适当的注释和文档
- 为新功能编写测试
- 确保 ESLint 检查通过

#### 提交信息规范
使用约定式提交格式：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建或辅助工具的变动

### 测试
- 在提交前运行完整的测试套件
- 在不同的 VSCode 版本中测试
- 测试各种翻译场景和命名格式

## 开发指南

### 项目结构
```
src/
├── extension.ts          # 主入口
├── translator.ts         # 翻译服务
├── nameGenerator.ts      # 命名生成器
├── ui/                   # UI 组件
└── utils/               # 工具函数
```

### 调试
1. 按 F5 启动扩展开发主机
2. 在新窗口中测试功能
3. 使用开发者工具查看日志

### 发布流程
1. 更新版本号
2. 更新 CHANGELOG.md
3. 运行测试和构建
4. 创建 Release

## 行为准则

请遵循以下原则：
- 尊重所有贡献者
- 保持友好和专业的交流
- 专注于建设性的反馈
- 帮助维护一个包容的社区环境

## 获得帮助

如果您有任何问题：
- 查看现有的 Issues 和文档
- 在 Issues 中提问
- 联系维护者

感谢您的贡献！🎉
