const sortByName = (a: { name: string }, b: { name: string }) => {
  return a.name.localeCompare(b.name, 'ru')
}

export default sortByName