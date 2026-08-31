SAKO TFC website

2026-08 update
- Existing top-page design direction preserved
- NEWS removed; CMS scope assumed to be player directory only
- YOUTH renamed to JUNIOR YOUTH
- Category ages added:
  TOP: 高校生以上
  JUNIOR YOUTH: 小学6年生〜中学3年生
  JUNIOR: 小学3年生〜小学6年生
- About section town images replaced with restrained logo-based graphics
- Official supplied logo raster assets added (temporary; replace with vector later)
- Instagram positioned as latest-information channel
- LINE copy updated to include inquiries
- Contact CTA unified
- Added lower pages: top-team.html, junior-youth.html, junior.html, sponsor.html, contact.html
- Junior fees/activity and sponsor plan information supplemented from supplied materials
- Contact page currently creates an email via the user's mail application; no server-side mail endpoint is included

Temporary values to replace before production
- LINE URL: https://lin.ee/REPLACE_ME
- Supplied logo PNGs: replace with final vector assets when available

--- 2026-08-31 TOP改修 ---
- HERO直下の重複カテゴリー帯を削除。
- 「選べる3つの道」のデザインは維持し、世代を越えたクラブの説明を追記。
- 「私たちが大切にするもの」を再設計。全力 / 尊重 / 挑戦 / 感謝の内容は維持。
- オーナーセクションをブランドストーリー化し、assets/images/kariya.jpg に差し替え。
- Instagramを @sako_t_fc と @sakotfc_jr の2入口へ変更。
- LINEを「気軽な相談」、CONTACTを正式な申込・問い合わせとして役割分離。
- スポンサーは基本デザインを維持し、余白を調整。
- 最終CONTACT CTAのボタン感・hoverを強化。
- 添付ロゴをヘッダー / フッター / faviconへ反映。

[microCMS 選手名鑑]
1. microCMSに「players」API（リスト形式）を作成してください。
2. 推奨フィールドID:
   - name: テキスト
   - nickname: テキスト
   - number: テキストまたは数値
   - position: テキスト
   - height: テキストまたは数値
   - weight: テキストまたは数値
   - birthday: テキストまたは日付
   - birthplace: テキスト
   - dominantFoot: テキスト
   - career: 複数行テキスト
   - introduction: 複数行テキスト
   - image: 画像
   - showOnTop: 真偽値（TOP表示フラグ）
3. api/config.sample.php を api/config.php にコピーし、service_domain / 読み取り専用APIキーを設定してください。
4. APIキーはブラウザJSへ書かず、Xserver上の api/players.php からmicroCMSへアクセスします。
5. TOPは showOnTop=true の最大4名、players.htmlは一覧、player.html?id={contentId} は詳細表示です。

[未設定項目]
- LINE URLは現状 https://lin.ee/REPLACE_ME のままです。正式URL受領後に全ページ置換してください。

[v3 微調整 / 2026-09-01]
- 「私たちが大切にするもの」見出しサイズ・改行バランス調整
- オーナーストーリー内の強調コピーサイズ調整
- 「未来をつくるプレーヤーたち」→「栄生TFC」へ変更
- Instagram導線を、浮遊モーションなし＋円形のブランドカラー塗りつぶしホバーへ変更
- LINE見出しサイズ調整、申込経路をLINE/フォームどちらでも可とする文言へ変更
- スポンサーと最終CTAの左右分割位置を意図的に大きくずらして整理
- 追加提供写真から、TOPチーム・ジュニア・選手・スポンサー・Instagram用途に適した写真のみ採用
- 採用写真はWebP化し、彩度・コントラスト・明度をCSSでサイトトーンに統一
