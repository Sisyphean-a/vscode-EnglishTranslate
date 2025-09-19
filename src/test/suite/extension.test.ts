import * as assert from 'assert';
import * as vscode from 'vscode';
import { TranslatorService } from '../../translator';
import { NameGenerator } from '../../nameGenerator';
import { LanguageDetector } from '../../utils/languageDetector';
import { TextProcessor } from '../../utils/textProcessor';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Language Detection Test', () => {
        const detector = new LanguageDetector();
        
        // 测试中文检测
        assert.strictEqual(detector.detectLanguage('你好世界'), 'zh');
        assert.strictEqual(detector.detectLanguage('用户信息'), 'zh');
        
        // 测试英文检测
        assert.strictEqual(detector.detectLanguage('hello world'), 'en');
        assert.strictEqual(detector.detectLanguage('user info'), 'en');
        
        // 测试空字符串
        assert.strictEqual(detector.detectLanguage(''), 'en');
        assert.strictEqual(detector.detectLanguage('   '), 'en');
    });

    test('Text Processor Test', () => {
        // 测试文本清理
        assert.strictEqual(TextProcessor.cleanText('  hello   world  '), 'hello world');
        assert.strictEqual(TextProcessor.cleanText('hello\nworld\t'), 'hello world');
        
        // 测试翻译适用性检查
        assert.strictEqual(TextProcessor.isTranslatable('hello'), true);
        assert.strictEqual(TextProcessor.isTranslatable(''), false);
        assert.strictEqual(TextProcessor.isTranslatable('123'), false);
        
        // 测试复合词分割
        const words = TextProcessor.splitCompoundWord('getUserInfo');
        assert.deepStrictEqual(words, ['get', 'user', 'info']);
        
        const words2 = TextProcessor.splitCompoundWord('user_name');
        assert.deepStrictEqual(words2, ['user', 'name']);
    });

    test('Name Generator Test', () => {
        const generator = new NameGenerator();
        const options = generator.generateNamingOptions('user info');
        
        // 检查是否生成了所有命名格式
        assert.strictEqual(options.length, 5);
        
        const formats = options.map(option => option.format);
        assert.ok(formats.includes('camelCase'));
        assert.ok(formats.includes('PascalCase'));
        assert.ok(formats.includes('snake_case'));
        assert.ok(formats.includes('CONSTANT_CASE'));
        assert.ok(formats.includes('kebab-case'));
        
        // 检查具体的命名结果
        const camelCaseOption = options.find(option => option.format === 'camelCase');
        assert.strictEqual(camelCaseOption?.example, 'userInfo');
        
        const snakeCaseOption = options.find(option => option.format === 'snake_case');
        assert.strictEqual(snakeCaseOption?.example, 'user_info');
    });

    test('Translator Service Cache Test', () => {
        const translator = new TranslatorService();
        
        // 测试缓存清理
        translator.clearCache();
        
        // 这里可以添加更多的翻译服务测试
        // 但由于需要网络请求，在单元测试中可能不太合适
    });

    test('Programming Keywords Test', () => {
        // 测试编程关键字检测
        assert.strictEqual(TextProcessor.isProgrammingKeyword('function'), true);
        assert.strictEqual(TextProcessor.isProgrammingKeyword('class'), true);
        assert.strictEqual(TextProcessor.isProgrammingKeyword('if'), true);
        assert.strictEqual(TextProcessor.isProgrammingKeyword('userInfo'), false);
        assert.strictEqual(TextProcessor.isProgrammingKeyword('hello'), false);
    });

    test('Text Preview Test', () => {
        // 测试文本预览功能
        const shortText = 'hello';
        assert.strictEqual(TextProcessor.getPreview(shortText, 10), 'hello');
        
        const longText = 'this is a very long text that should be truncated';
        const preview = TextProcessor.getPreview(longText, 20);
        assert.ok(preview.length <= 20);
        assert.ok(preview.endsWith('...'));
    });
});
