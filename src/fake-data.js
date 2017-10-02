function randomRange(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1)
  rand = Math.round(rand)
  return rand
}

/*
createData return [{list: []}, ...]
*/

class FakeData {
  constructor(len) {
    this.data = this.createData(len)
  }

  createData = (len) => {
    const data = new Array(len).fill(0).map((el, i) => ({
      id: i + 1,
      name: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
      list: new Array(10).fill(0).map(() => randomRange(0, 5)),
    }))
    return data
  }

  get all() {
    return this.data
  }

  getItem(id) {
    return this.data.find(el => el.id === id)
  }

  delete(id) {
    const rm = this.data.findIndex(el => el.id === id)
    if (rm === -1) return false
    this.data.splice(rm, 0)
    return true
  }
}

export default FakeData
