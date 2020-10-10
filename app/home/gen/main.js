const {useState} = React

const App = () => {
  const [values, setValues] = useState([[23, 0], [92, 120], [46, 240]])
  const [unit, setUnit] = useState(false) // unit = usingCurrent

  function update(e, i, j) {
    const newVal = +e.target.value

    if (newVal + 1) {
      const copy = [...values]
      copy[i][j] = newVal
      setValues(copy)
    }
  }

  function zerofy() {
    const [a, b, c] = values.map(([l]) => unit ? l : 230 / l)

    const a1 = 180 - cosLawAngle(a, b, c)
    const a2 = a1 + 180 - cosLawAngle(b, c, a)

    if (!a1 || !a2) {
      return alert('ta pos miga creà an triangul cun una ipotenusa plù granda dala somma dai cateti.')
    }

    const copy = [...values]
    copy[0][1] = 0
    copy[1][1] = a1
    copy[2][1] = a2
    setValues(copy)

    console.log(a1, a2);
  }

  function chageUnit() {
    setValues(values.map(([l, a]) => [230 / l, a]))
    setUnit(!unit)
  }

  const mapped = values.map(([l, a]) => [l, a / 360 * Math.PI * 2 + Math.PI])
  const other = mapped.map(([l, a]) => [230 / l, a])

  return (
    <div className="container">
      {[0, 1, 2].map(i => (
        <div key={i}>
          <label>{unit ? 'I' : 'R'}{i + 1}:
            <input type="text" value={values[i][0]} onChange={e => update(e, i, 0)}/>
          </label>
          <label>°{i + 1}:
            <input type="text" value={values[i][1]} onChange={e => update(e, i, 1)}/>
          </label>
        </div>
      ))}
      <button onClick={zerofy}>Met al centru al centru</button>
      <button onClick={chageUnit}>{unit ? 'resistenze' : 'correnti'}</button>
      <section>
        <ICanvas i={unit ? mapped : other}/>
        <UCanvas i={unit ? other : mapped}/>
      </section>
    </div>
  )
}

ReactDOM.render(<App/>, document.getElementById('root'));

function cosLaw(a, b, gamma) {
  return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(gamma))
}

function cosLawAngle(a, b, c) {
  return Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 360 / (Math.PI * 2)
}
