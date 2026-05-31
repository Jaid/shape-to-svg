import SvgMaker, {svgMaker} from '#src/SvgMaker.ts'

export const shapeToSvg: SvgMaker['make'] = svgMaker.make.bind(svgMaker)

export default shapeToSvg

export {SvgMaker, svgMaker}
export type {
  ColorOptions,
  ColorStaticOptions,
  ColorThemedOptions,
  ConstructorOptions,
  InputOptions,
  Options,
  ThemedColor,
  ViewboxFullOptions,
  ViewboxOptions,
  ViewboxRectOptions,
  ViewboxSquareOptions,
} from '#src/SvgMaker.ts'
