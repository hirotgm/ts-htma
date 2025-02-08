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
        const $ = cheerio.load(html, { xmlMode: true });

        // Replace text content using w-text
        $('*[w-text]').each((_, element) => {
            const key = $(element).attr('w-text') as string;
            const value = getValue(data, key);
            $(element).text(value);
            $(element).removeAttr('w-text');
        });

        // Add new attribute using w-attr-name and w-attr-text
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

        // Repeat elements using w-for
        const processedForKeys = new Set<string>();
        $('*[w-for]').each((_, element) => {
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
                const parentClone = $el.clone();
                parentClone.removeAttr('w-for');
                parentClone.removeAttr('w-for-key');
                
                for (const v of values.reverse()) {
                    const childClone = parentClone.clone();
                    childClone.text(v);
                    $el.after(childClone);
                }
            }
            $el.remove();
        });

        return $.html();
    }
}
