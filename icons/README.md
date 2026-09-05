# Icons

MimikkAI Editor logo — a nested double-M monogram derived from the mimikkai-platform brand mark.

## Files

| filename                  | color  | width | border |
| ------------------------- | ------ | ----- | ------ |
| `codium_clt.svg`          | light (monochrome, inherits fill) | | |
| `codium_cnl.svg`          | normal (gradient: stable `#62A0EA→#1A5FB4`, insider `#FFA348→#C64600`) | | |
| `codium_cnl_w80_b8.svg`   | normal | 80%   | 8pt    |

All variants share the same geometry: a 32×30 double-M path scaled to a 100×100 viewBox.

- `codium_cnl.svg` — full-bleed brand icon (app icons, tiles, installer banners).
- `codium_clt.svg` — flat monochrome mark used for `code-icon.svg` (workbench media) and `letterpress-*.svg` (empty-editor watermark).
- `codium_cnl_w80_b8.svg` — inset variant for small contexts that need padding.

## Regenerating build resources

`build_icons.sh` derives all binary assets (`.ico`, `.icns`, `.png`, `.xpm`, `.bmp`) from these SVGs into `src/<quality>/resources/**` and `build/windows/msi/resources/<quality>/`.

Requirements: `rsvg-convert`, ImageMagick (`magick`), Python 3 with `pillow` (for multi-resolution ICO/ICNS assembly; `icotool`/`png2icns` optional).
