type Theme = {
  background: string;
  color: string;

}

function t(a: [number, number][]) {
  let res: Record<string,string> = {}
  for (const [ki, vi] of a) {
    res[ks[ki] as string] = vs[vi] as string
  }
  return res as Theme
}
const vs = [
  '#fff',
  '#000',
  '#eee',
  '#111',
]

const ks = [
'background',
'color']


const n1 = t([[0, 0],[1, 1]])

export const light = n1
const n2 = t([[0, 1],[1, 0]])

export const dark = n2
const n3 = t([[0, 2],[1, 3]])

export const light_subtle = n3
const n4 = t([[0, 3],[1, 2]])

export const dark_subtle = n4