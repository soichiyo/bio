# Dynamic Animations Design Spec

ポートフォリオサイトにFramer Motion（`motion`パッケージ）によるアニメーションを追加し、「只者じゃない感」と「情報の受け取りやすさ」を両立する。

## 依存パッケージ

- `motion`（`motion/react`からimport）— 旧`framer-motion`ではなく新パッケージ
- React 19 + Next.js 15 App Router互換

## コンポーネント設計

### 新規ファイル

```
components/
  ├── ProfileHeader.tsx           — "use client" / app/page.tsxから関数を抽出
  └── animations/
        ├── MotionProvider.tsx     — MotionConfig reducedMotion="user"
        ├── ScrollReveal.tsx      — スクロールrevealラッパー
        ├── StaggerChildren.tsx   — 子要素スタガーラッパー
        └── CharacterReveal.tsx   — テキスト1文字ずつアニメーション
```

### MotionProvider.tsx

- `"use client"` / `MotionConfig reducedMotion="user"` を設定
- `app/layout.tsx` の `<body>` 直下に配置
- `prefers-reduced-motion` 対応はこれで一括管理

### ProfileHeader.tsx

- `app/page.tsx:20-68` の `ProfileHeader` 関数を別ファイルに抽出
- `"use client"` を付与
- `app/page.tsx` は Server Component のまま維持

内部アニメーション：
- **アバター**: `motion.div` で `scale: [0, 1]` pop-in（duration: 0.5s, ease: backOut）
- **名前**: `CharacterReveal` で1文字ずつ打ち出し（stagger: 0.04s, duration: 0.3s）
- **肩書き・location**: `motion.p` で opacity + translateY fade-in（delay: 名前完了後）
- **説明文**: 同上、さらにdelay
- **ChatButton**: fade-in
- **SNSリンク**: `StaggerChildren` で1つずつ fade-in

### ScrollReveal.tsx

- `"use client"` / `useInView` フック使用
- Props: `children`, `className?`, `once?: boolean`（default: true）, `amount?: number`（default: 0.2）
- アニメーション: `opacity: 0→1`, `y: 16→0`（控えめ）
- duration: 0.5s, ease: easeOut

### StaggerChildren.tsx

- `"use client"` / `motion.div` + `variants`
- Props: `children`, `className?`, `staggerDelay?: number`（default: 0.05s）
- 親: `variants={{ visible: { transition: { staggerChildren } } }}`
- 子: `variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}`

### CharacterReveal.tsx

- `"use client"`
- Props: `text: string`, `className?`, `delay?: number`（default: 0）
- `text.split("")` → 各文字を `motion.span` でラップ
- variants: `hidden: { opacity: 0, y: 10 }` → `visible: { opacity: 1, y: 0 }`
- staggerChildren: 0.04s
- カーソル表現: 最後の文字の後に `|` を点滅（CSS animation）、2秒後にフェードアウト

## セクション別アニメーションマップ

| セクション | アニメーション | 強度 |
|---|---|---|
| **ProfileHeader** | CharacterReveal + Avatar pop-in + FadeIn stagger | ★★★ 強 |
| Work Experience | `<ScrollReveal>` で囲む。内部カードは `<StaggerChildren>` | ★ 控えめ |
| Projects | `<ScrollReveal>` + 各カードに `whileHover={{ y: -4, shadow }}` | ★ 控えめ |
| Skills | `<ScrollReveal>` + `<StaggerChildren>` でChipをポップイン | ★★ やや強 |
| Expertise | `<ScrollReveal>` のみ | ★ 控えめ |
| Personality | `<ScrollReveal>` のみ | ★ 控えめ |
| **Gallery** | `<ScrollReveal>` + 各写真に個別 fade-in（masonry内側wrapper） | ★★ やや強 |
| Hobbies | `<ScrollReveal>` + `<StaggerChildren>` でChipをポップイン | ★★ やや強 |
| Credentials | `<ScrollReveal>` のみ | ★ 控えめ |
| My Family | `<ScrollReveal>` + カードの `<StaggerChildren>` | ★ 控えめ |
| Contact | `<ScrollReveal>` のみ | ★ 控えめ |

## 既存CSSとの整合

以下の既存hover/transitionはMotion導入時に整理が必要：

| ファイル | 既存クラス | 対応 |
|---|---|---|
| `Chip.tsx` | `hover:scale-105 transition-all duration-200 hover:shadow-md` | Motion の `whileHover` に置き換え **しない**。Chipは既存のCSS hoverをそのまま残す。StaggerChildrenはスクロール登場時のみ。 |
| `ProjectsSection.tsx` | `hover:bg-accent/50 transition-all duration-200` | `whileHover={{ y: -4 }}` を追加。既存の `hover:bg-accent/50` は残す。`transition-all` は `transition-colors` に変更（transformの競合を避ける）。 |
| `PhotoGallery.tsx` | `hover:opacity-80 transition-opacity` | そのまま残す。reveal は画像の外側wrapperに `<ScrollReveal>` で掛ける。 |
| `ProjectCard.tsx` | `transition-colors` 各所 | そのまま残す。競合なし。 |

## Gallery特記事項

- `react-masonry-css` のコンテナにはアニメーションを掛けない
- 各画像を `motion.div` でラップし、`useInView` で個別にfade-in
- masonry の列計算を狂わせないため、初期状態で `opacity: 0` のみ。`transform` は使わない（高さ変化を避ける）

## アクセシビリティ

- `MotionProvider` の `reducedMotion="user"` で `prefers-reduced-motion: reduce` 時は全アニメーション自動スキップ
- `CharacterReveal` は `aria-label` に完全なテキストを設定し、各文字の `motion.span` は `aria-hidden="true"`
- セマンティックHTML構造（`main`, `header`, `section`, `h1`, `h2`, `footer`）は変更しない

## パフォーマンス

- `motion` パッケージのバンドルサイズ: ~32KB gzip
- `ScrollReveal` は `once: true` がデフォルト（一度表示されたら再アニメーションしない）
- `useInView` の `amount: 0.2`（要素の20%が見えたら発火）
- `layoutId` や shared layout animation は使用しない（Next.js App Router との不具合回避）
- `page.tsx` は Server Component のまま。Client 境界は `ProfileHeader` と各 animation component に限定

## スコープ外

- ページ遷移アニメーション
- セクション背景色の切り替え（将来の拡張候補）
- WebGL / Three.js（将来の拡張候補）
- レイアウト変更（`max-w-3xl` 1カラム構成は維持）
