import * as vscode from 'vscode';
import { NamingOption } from '../nameGenerator';

export class NamingPanel {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    async show(namingOptions: NamingOption[]): Promise<void> {
        if (!namingOptions || namingOptions.length === 0) {
            vscode.window.showInformationMessage('没有可用的命名建议');
            return;
        }

        // 创建QuickPick项目
        const quickPickItems: NamingQuickPickItem[] = namingOptions.map(option => ({
            label: option.example,
            description: '',
            detail: '',
            namingOption: option
        }));

        // 显示QuickPick
        const quickPick = vscode.window.createQuickPick<NamingQuickPickItem>();
        quickPick.title = '命名格式';
        quickPick.placeholder = '选择复制到剪贴板';
        quickPick.items = quickPickItems;
        quickPick.canSelectMany = false;

        // 添加按钮
        quickPick.buttons = [
            {
                iconPath: new vscode.ThemeIcon('copy'),
                tooltip: '复制所有格式'
            },
            {
                iconPath: new vscode.ThemeIcon('insert'),
                tooltip: '插入到光标位置'
            }
        ];

        quickPick.onDidChangeSelection(async (items) => {
            if (items.length > 0) {
                const selectedItem = items[0];
                await this.copyToClipboard(selectedItem.namingOption.example);
                quickPick.hide();
            }
        });

        quickPick.onDidTriggerButton(async (button) => {
            if (button.tooltip === '复制所有格式') {
                await this.copyAllFormats(namingOptions);
            } else if (button.tooltip === '插入到光标位置') {
                await this.showInsertOptions(namingOptions);
            }
        });

        quickPick.onDidHide(() => {
            quickPick.dispose();
        });

        quickPick.show();
    }

    private async copyToClipboard(text: string): Promise<void> {
        try {
            await vscode.env.clipboard.writeText(text);
            vscode.window.showInformationMessage(`已复制: ${text}`);
        } catch (error) {
            vscode.window.showErrorMessage('复制失败');
        }
    }

    private async copyAllFormats(namingOptions: NamingOption[]): Promise<void> {
        const allFormats = namingOptions.map(option => 
            `${option.format}: ${option.example}`
        ).join('\n');

        try {
            await vscode.env.clipboard.writeText(allFormats);
            vscode.window.showInformationMessage('已复制所有命名格式');
        } catch (error) {
            vscode.window.showErrorMessage('复制失败');
        }
    }

    private async showInsertOptions(namingOptions: NamingOption[]): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('没有活动的编辑器');
            return;
        }

        // 创建插入选项的QuickPick
        const insertItems: NamingQuickPickItem[] = namingOptions.map(option => ({
            label: `${option.icon} 插入 ${option.example}`,
            description: option.format,
            detail: option.description,
            namingOption: option
        }));

        const selected = await vscode.window.showQuickPick(insertItems, {
            title: '选择要插入的命名格式',
            placeHolder: '选择一个格式插入到光标位置'
        });

        if (selected) {
            await this.insertAtCursor(selected.namingOption.example);
        }
    }

    private async insertAtCursor(text: string): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const position = editor.selection.active;
        
        try {
            await editor.edit(editBuilder => {
                editBuilder.insert(position, text);
            });
            
            vscode.window.showInformationMessage(`已插入: ${text}`);
        } catch (error) {
            vscode.window.showErrorMessage('插入失败');
        }
    }

    async showContextMenu(namingOptions: NamingOption[], position: vscode.Position): Promise<void> {
        // 创建上下文菜单项
        const menuItems = namingOptions.map(option => ({
            label: `复制 ${option.format}`,
            description: option.example,
            action: () => this.copyToClipboard(option.example)
        }));

        // 添加分隔符和额外选项
        menuItems.push(
            { label: '$(dash)', description: '', action: async () => {} }, // 分隔符
            {
                label: '复制所有格式',
                description: '复制所有命名格式到剪贴板',
                action: () => this.copyAllFormats(namingOptions)
            }
        );

        const selected = await vscode.window.showQuickPick(menuItems, {
            title: '命名格式选项',
            placeHolder: '选择一个操作'
        });

        if (selected && selected.action) {
            await selected.action();
        }
    }

    /**
     * 显示命名建议的悬停提示
     */
    async showHoverInfo(namingOptions: NamingOption[]): Promise<void> {
        if (namingOptions.length === 0) {
            return;
        }

        const hoverContent = new vscode.MarkdownString();
        hoverContent.appendMarkdown('### 命名建议\n\n');
        
        namingOptions.forEach(option => {
            hoverContent.appendMarkdown(`**${option.format}**: \`${option.example}\`\n\n`);
            hoverContent.appendMarkdown(`${option.description}\n\n`);
        });

        hoverContent.appendMarkdown('---\n\n');
        hoverContent.appendMarkdown('点击状态栏查看更多选项');

        // 这里可以扩展为实际的悬停提供器
        // 目前作为信息消息显示
        const message = namingOptions.map(option => 
            `${option.format}: ${option.example}`
        ).join(' | ');
        
        vscode.window.showInformationMessage(message);
    }
}

interface NamingQuickPickItem extends vscode.QuickPickItem {
    namingOption: NamingOption;
}
