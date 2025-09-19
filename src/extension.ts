import * as vscode from 'vscode';
import { TranslatorService, TranslationResult } from './translator';
import { StatusBarManager } from './ui/statusBar';
import { NameGenerator } from './nameGenerator';
import { NamingPanel } from './ui/namingPanel';

let translatorService: TranslatorService;
let statusBarManager: StatusBarManager;
let nameGenerator: NameGenerator;
let namingPanel: NamingPanel;
let lastTranslationResult: TranslationResult | null = null;

export function activate(context: vscode.ExtensionContext) {
    console.log('English Translate extension is now active!');

    // 初始化服务
    translatorService = new TranslatorService();
    statusBarManager = new StatusBarManager();
    nameGenerator = new NameGenerator();
    namingPanel = new NamingPanel(context);

    // 注册命令
    const translateCommand = vscode.commands.registerCommand('xixifuTranslate.translateSelection', async () => {
        await translateSelectedText();
    });

    const showNamingCommand = vscode.commands.registerCommand('xixifuTranslate.showNamingOptions', async () => {
        await showNamingOptions();
    });

    const copyCommand = vscode.commands.registerCommand('xixifuTranslate.copyToClipboard', async (text: string) => {
        await vscode.env.clipboard.writeText(text);
        vscode.window.showInformationMessage('已复制到剪贴板');
    });

    const clearStatusBarCommand = vscode.commands.registerCommand('xixifuTranslate.clearStatusBar', () => {
        statusBarManager.clear();
    });

    // 监听文本选择变化
    const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection(async (event) => {
        const config = vscode.workspace.getConfiguration('xixifuTranslate');
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

        // 保存最近的翻译结果
        lastTranslationResult = result;

        // 显示翻译结果
        statusBarManager.showTranslation(result);

    } catch (error) {
        console.error('Translation error:', error);
        statusBarManager.showError('翻译失败，请检查网络连接');
    }
}

async function showNamingOptions(): Promise<void> {
    let englishText = '';

    // 优先使用最近的翻译结果（如果是中文翻译成英文）
    if (lastTranslationResult &&
        lastTranslationResult.sourceLanguage === 'zh' &&
        lastTranslationResult.targetLanguage === 'en') {
        englishText = lastTranslationResult.translatedText;
    } else {
        // 如果没有合适的翻译结果，尝试从当前选择获取
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('请先翻译一些中文文本或选择要生成命名的文本');
            return;
        }

        const selection = editor.selection;
        if (selection.isEmpty) {
            vscode.window.showWarningMessage('请先翻译一些中文文本或选择要生成命名的文本');
            return;
        }

        const selectedText = editor.document.getText(selection).trim();

        try {
            // 翻译成英文
            const result = await translatorService.translate(selectedText);
            englishText = result.sourceLanguage === 'en' ? selectedText : result.translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            vscode.window.showErrorMessage('翻译失败，无法生成命名建议');
            return;
        }
    }

    try {
        // 生成命名选项
        const namingOptions = nameGenerator.generateNamingOptions(englishText);

        if (namingOptions.length === 0) {
            vscode.window.showInformationMessage('无法为此文本生成命名建议');
            return;
        }

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
