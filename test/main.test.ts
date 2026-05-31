import {expect, test} from 'bun:test'

const {default: shapeToSvg} = await import('#src/main.ts')

test('should run', () => {
  const result = shapeToSvg()
  expect(result).toBe('shape-to-svg') // TODO Test actual functionality
})
