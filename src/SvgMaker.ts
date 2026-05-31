export type ViewboxSquareOptions = {
  height?: never
  size: number
  viewbox?: never
  width?: never
}

export type ViewboxRectOptions = {
  height: number
  size?: never
  viewbox?: never
  width: number
}

export type ViewboxFullOptions = {
  height?: never
  size?: never
  viewbox: string
  width?: never
}

export type ViewboxOptions = ViewboxDefaultOptions | ViewboxFullOptions | ViewboxRectOptions | ViewboxSquareOptions

export type ColorStaticOptions = {
  color: string
}

export type ThemedColor = {
  onDark: string
  onLight: string
}

export type ColorThemedOptions = {
  color: ThemedColor
}

export type ColorOptions = ColorDefaultOptions | ColorStaticOptions | ColorThemedOptions

export type Options = {
  path: string
} & ViewboxOptions & ColorOptions

export type InputOptions = Options | string

export type ConstructorOptions = {
  defaultColor: ColorStaticOptions['color'] | ColorThemedOptions['color']
  defaultSize: ViewboxFullOptions | ViewboxRectOptions | ViewboxSquareOptions['size']
}

type ViewboxDefaultOptions = {
  height?: undefined
  size?: undefined
  viewbox?: undefined
  width?: undefined
}

type ColorDefaultOptions = {
  color?: undefined
}

type NormalizedInput = {
  color: ConstructorOptions['defaultColor']
  path: string
  viewbox: string
}

const svgNamespace = 'http://www.w3.org/2000/svg'
const escapeSvgAttribute = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
const isRecord = (value: unknown): value is Record<string, unknown> => {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
const normalizeNonEmptyString = (value: unknown, fieldName: string) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Option “${fieldName}” must be a string.`)
  }
  const normalizedValue = value.trim()
  if (!normalizedValue) {
    throw new TypeError(`Option “${fieldName}” must be a non-empty string.`)
  }
  return normalizedValue
}
const normalizePositiveNumber = (value: unknown, fieldName: string) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new TypeError(`Option “${fieldName}” must be a positive finite number.`)
  }
  return value
}
const makeViewbox = (width: number, height: number) => {
  return `0 0 ${width} ${height}`
}
const normalizePath = (value: unknown) => {
  const normalizedValue = normalizeNonEmptyString(value, 'path')
  if (/^[Mm]/.test(normalizedValue)) {
    return normalizedValue
  }
  return `M${normalizedValue}`
}
const normalizeColor = (value: unknown, fieldName: string): ConstructorOptions['defaultColor'] => {
  if (typeof value === 'string') {
    return normalizeNonEmptyString(value, fieldName)
  }
  if (!isRecord(value)) {
    throw new TypeError(`Option “${fieldName}” must be a string or a {onDark, onLight} object.`)
  }
  return {
    onDark: normalizeNonEmptyString(value.onDark, `${fieldName}.onDark`),
    onLight: normalizeNonEmptyString(value.onLight, `${fieldName}.onLight`),
  }
}
const freezeColor = (value: ConstructorOptions['defaultColor']): ConstructorOptions['defaultColor'] => {
  if (typeof value === 'string') {
    return value
  }
  return Object.freeze(value)
}
const normalizeDefaultSize = (value: unknown): ConstructorOptions['defaultSize'] => {
  if (typeof value === 'number') {
    return normalizePositiveNumber(value, 'defaultSize')
  }
  if (!isRecord(value)) {
    throw new TypeError('Option “defaultSize” must be a positive finite number, a non-empty “viewbox” string or an object with positive “width” and “height” numbers.')
  }
  const hasViewbox = Object.hasOwn(value, 'viewbox')
  const hasSize = Object.hasOwn(value, 'size')
  const hasRect = Object.hasOwn(value, 'width') || Object.hasOwn(value, 'height')
  const explicitModeCount = Number(hasViewbox) + Number(hasSize) + Number(hasRect)
  if (explicitModeCount !== 1) {
    throw new TypeError('Option “defaultSize” must define exactly one size mode: a number, a “viewbox” string or a “width” + “height” pair.')
  }
  if (hasViewbox) {
    return {
      viewbox: normalizeNonEmptyString(value.viewbox, 'defaultSize.viewbox'),
    }
  }
  if (hasSize) {
    return normalizePositiveNumber(value.size, 'defaultSize.size')
  }
  return {
    width: normalizePositiveNumber(value.width, 'defaultSize.width'),
    height: normalizePositiveNumber(value.height, 'defaultSize.height'),
  }
}
const freezeDefaultSize = (value: ConstructorOptions['defaultSize']): ConstructorOptions['defaultSize'] => {
  if (typeof value === 'number') {
    return value
  }
  return Object.freeze(value)
}
const resolveDefaultViewbox = (value: ConstructorOptions['defaultSize']): string => {
  if (typeof value === 'number') {
    return makeViewbox(value, value)
  }
  if (Object.hasOwn(value, 'viewbox')) {
    return normalizeNonEmptyString(value.viewbox, 'defaultSize.viewbox')
  }
  return makeViewbox(normalizePositiveNumber(value.width, 'defaultSize.width'), normalizePositiveNumber(value.height, 'defaultSize.height'))
}
const resolveInputViewbox = (options: Record<string, unknown>, fallbackViewbox: string) => {
  const hasViewbox = Object.hasOwn(options, 'viewbox')
  const hasSize = Object.hasOwn(options, 'size')
  const hasRect = Object.hasOwn(options, 'width') || Object.hasOwn(options, 'height')
  const explicitModeCount = Number(hasViewbox) + Number(hasSize) + Number(hasRect)
  if (explicitModeCount === 0) {
    return fallbackViewbox
  }
  if (explicitModeCount > 1) {
    throw new TypeError('Shape options can only define one viewBox mode: “size”, “viewbox” or “width” + “height”.')
  }
  if (hasViewbox) {
    return normalizeNonEmptyString(options.viewbox, 'viewbox')
  }
  if (hasSize) {
    const size = normalizePositiveNumber(options.size, 'size')
    return makeViewbox(size, size)
  }
  const height = normalizePositiveNumber(options.height, 'height')
  const width = normalizePositiveNumber(options.width, 'width')
  return makeViewbox(width, height)
}
const normalizeInput = (input: InputOptions, defaultColor: ConstructorOptions['defaultColor'], defaultViewbox: string): NormalizedInput => {
  if (typeof input === 'string') {
    return {
      color: defaultColor,
      path: normalizePath(input),
      viewbox: defaultViewbox,
    }
  }
  if (!isRecord(input)) {
    throw new TypeError('Shape input must be a path string or an options object.')
  }
  return {
    color: input.color === undefined ? defaultColor : normalizeColor(input.color, 'color'),
    path: normalizePath(input.path),
    viewbox: resolveInputViewbox(input, defaultViewbox),
  }
}
const renderStaticSvg = (input: NormalizedInput & {color: string}) => {
  return `<svg xmlns="${svgNamespace}" viewBox="${escapeSvgAttribute(input.viewbox)}"><path d="${escapeSvgAttribute(input.path)}" fill="${escapeSvgAttribute(input.color)}"/></svg>`
}
const renderThemedSvg = (input: NormalizedInput & {color: ThemedColor}) => {
  return `<svg xmlns="${svgNamespace}" viewBox="${escapeSvgAttribute(input.viewbox)}"><style>path[data-color-mode="dark"]{display:none}@media (prefers-color-scheme: dark){path[data-color-mode="light"]{display:none}path[data-color-mode="dark"]{display:inline}}</style><path data-color-mode="light" d="${escapeSvgAttribute(input.path)}" fill="${escapeSvgAttribute(input.color.onLight)}"/><path data-color-mode="dark" d="${escapeSvgAttribute(input.path)}" fill="${escapeSvgAttribute(input.color.onDark)}"/></svg>`
}

export default class SvgMaker {
  readonly options: Readonly<ConstructorOptions>
  readonly #defaultViewbox: string

  constructor(options?: Partial<ConstructorOptions>) {
    const defaultColor = freezeColor(normalizeColor(options?.defaultColor ?? 'currentColor', 'defaultColor'))
    const defaultSize = freezeDefaultSize(normalizeDefaultSize(options?.defaultSize ?? 960))
    this.options = Object.freeze({
      defaultColor,
      defaultSize,
    })
    this.#defaultViewbox = resolveDefaultViewbox(defaultSize)
  }

  /**
   * @return a string containing SVG code representing the provided shape and colors
   */
  make(input: InputOptions) {
    const normalizedInput = normalizeInput(input, this.options.defaultColor, this.#defaultViewbox)
    if (typeof normalizedInput.color === 'string') {
      return renderStaticSvg({
        ...normalizedInput,
        color: normalizedInput.color,
      })
    }
    return renderThemedSvg({
      ...normalizedInput,
      color: normalizedInput.color,
    })
  }
}

export const svgMaker = new SvgMaker
