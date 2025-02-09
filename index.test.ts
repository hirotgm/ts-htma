import { Htma } from "./index";

describe("Htma.compile", () => {
    it("空の文字列を渡すと空の文字列を返す", () => {
        expect(Htma.compile('')).toBe('');
    });
    it("w-html属性で要素のHTMLを置換できる", () => {
        expect(Htma.compile('<div class="test" w-html="bar">foo</div>', { bar: '<p>OK</p>' })).toBe('<div class="test"><p>OK</p></div>');
    });
    it("w-text属性で要素のテキストを置換できる", () => {
        expect(Htma.compile('<div class="test" w-text="bar">foo</div>', { bar: 'baz' })).toBe('<div class="test">baz</div>');
    });
    it("w-text属性でネストされたオブジェクトの値を参照できる", () => {
        expect(Htma.compile('<div class="test" w-text="bar.baz">foo</div>', { bar: { baz: 'qux' } })).toBe('<div class="test">qux</div>');
    });
    it("w-for属性で配列の要素を繰り返し展開できる", () => {
        expect(Htma.compile('<p class="test" w-for="bar.baz">foo</p>', { bar: { baz: ['aaa', 'bbb'] } })).toBe('<p class="test">aaa</p><p class="test">bbb</p>');
    });
    it("w-for-keyが同じ要素は最初の一つだけが展開され、残りは無視される", () => {
        expect(Htma.compile('<p class="test" w-for="bar.baz" w-for-key="same">foo</p><p class="test" w-for="bar.baz" w-for-key="same">foo</p>', { bar: { baz: ['aaa', 'bbb'] } })).toBe('<p class="test">aaa</p><p class="test">bbb</p>');
    });
    it("w-attr-nameとw-attr-textで新しい属性を追加できる", () => {
        expect(Htma.compile('<div class="test" w-attr-name="hoge" w-attr-text="bar.baz">foo</div>', { bar: { baz: 'qux' } })).toBe('<div class="test" hoge="qux">foo</div>');
    });
});
