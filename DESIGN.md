# VSCode 程序员翻译扩展设计文档

## 项目概述

**扩展名称**: English Translate for Programmers  
**版本**: 1.0.0  
**目标**: 为程序员提供智能的中英文翻译功能，支持变量命名规范转换

## 功能需求

### 核心功能

1. **智能单词翻译**
   - 选中单词后自动翻译
   - 支持中文→英文，英文→中文
   - 自动检测语言类型
   - 支持驼峰、下划线等程序员常用词汇格式

2. **变量命名助手**
   - 选中中文词汇时，提供多种编程命名格式
   - 支持的格式：
     - camelCase (驼峰命名)
     - PascalCase (帕斯卡命名)
     - snake_case (下划线命名)
     - CONSTANT_CASE (常量命名)
     - kebab-case (短横线命名)

3. **底部状态栏显示**
   - 翻译结果显示在VSCode底部状态栏固定区域
   - 不干扰编辑器内容
   - 5秒后自动清空
   - 支持点击展开详细信息

### 用户交互流程

#### 场景1: 英文→中文翻译
1. 用户选中英文单词/短语
2. 扩展自动调用翻译API
3. 在底部状态栏显示中文翻译结果
4. 5秒后自动清空状态栏

#### 场景2: 中文→英文翻译 + 命名建议
1. 用户选中中文词汇
2. 扩展在状态栏显示基础英文翻译
3. 状态栏显示"Create"按钮
4. 点击按钮后在侧边栏或命令面板展开命名格式列表
5. 用户可点击复制特定格式

## 技术架构

### 项目结构
```
vscode-EnglishTranslate/
├── package.json              # 扩展配置
├── src/
│   ├── extension.ts          # 主入口文件
│   ├── translator.ts         # 翻译服务
│   ├── nameGenerator.ts      # 命名格式生成器
│   ├── ui/
│   │   ├── statusBar.ts      # 状态栏管理器
│   │   └── namingPanel.ts    # 命名建议面板
│   └── utils/
│       ├── languageDetector.ts # 语言检测
│       └── textProcessor.ts    # 文本处理
├── media/                    # 图标资源
├── README.md
└── CHANGELOG.md
```

### 核心模块设计

#### 1. 翻译服务 (translator.ts)
```typescript
interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

class TranslatorService {
  async translate(text: string): Promise<TranslationResult>
  private detectLanguage(text: string): string
  private callGoogleTranslateAPI(text: string, from: string, to: string): Promise<string>
}
```

#### 2. 命名格式生成器 (nameGenerator.ts)
```typescript
interface NamingOption {
  format: string;
  example: string;
  description: string;
}

class NameGenerator {
  generateNamingOptions(englishText: string): NamingOption[]
  private toCamelCase(text: string): string
  private toPascalCase(text: string): string
  private toSnakeCase(text: string): string
  private toConstantCase(text: string): string
  private toKebabCase(text: string): string
}
```

#### 3. 状态栏管理器 (statusBar.ts)
```typescript
interface StatusBarDisplayOptions {
  text: string;
  tooltip?: string;
  command?: string;
  duration?: number;
}

class StatusBarManager {
  private statusBarItem: vscode.StatusBarItem;
  private clearTimer?: NodeJS.Timeout;

  showTranslation(result: TranslationResult): void
  showNamingButton(englishText: string): void
  clear(): void
  private scheduleAutoClear(duration: number): void
}
```

#### 3. UI组件设计

**状态栏显示区域**
- 位置：VSCode底部状态栏右侧固定区域
- 样式：与VSCode主题一致，简洁明了
- 内容：翻译结果 + 操作按钮（如果是中文）
- 交互：点击可展开更多选项

**命名建议面板**
- 类型：VSCode QuickPick 或 TreeView
- 布局：列表形式，每项包含格式名、示例、复制按钮
- 交互：点击复制到剪贴板，支持键盘导航

## API设计

### Google Translate API
- 端点：`https://translate.googleapis.com/translate_a/single`
- 参数：
  - `client=gtx`
  - `sl=auto` (自动检测)
  - `tl=en|zh` (目标语言)
  - `dt=t`
  - `ie=UTF-8`
  - `dj=1`
  - `q={文本}`

### 扩展命令
- `englishTranslate.translateSelection`: 翻译选中文本
- `englishTranslate.showNamingOptions`: 显示命名建议
- `englishTranslate.copyToClipboard`: 复制到剪贴板
- `englishTranslate.clearStatusBar`: 清空状态栏显示

## 配置选项

```json
{
  "englishTranslate.autoTranslate": {
    "type": "boolean",
    "default": true,
    "description": "选中文本时自动翻译"
  },
  "englishTranslate.displayDuration": {
    "type": "number",
    "default": 5000,
    "description": "状态栏显示时长(毫秒)"
  },
  "englishTranslate.statusBarPosition": {
    "type": "string",
    "enum": ["left", "right"],
    "default": "right",
    "description": "状态栏显示位置"
  },
  "englishTranslate.preferredNamingStyle": {
    "type": "string",
    "enum": ["camelCase", "snake_case", "PascalCase"],
    "default": "camelCase",
    "description": "首选命名风格"
  }
}
```

## 开发计划

### 阶段1: 基础功能 (1-2周)
- [ ] 项目初始化和基础架构
- [ ] 翻译API集成
- [ ] 基础UI组件
- [ ] 文本选择监听

### 阶段2: 命名助手 (1周)
- [ ] 命名格式生成器
- [ ] 命名建议面板
- [ ] 剪贴板集成

### 阶段3: 优化和测试 (1周)
- [ ] 性能优化
- [ ] 错误处理
- [ ] 单元测试
- [ ] 用户体验优化

## 技术要求

- **开发语言**: TypeScript
- **VSCode API版本**: ^1.74.0
- **依赖包**:
  - `axios`: HTTP请求
  - `@types/vscode`: VSCode类型定义
- **构建工具**: webpack + esbuild

## 用户体验考虑

1. **非侵入式设计**: 状态栏显示不干扰编辑器内容，保持专注
2. **性能**: 翻译请求缓存，避免重复调用
3. **可访问性**: 支持键盘快捷键操作，状态栏支持点击交互
4. **国际化**: 支持多语言界面
5. **错误处理**: 网络错误时在状态栏显示友好提示
6. **隐私**: 本地缓存翻译结果，减少API调用
7. **视觉一致性**: 状态栏样式与VSCode主题保持一致

## 发布计划

1. **内测版**: 核心功能完成后内部测试
2. **Beta版**: 发布到VSCode Marketplace预览
3. **正式版**: 收集反馈后发布稳定版本

---

*本文档将随着开发进度持续更新*
