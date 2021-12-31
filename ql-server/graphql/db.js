export const people = [
  {
    id: 0,
    name: "IL-KYO",
    age: 26,
    gender: "male"
  },
  {
    id: 1,
    name: "Da-Sol",
    age: 31,
    gender: "female"
  },
  {
    id: 2,
    name: "DDol",
    age: 8,
    gender: "female"
  }
]

export const getById = id => {
  const filteredPeople = people.filter(person => person.id === id)
  return filteredPeople[0]
}