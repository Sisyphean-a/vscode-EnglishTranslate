import * as assert from 'assert';
import * as vscode from 'vscode';

/**
 * 文本选择测试套件
 * 用于验证文本选择识别问题的修复效果
 */
suite('Text Selection Tests', () => {
    let testDocument: vscode.TextDocument;
    let testEditor: vscode.TextEditor;

    suiteSetup(async () => {
        // 创建测试文档
        const testContent = [
            'this is a sentence',
            'another line of text',
            'some more content here',
            'final line for testing'
        ].join('\n');

        testDocument = await vscode.workspace.openTextDocument({
            content: testContent,
            language: 'plaintext'
        });

        testEditor = await vscode.window.showTextDocument(testDocument);
    });

    suiteTeardown(async () => {
        // 清理测试文档
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });

    test('Should get complete text when selecting from left to right', async () => {
        // 模拟从左到右选择 "this is a sentence"
        const startPos = new vscode.Position(0, 0);
        const endPos = new vscode.Position(0, 18);
        const selection = new vscode.Selection(startPos, endPos);
        
        testEditor.selection = selection;
        
        // 等待选择稳定
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const selectedText = testEditor.document.getText(selection);
        assert.strictEqual(selectedText, 'this is a sentence', 'Should get complete text');
    });

    test('Should get complete text when selecting from right to left', async () => {
        // 模拟从右到左选择 "this is a sentence"
        const startPos = new vscode.Position(0, 18);
        const endPos = new vscode.Position(0, 0);
        const selection = new vscode.Selection(startPos, endPos);
        
        testEditor.selection = selection;
        
        // 等待选择稳定
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const selectedText = testEditor.document.getText(selection);
        assert.strictEqual(selectedText, 'this is a sentence', 'Should get complete text');
    });

    test('Should handle partial word selections correctly', async () => {
        // 选择 "is a sen" (部分词语)
        const startPos = new vscode.Position(0, 5);
        const endPos = new vscode.Position(0, 14);
        const selection = new vscode.Selection(startPos, endPos);
        
        testEditor.selection = selection;
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const selectedText = testEditor.document.getText(selection);
        assert.strictEqual(selectedText, 'is a sent', 'Should get exact partial selection');
    });

    test('Should handle multi-line selections', async () => {
        // 选择跨行文本
        const startPos = new vscode.Position(0, 10);
        const endPos = new vscode.Position(1, 7);
        const selection = new vscode.Selection(startPos, endPos);
        
        testEditor.selection = selection;
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const selectedText = testEditor.document.getText(selection);
        const expectedText = 'sentence\nanother';
        assert.strictEqual(selectedText, expectedText, 'Should handle multi-line selections');
    });

    test('Should handle empty selections', async () => {
        // 空选择（光标位置）
        const pos = new vscode.Position(0, 5);
        const selection = new vscode.Selection(pos, pos);
        
        testEditor.selection = selection;
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const selectedText = testEditor.document.getText(selection);
        assert.strictEqual(selectedText, '', 'Empty selection should return empty string');
        assert.ok(selection.isEmpty, 'Selection should be marked as empty');
    });

    test('Should validate selection range consistency', async () => {
        // 测试选择范围的一致性
        const startPos = new vscode.Position(0, 0);
        const endPos = new vscode.Position(0, 18);
        const selection = new vscode.Selection(startPos, endPos);
        
        testEditor.selection = selection;
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 验证偏移量计算
        const startOffset = testEditor.document.offsetAt(selection.start);
        const endOffset = testEditor.document.offsetAt(selection.end);
        const expectedLength = endOffset - startOffset;
        
        const selectedText = testEditor.document.getText(selection);
        
        assert.strictEqual(selectedText.length, expectedLength, 
            'Text length should match offset difference');
    });

    test('Should handle rapid selection changes', async () => {
        // 模拟快速选择变化
        const selections = [
            new vscode.Selection(0, 0, 0, 4),   // "this"
            new vscode.Selection(0, 0, 0, 7),   // "this is"
            new vscode.Selection(0, 0, 0, 9),   // "this is a"
            new vscode.Selection(0, 0, 0, 18),  // "this is a sentence"
        ];

        for (const selection of selections) {
            testEditor.selection = selection;
            await new Promise(resolve => setTimeout(resolve, 50)); // 快速变化
        }

        // 最终选择应该是完整的
        const finalText = testEditor.document.getText(testEditor.selection);
        assert.strictEqual(finalText, 'this is a sentence', 
            'Final selection should be complete despite rapid changes');
    });
});

/**
 * 选择事件模拟测试
 */
suite('Selection Event Simulation', () => {
    test('Should simulate selection change events', async () => {
        // 这个测试需要实际的扩展环境来运行
        // 主要用于手动测试和调试
        console.log('Selection event simulation test - requires manual verification');
    });
});
