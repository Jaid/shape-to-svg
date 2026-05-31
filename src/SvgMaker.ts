type EmptyOptions = {}

type ViewboxSquareOptions = {
  size: number
}

type ViewboxRectOptions = {
  height: number
  width: number
}

type ViewboxFullOptions = {
  viewbox: string
}

type ViewboxOptions = EmptyOptions | ViewboxFullOptions | ViewboxRectOptions | ViewboxSquareOptions

type ColorStaticOptions = {
  color: string
}

type ColorThemedOptions = {
  color: {
    onDark: string
    onLight: string
  }
}

type ColorOptions = ColorStaticOptions | ColorThemedOptions | EmptyOptions

type Options = {
  path: string
} & ViewboxOptions & ColorOptions

type InputOptions = Options | string

type ConstructorOptions = {
  defaultColor: ColorStaticOptions['color'] | ColorThemedOptions['color']
  defaultSize: ViewboxFullOptions | ViewboxRectOptions | ViewboxSquareOptions['size']
}

export default class SvgMaker {
  options: ConstructorOptions
  constructor(options?: Partial<ConstructorOptions>) {
    this.options = {
      defaultSize: 960,
      defaultColor: 'currentColor',
      ...options,
    }
  }
  /**
   * @return a string containing SVG code representing the provided shape and colors
   */
  make(input: InputOptions) {
    const options = typeof input === 'string' ? {path: input} : input
    const d = options.path.startsWith('M') ? options.path : `M${options.path}`
    return '<svg></svg>' // TODO Implement
  }
}

export const svgMaker = new SvgMaker
