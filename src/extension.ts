import * as vscode from 'vscode';
import { TranslatorService } from './translator';
import { StatusBarManager } from './ui/statusBar';
import { NameGenerator } from './nameGenerator';
import { NamingPanel } from './ui/namingPanel';

let translatorService: TranslatorService;
let statusBarManager: StatusBarManager;
let nameGenerator: NameGenerator;
let namingPanel: NamingPanel;

export function activate(context: vscode.ExtensionContext) {
    console.log('English Translate extension is now active!');

    // 初始化服务
    translatorService = new TranslatorService();
    statusBarManager = new StatusBarManager();
    nameGenerator = new NameGenerator();
    namingPanel = new NamingPanel(context);

    // 注册命令
    const translateCommand = vscode.commands.registerCommand('englishTranslate.translateSelection', async () => {
        await translateSelectedText();
    });

    const showNamingCommand = vscode.commands.registerCommand('englishTranslate.showNamingOptions', async () => {
        await showNamingOptions();
    });

    const copyCommand = vscode.commands.registerCommand('englishTranslate.copyToClipboard', async (text: string) => {
        await vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage('已复制到剪贴板');
    });

    const clearStatusBarCommand = vscode.commands.registerCommand('englishTranslate.clearStatusBar', () => {
        statusBarManager.clear();
    });

    // 监听文本选择变化
    const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection(async (event) => {
        const config = vscode.workspace.getConfiguration('englishTranslate');
        const autoTranslate = config.get<boolean>('autoTranslate', true);
        
        if (autoTranslate && event.selections.length > 0) {
            const selection = event.selections[0];
            if (!selection.isEmpty) {
                const selectedText = event.textEditor.document.getText(selection).trim();
                if (selectedText && selectedText.length > 0 && selectedText.length < 100) {
                    await translateSelectedText(selectedText);
                }
            }
        }
    });

    // 添加到context
    context.subscriptions.push(
        translateCommand,
        showNamingCommand,
        copyCommand,
        clearStatusBarCommand,
        selectionChangeListener,
        statusBarManager
    );
}

async function translateSelectedText(text?: string): Promise<void> {
    try {
        let selectedText = text;
        
        if (!selectedText) {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('请先选择要翻译的文本');
                return;
            }

            const selection = editor.selection;
            if (selection.isEmpty) {
                vscode.window.showWarningMessage('请先选择要翻译的文本');
                return;
            }

            selectedText = editor.document.getText(selection).trim();
        }

        if (!selectedText) {
            return;
        }

        // 显示加载状态
        statusBarManager.showLoading();

        // 执行翻译
        const result = await translatorService.translate(selectedText);
        
        // 显示翻译结果
        statusBarManager.showTranslation(result);

        // 如果是中文翻译成英文，显示命名建议按钮
        if (result.sourceLanguage === 'zh' && result.targetLanguage === 'en') {
            statusBarManager.showNamingButton(result.translatedText);
        }

    } catch (error) {
        console.error('Translation error:', error);
        statusBarManager.showError('翻译失败，请检查网络连接');
    }
}

async function showNamingOptions(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showWarningMessage('请先选择要生成命名的文本');
        return;
    }

    const selectedText = editor.document.getText(selection).trim();
    
    try {
        // 先翻译成英文
        const result = await translatorService.translate(selectedText);
        let englishText = result.translatedText;
        
        if (result.sourceLanguage === 'en') {
            englishText = selectedText;
        }

        // 生成命名选项
        const namingOptions = nameGenerator.generateNamingOptions(englishText);
        
        // 显示命名面板
        await namingPanel.show(namingOptions);
        
    } catch (error) {
        console.error('Naming options error:', error);
        vscode.window.showErrorMessage('生成命名建议失败');
    }
}

export function deactivate() {
    if (statusBarManager) {
        statusBarManager.dispose();
    }
}
