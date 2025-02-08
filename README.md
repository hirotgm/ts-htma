# htma

シンプルなHTMLテンプレートエンジン。属性を使用してテキストの置換、属性の追加、リストの展開などができます。

## 設定

```bash
# パッケージのインストール
pnpm install

# テストの実行
pnpm test

# テストの監視モード
pnpm test:watch
```

## 使い方

### テキストコンテンツの置換

`w-text`属性を使用して、要素のテキストコンテンツを置換できます：

```html
<div w-text="user.name">loading...</div>
```

```javascript
Htma.compile(template, { user: { name: "John" } })
// 結果: <div>John</div>
```

### 属性の追加

`w-attr-name`と`w-attr-text`属性を組み合わせて、新しい属性を追加できます：

```html
<input w-attr-name="value" w-attr-text="user.email">
```

```javascript
Htma.compile(template, { user: { email: "john@example.com" } })
// 結果: <input value="john@example.com">
```

### リストの展開

`w-for`属性を使用して、配列の要素を繰り返し展開できます：

```html
<ul>
  <li w-for="users">loading...</li>
</ul>
```

```javascript
Htma.compile(template, { users: ["John", "Jane", "Bob"] })
// 結果:
// <ul>
//   <li>John</li>
//   <li>Jane</li>
//   <li>Bob</li>
// </ul>
```

#### 重複要素の制御

`w-for-key`属性を使用して、同じキーを持つ要素の展開を制御できます：

```html
<div>
  <p w-for="users" w-for-key="userList">loading...</p>
  <p w-for="users" w-for-key="userList">ignored</p>
</div>
```

```javascript
Htma.compile(template, { users: ["John", "Jane"] })
// 結果:
// <div>
//   <p>John</p>
//   <p>Jane</p>
// </div>
```

### ネストされたデータの参照

ドット記法を使用して、ネストされたオブジェクトの値を参照できます：

```html
<div w-text="user.profile.bio">loading...</div>
```

```javascript
Htma.compile(template, { user: { profile: { bio: "Hello!" } } })
// 結果: <div>Hello!</div>
```
