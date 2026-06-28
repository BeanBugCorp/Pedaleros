export const fmt = (n) => '$' + Number(n).toLocaleString('en-US')

export const initials = (name) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
