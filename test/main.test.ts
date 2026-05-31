import {describe, expect, test} from 'bun:test'

const {SvgMaker, default: shapeToSvg} = await import('#src/main.ts')
describe('shapeToSvg', () => {
  test('renders a square SVG with the default size and color', () => {
    const result = shapeToSvg('0 0H10V10H0Z')
    expect(result).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 960"><path d="M0 0H10V10H0Z" fill="currentColor"/></svg>')
  })
  test('renders a custom rectangular viewBox with a static color', () => {
    const result = shapeToSvg({
      color: '#ff0066',
      height: 32,
      path: 'M2 2H30V30H2Z',
      width: 64,
    })
    expect(result).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 32"><path d="M2 2H30V30H2Z" fill="#ff0066"/></svg>')
  })
  test('renders themed SVG output that switches colors with prefers-color-scheme', () => {
    const result = shapeToSvg({
      color: {
        onDark: '#fafafa',
        onLight: '#141414',
      },
      path: '0 0H16V16H0Z',
      size: 16,
    })
    expect(result).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><style>path[data-color-mode="dark"]{display:none}@media (prefers-color-scheme: dark){path[data-color-mode="light"]{display:none}path[data-color-mode="dark"]{display:inline}}</style><path data-color-mode="light" d="M0 0H16V16H0Z" fill="#141414"/><path data-color-mode="dark" d="M0 0H16V16H0Z" fill="#fafafa"/></svg>')
  })
  test('uses an explicit viewbox string unchanged', () => {
    const result = shapeToSvg({
      color: '#00ccff',
      path: '0 0H1V1H0Z',
      viewbox: '-8 -4 16 8',
    })
    expect(result).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -4 16 8"><path d="M0 0H1V1H0Z" fill="#00ccff"/></svg>')
  })
  test('uses constructor defaults for color and viewBox', () => {
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
    const result = maker.make('0 0H48V24H0Z')
    expect(result).toBe('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 24"><style>path[data-color-mode="dark"]{display:none}@media (prefers-color-scheme: dark){path[data-color-mode="light"]{display:none}path[data-color-mode="dark"]{display:inline}}</style><path data-color-mode="light" d="M0 0H48V24H0Z" fill="#000000"/><path data-color-mode="dark" d="M0 0H48V24H0Z" fill="#ffffff"/></svg>')
  })
  test('throws on incomplete rectangular size options', () => {
    expect(() => shapeToSvg({
      path: '0 0H10V10H0Z',
      width: 10,
    } as never)).toThrow('height')
  })
})
