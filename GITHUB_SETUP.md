# GitHubリポジトリ作成手順

## 1. GitHubでリポジトリを作成

1. https://github.com にアクセスしてログイン
2. 右上の「+」→「New repository」をクリック
3. 以下の設定を入力：
   - **Repository name**: `ubi-calculator`
   - **Description**: `AI時代におけるUBI実現可能性シミュレーター - 動的社会維持コストモデル`
   - **Public/Private**: Public（推奨）
   - **Initialize this repository with**: チェックを入れない（空のリポジトリを作成）
4. 「Create repository」をクリック

## 2. ローカルでGitリポジトリを初期化

```bash
cd /home/ubuntu/github-repo

# Gitリポジトリを初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: UBI実現可能性シミュレーター"

# リモートリポジトリを追加（[username]を自分のGitHubユーザー名に置き換え）
git remote add origin https://github.com/[username]/ubi-calculator.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

## 3. アプリのソースコードを追加（オプション）

アプリのソースコードも公開する場合：

```bash
# アプリディレクトリをコピー
cp -r /home/ubuntu/ubi-calculator ./app

# .gitignoreを作成
cat > .gitignore << 'EOF'
# Node modules
node_modules/
.expo/
.expo-shared/

# Environment variables
.env
.env.local

# Build outputs
dist/
build/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
EOF

# コミットしてプッシュ
git add .
git commit -m "Add mobile app source code"
git push
```

## 4. GitHubリポジトリのURLを確認

リポジトリ作成後、以下のURLが確定します：

```
https://github.com/[username]/ubi-calculator
```

このURLを論文に記載してください。

## 5. 論文を更新

論文の以下の箇所を更新：

### 4.1 モデルの実装
```markdown
**GitHubリポジトリ**: https://github.com/[username]/ubi-calculator
```

### 6. 結論
```markdown
GitHubリポジトリ：https://github.com/[username]/ubi-calculator
```

## 6. README.mdを更新

GitHub上でREADME.mdの以下の箇所を更新：

- `[username]` を実際のGitHubユーザー名に置き換え
- SSRN URLが確定したら追加

## トラブルシューティング

### 認証エラーが出る場合

Personal Access Token（PAT）を使用：

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 「Generate new token」をクリック
3. `repo`にチェックを入れて生成
4. トークンをコピー
5. `git push`時にパスワードの代わりにトークンを入力

### リポジトリ名を変更したい場合

GitHub上でリポジトリの Settings → General → Repository name から変更可能。

---

**次のステップ**: リポジトリ作成後、URLを教えていただければ論文を更新します。
