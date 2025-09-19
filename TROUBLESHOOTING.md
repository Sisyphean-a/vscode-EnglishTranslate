# 故障排除指南

## 安装新版本前的重要步骤

为了避免配置冲突和其他问题，请按以下步骤操作：

### 1. 完全卸载旧版本
1. 打开VSCode扩展面板
2. 搜索"english-translate"或"翻译"
3. 卸载所有相关的翻译扩展
4. 重启VSCode

### 2. 安装新版本
1. 安装新的`english-translate-1.0.1.vsix`文件
2. 重启VSCode
3. 验证功能是否正常

## 常见问题

### 配置属性冲突
如果遇到"无法注册xixifuTranslate.displayDuration"错误：
1. 完全卸载扩展
2. 重启VSCode
3. 重新安装

### 翻译功能不工作
1. 检查网络连接
2. 确保选中的文本长度在1-100字符之间
3. 查看VSCode开发者控制台的错误信息

### 命名建议功能
- 翻译中文后，点击状态栏的翻译结果即可查看命名建议
- 也可以通过命令面板手动调用"显示命名建议"

## 获取帮助

如果问题仍然存在，请访问：
https://github.com/Sisyphean-a/vscode-EnglishTranslate/issues
