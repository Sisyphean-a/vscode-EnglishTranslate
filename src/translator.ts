import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';
import { LanguageDetector } from './utils/languageDetector';
import { TextProcessor } from './utils/textProcessor';

export interface TranslationResult {
    originalText: string;
    translatedText: string;
    sourceLanguage: string;
    targetLanguage: string;
}

export class TranslatorService {
    private languageDetector: LanguageDetector;
    private cache: Map<string, TranslationResult> = new Map();

    constructor() {
        this.languageDetector = new LanguageDetector();
    }

    async translate(text: string): Promise<TranslationResult> {
        // 检查缓存
        const cacheKey = text.toLowerCase().trim();
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)!;
        }

        // 检测语言
        const sourceLanguage = this.languageDetector.detectLanguage(text);
        const targetLanguage = sourceLanguage === 'zh' ? 'en' : 'zh';

        // 如果检测到的语言和目标语言相同，直接返回
        if (sourceLanguage === targetLanguage) {
            const result: TranslationResult = {
                originalText: text,
                translatedText: text,
                sourceLanguage,
                targetLanguage
            };
            return result;
        }

        try {
            // 预处理复合词（如驼峰命名、下划线命名等）
            let textToTranslate = text;
            if (sourceLanguage === 'en') {
                textToTranslate = TextProcessor.prepareCompoundWordForTranslation(text);
            }

            // 调用翻译API
            const translatedText = await this.callGoogleTranslateAPI(textToTranslate, sourceLanguage, targetLanguage);

            const result: TranslationResult = {
                originalText: text,
                translatedText,
                sourceLanguage,
                targetLanguage
            };

            // 缓存结果
            this.cache.set(cacheKey, result);

            // 限制缓存大小
            if (this.cache.size > 100) {
                const firstKey = this.cache.keys().next().value;
                this.cache.delete(firstKey);
            }

            return result;
        } catch (error) {
            console.error('Translation API error:', error);
            throw new Error('翻译服务暂时不可用');
        }
    }

    private async callGoogleTranslateAPI(text: string, from: string, to: string): Promise<string> {
        const baseUrl = 'https://translate.googleapis.com/translate_a/single';

        const params = new URLSearchParams({
            client: 'gtx',
            sl: from,
            tl: to,
            dt: 't',
            ie: 'UTF-8',
            oe: 'UTF-8',
            dj: '1',
            q: text
        });

        const url = `${baseUrl}?${params.toString()}`;

        try {
            const response = await this.makeHttpRequest(url);
            const data = JSON.parse(response);

            if (data && data.sentences && data.sentences.length > 0) {
                return data.sentences.map((s: any) => s.trans).join('');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Google Translate API error:', error);

            // 如果Google翻译失败，尝试备用方案
            return await this.fallbackTranslate(text, from, to);
        }
    }

    private makeHttpRequest(url: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const options = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || 443,
                path: parsedUrl.pathname + parsedUrl.search,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    private async fallbackTranslate(text: string, from: string, to: string): Promise<string> {
        // 简单的备用翻译逻辑
        // 在实际应用中，这里可以集成其他翻译服务
        
        // 如果是简单的英文单词，尝试基本的词汇映射
        if (from === 'en' && to === 'zh') {
            const basicDict: { [key: string]: string } = {
                'hello': '你好',
                'world': '世界',
                'user': '用户',
                'name': '名称',
                'password': '密码',
                'email': '邮箱',
                'phone': '电话',
                'address': '地址',
                'button': '按钮',
                'input': '输入',
                'output': '输出',
                'function': '函数',
                'class': '类',
                'method': '方法',
                'variable': '变量',
                'constant': '常量',
                'array': '数组',
                'object': '对象',
                'string': '字符串',
                'number': '数字',
                'boolean': '布尔值',
                'null': '空值',
                'undefined': '未定义',
                'true': '真',
                'false': '假'
            };
            
            const lowerText = text.toLowerCase();
            if (basicDict[lowerText]) {
                return basicDict[lowerText];
            }
        }

        // 如果没有找到映射，返回原文
        return text;
    }

    clearCache(): void {
        this.cache.clear();
    }
}
