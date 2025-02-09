import * as cheerio from 'cheerio';

// Get nested object value using dot notation (e.g., "user.name" -> data.user.name)
const getValue = (data: any, at: string) => {
    let value = data;
    const keys = at.split('.');
    for (const k of keys) {
        value = value[k];
    }
    return value;
}

// Convert non-array value to array
const getValues = (data: any, at: string) => {
    let values = getValue(data, at);
    values = Array.isArray(values) ? values : [values];
    return values;
}

export const Htma = {
    compile: (html: string, data: any = {}) => {
        data = data || {};

        // Process w-for recursively
        const processTemplate = (template: string, data: any): string => {
            const $ = cheerio.load(template, { xmlMode: true });

            // Process w-html attributes
            $('*[w-html]').each((_, element) => {
                const key = $(element).attr('w-html') as string;
                const value = getValue(data, key);
                $(element).html(value);
                $(element).removeAttr('w-html');
            });

            // Process w-text attributes
            $('*[w-text]').each((_, element) => {
                const key = $(element).attr('w-text') as string;
                const value = getValue(data, key);
                $(element).text(value);
                $(element).removeAttr('w-text');
            });

            // Process w-attr attributes
            $('*[w-attr-name]').each((_, element) => {
                const $el = $(element);
                const attrKey = $el.attr('w-attr-name');
                const attrText = $el.attr('w-attr-text');
                if (attrKey && attrText) {
                    const value = getValue(data, attrText);
                    $el.attr(attrKey, value);
                    $el.removeAttr('w-attr-name');
                    $el.removeAttr('w-attr-text');
                }
            });

            // Process w-for elements
            const processedForKeys = new Set<string>();
            let hasForElements = false;

            $('*[w-for]').each((_, element) => {
                hasForElements = true;
                const $el = $(element);
                const key = $el.attr('w-for') as string;
                const forKey = $el.attr('w-for-key');

                if (forKey && processedForKeys.has(forKey)) {
                    $el.remove();
                    return;
                }
                if (forKey) {
                    processedForKeys.add(forKey);
                }

                let values = getValues(data, key);
                if (Array.isArray(values)) {
                    const template = $el.clone();
                    template.removeAttr('w-for');
                    template.removeAttr('w-for-key');

                    const results: string[] = [];
                    for (const v of values) {
                        const $clone = template.clone();
                        $clone.text(v);
                        results.push($.html($clone));
                    }
                    $el.replaceWith(results.join(''));
                }
            });

            // If there are still w-for elements, process them again
            if (hasForElements) {
                return processTemplate($.html(), data);
            }

            return $.html();
        };

        return processTemplate(html, data);
    }
}
