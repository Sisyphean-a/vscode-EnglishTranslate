import * as vscode from 'vscode';
import { TranslatorService, TranslationResult } from './translator';
import { StatusBarManager } from './ui/statusBar';
import { NameGenerator } from './nameGenerator';
import { NamingPanel } from './ui/namingPanel';
import { SelectionDebugger } from './utils/selectionDebugger';

let translatorService: TranslatorService;
let statusBarManager: StatusBarManager;
let nameGenerator: NameGenerator;
let namingPanel: NamingPanel;
let lastTranslationResult: TranslationResult | null = null;

// 防抖相关变量
let selectionDebounceTimer: NodeJS.Timeout | undefined;
let lastSelectionText: string = '';

// 调试器实例
const selectionDebugger = SelectionDebugger.getInstance();

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

    // 调试命令
    const toggleDebugCommand = vscode.commands.registerCommand('xixifuTranslate.toggleDebug', () => {
        if (selectionDebugger.getSelectionHistory().length === 0) {
            selectionDebugger.enable();
            vscode.window.showInformationMessage('选择调试模式已启用');
        } else {
            const report = selectionDebugger.generateDebugReport();
            console.log(report);
            vscode.window.showInformationMessage('调试报告已输出到控制台');
            selectionDebugger.clearHistory();
        }
    });

    // 监听文本选择变化
    const selectionChangeListener = vscode.window.onDidChangeTextEditorSelection(async (event) => {
        const config = vscode.workspace.getConfiguration('xixifuTranslate');
        const autoTranslate = config.get<boolean>('autoTranslate', true);

        if (!autoTranslate || event.selections.length === 0) {
            return;
        }

        // 清除之前的防抖定时器
        if (selectionDebounceTimer) {
            clearTimeout(selectionDebounceTimer);
        }

        const selection = event.selections[0];
        if (selection.isEmpty) {
            return;
        }



        // 使用防抖机制，延迟处理选择事件
        selectionDebounceTimer = setTimeout(async () => {
            try {
                // 再次检查选择是否仍然有效
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return;
                }

                const currentSelection = editor.selection;
                if (currentSelection.isEmpty) {
                    return;
                }

                // 获取选中的文本
                const selectedText = await getSelectedTextSafely(editor, currentSelection);

                // 记录调试信息
                selectionDebugger.logSelectionEvent(event, selectedText, 300);

                if (selectedText && selectedText.length > 0 && selectedText.length < 100) {
                    // 避免重复翻译相同的文本
                    if (selectedText !== lastSelectionText) {
                        lastSelectionText = selectedText;
                        console.log(`[Selection] Processing text: "${selectedText}" (length: ${selectedText.length})`);
                        await translateSelectedText(selectedText);
                    }
                }
            } catch (error) {
                console.error('Selection processing error:', error);
            }
        }, 300); // 300ms 防抖延迟
    });

    // 添加到context
    context.subscriptions.push(
        translateCommand,
        showNamingCommand,
        copyCommand,
        clearStatusBarCommand,
        toggleDebugCommand,
        selectionChangeListener,
        statusBarManager
    );
}

/**
 * 安全地获取选中的文本，包含重试机制和验证
 */
async function getSelectedTextSafely(editor: vscode.TextEditor, selection: vscode.Selection, maxRetries: number = 3): Promise<string> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // 验证选择范围是否有效
            if (selection.isEmpty) {
                console.log(`[Selection] Attempt ${attempt + 1}: Selection is empty`);
                return '';
            }

            // 获取文本
            const text = editor.document.getText(selection);
            const trimmedText = text.trim();

            // 验证获取的文本
            if (trimmedText.length === 0) {
                selectionDebugger.logTextRetrievalAttempt(attempt + 1, selection, text, false, 'Empty text after trim');
                console.log(`[Selection] Attempt ${attempt + 1}: Got empty text`);
                if (attempt < maxRetries - 1) {
                    // 短暂延迟后重试
                    await new Promise(resolve => setTimeout(resolve, 50));
                    continue;
                }
                return '';
            }

            // 检查选择范围的一致性
            const startOffset = editor.document.offsetAt(selection.start);
            const endOffset = editor.document.offsetAt(selection.end);
            const expectedLength = endOffset - startOffset;

            if (text.length !== expectedLength) {
                selectionDebugger.logTextRetrievalAttempt(attempt + 1, selection, text, false,
                    `Length mismatch: got ${text.length}, expected ${expectedLength}`);
                console.log(`[Selection] Attempt ${attempt + 1}: Length mismatch - got ${text.length}, expected ${expectedLength}`);
                if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    continue;
                }
            }

            selectionDebugger.logTextRetrievalAttempt(attempt + 1, selection, trimmedText, true);
            console.log(`[Selection] Attempt ${attempt + 1}: Successfully got text "${trimmedText}" (${trimmedText.length} chars)`);
            return trimmedText;

        } catch (error) {
            console.error(`[Selection] Attempt ${attempt + 1} failed:`, error);
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }
    }

    console.warn('[Selection] All attempts failed, returning empty string');
    return '';
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

            // 使用安全的文本获取方法
            selectedText = await getSelectedTextSafely(editor, selection);
        }

        if (!selectedText || selectedText.length === 0) {
            console.log('[Translation] No text to translate');
            return;
        }

        console.log(`[Translation] Starting translation for: "${selectedText}"`);

        // 显示加载状态
        statusBarManager.showLoading();

        // 执行翻译
        const result = await translatorService.translate(selectedText);

        // 保存最近的翻译结果
        lastTranslationResult = result;

        // 显示翻译结果
        statusBarManager.showTranslation(result);

        console.log(`[Translation] Completed: "${selectedText}" -> "${result.translatedText}"`);

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
    // 清理防抖定时器
    if (selectionDebounceTimer) {
        clearTimeout(selectionDebounceTimer);
        selectionDebounceTimer = undefined;
    }

    // 清理状态栏管理器
    if (statusBarManager) {
        statusBarManager.dispose();
    }

    console.log('English Translate extension deactivated');
}
