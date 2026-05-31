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

const shapeToSvg = (input: InputOptions) => {
  const options = typeof input === 'string' ? {path: input} : input
  return 'shape-to-svg' // TODO Implement actual functionality
}

export default shapeToSvg
