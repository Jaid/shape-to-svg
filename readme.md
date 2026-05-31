# shape-to-svg

Turn SVG path data into a complete `<svg>` string.

## Install

```sh
bun add shape-to-svg
```

## Usage

```ts
import shapeToSvg from 'shape-to-svg'

const svg = shapeToSvg({
  color: 'currentColor',
  path: '0 0H24V24H0Z',
  size: 24,
})
```

This returns:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0H24V24H0Z" fill="currentColor"/></svg>
```

If the path does not start with `M` or `m`, it is prefixed automatically.

## Themed colors

You can generate SVGs that switch between light and dark colors using `prefers-color-scheme`:

```ts
const svg = shapeToSvg({
  color: {
    onDark: '#fafafa',
    onLight: '#141414',
  },
  path: '0 0H24V24H0Z',
  size: 24,
})
```

## Options

### Input

You can pass either a path string or an options object.

```ts
shapeToSvg('0 0H24V24H0Z')
```

```ts
shapeToSvg({
  color: 'currentColor',
  path: '0 0H24V24H0Z',
  size: 24,
})
```

### Size modes

Exactly one of these size modes can be used:

- `size: number`
- `width: number` together with `height: number`
- `viewbox: string`

If omitted, the default viewBox is `0 0 960 960`.

### Color modes

- `color: string`
- `color: {onLight: string, onDark: string}`

If omitted, the default color is `currentColor`.

## Advanced usage

The package also exports `SvgMaker` if you want reusable defaults:

```ts
import {SvgMaker} from 'shape-to-svg'

const maker = new SvgMaker({
  defaultColor: {
    onDark: '#ffffff',
    onLight: '#000000',
  },
  defaultSize: {
    width: 48,
    height: 24,
  },
})

const svg = maker.make('0 0H48V24H0Z')
```
