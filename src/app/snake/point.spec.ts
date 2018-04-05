import { Point } from './point'

describe('Point', () => {
    it('(a, b) + (c, d) = (a + c, b + d)', () => {
        expect(new Point(1, 2).plus(new Point(3, 4))).toEqual(new Point(4, 6))
    })

    it('can do equallity check', () => {
        expect(new Point(0, 0).equals(new Point(0, 0))).toBe(true)
        expect(new Point(0, 1).equals(new Point(0, 0))).toBe(false)
        expect(new Point(1, 0).equals(new Point(0, 0))).toBe(false)
        expect(new Point(1, 1).equals(new Point(0, 0))).toBe(false)
        expect(new Point(1, 1).equals(new Point(0, 0))).toBe(false)
    })
})
