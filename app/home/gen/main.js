const {useState} = React

const App = () => {
  const [res, setRes] = useState([[20, 0], [15, 120], [10, 240]])

  function update(e, i, j) {
    const newVal = +e.target.value

    if (newVal + 1) {
      const copy = [...res]
      copy[i][j] = newVal
      setRes(copy)
    }
  }

  function zerofy() {
    const [[a], [b], [c]] = res

    const a1 = 180 - cosLawAngle(a, b, c)
    const a2 = a1 + 180 - cosLawAngle(b, c, a)

    if (!a1 || !a2) {
      return alert('nope')
    }

    const copy = [...res]
    copy[1][1] = a1
    copy[2][1] = a2
    setRes(copy)

    console.log(a1, a2);
  }

  return (
    <div className="container">
      {[0, 1, 2].map(i => (
        <div key={i}>
          <label>I{i}:
            <input type="text" value={res[i][0]} onChange={e => update(e, i, 0)}/>
          </label>
          <label>°{i}:
            <input type="text" value={res[i][1]} onChange={e => update(e, i, 1)}/>
          </label>
        </div>
      ))}
      <button onClick={zerofy}>Magia</button>
      <Canvas i={res}/>
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
