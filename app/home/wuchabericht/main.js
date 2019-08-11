let setStep;
let name = '', spaceName = ''
const all = ['Doku', 'Verdrotig', 'Dokumentation', 'Löta', '2 Dokus', 'Nüt', 'SPS', '3 Dokus', 'Bohra', 'JAN CAPAUL', '5 Dokus']
let did = []
let harder = '', easier = ''
let hardValue = 0, easyValue = 0

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {step: 0}
    setStep = step => this.setState({step})
  }

  render() {
    return (
      <Frage step={this.state.step}/>
    )
  }
}

function Frage(props) {
  switch (props.step) {
    case 0: return (<Frage0/>); break;
    case 1: return (<Frage1/>); break;
    case 2: return (<Frage2/>); break;
    case 3: return (<Frage3/>); break;
    case 4: return (<Frage4/>); break;
  }
}

class Frage0 extends React.Component {
  render() {
    return (
      <section className="wuchabericht">
        <h1>Wuchabericht 1/8!</h1>
        <h2>Hoy, welli isch dini name?</h2>
        <p className="body">Freiwillig, of course...</p>
        <div><input id="frage" type="text" placeholder="nama" defaultValue={name} autoFocus/></div>
        <button className="btn" onClick={() => this.click()}>Nächsti Frog!</button>
        <Footer/>
      </section>
    );
  }

  click() {
    const value = document.getElementById('frage').value
    if (value) {
      name = value
      spaceName = ' ' + value
    }
    setStep(1)
  }
}

class Frage1 extends React.Component {
  render() {
    const checkboxes = all.map((e, i) => {
      return <div key={i}><input type="checkbox"/><label>{e}</label></div>
    })

    return (
      <section className="wuchabericht">
        <h1>Wuchabericht! 2/8</h1>
        <h2>Also{spaceName}, was hesch g'macht?</h2>
        <p className="body"> </p>
        <div className="multiple">
          {checkboxes}
        </div>
        <button className="btn" onClick={() => this.click()}>Nächsti Frog!</button>
        <button className="btn btn2" onClick={() => setStep(0)}>Z'rück!</button>
        <Footer/>
      </section>
    );
  }

  click() {
    did = []

    const children = [...document.querySelector('.multiple').children]
    children.forEach(({children}) => {
      if (children[0].checked) {
        did.push(children[1].innerHTML)
      }
    })

    if (did.length) {
      setStep(2)
    }
  }
}

class Frage2 extends React.Component {
  render() {
    const select = did.map((e, i) => {
      return <option key={e}>{e}</option>
    })

    return (
      <section className="wuchabericht">
        <h1>Wuchabericht! 3/8</h1>
        <h2>Oky{spaceName}, was war am schwiriga?</h2>
        <p className="body"> </p>
        <select id='select'>
          {select}
        </select>
        <button className="btn" onClick={() => this.click()}>Nächsti Frog!</button>
        <button className="btn btn2" onClick={() => setStep(0)}>Z'rück!</button>
        <Footer/>
      </section>
    );
  }

  click() {
    const value = document.querySelector('#select').value

    if (value) {
      harder = value
      setStep(3)
    }
  }
}

class Frage3 extends React.Component {
  render() {
    return (
      <section className="wuchabericht">
        <h1>Wuchabericht! 4/8</h1>
        <h2>Wie viel schwirig war {harder}?</h2>
        <p className="body">0 = eifach, 69 = hard</p>
        <div className="slider">
          <label>0</label>
          <input type="range" min="0" max="69" defaultValue="34" onChange={() => this.change()}/>
          <label>69</label>
        </div>
        <p className="body" id="current">Gewählt: 34</p>
        <button className="btn" onClick={() => this.click()}>Nächsti Frog!</button>
        <button className="btn btn2" onClick={() => setStep(0)}>Z'rück!</button>
        <Footer/>
      </section>
    );
  }

  change() {
    const value = document.querySelector('.slider').children[1].value
    document.querySelector('#current').innerHTML = `Gewählt: ${value}`
  }

  click() {
    const value = document.querySelector('.slider').children[1].value

    hardValue = value
    setStep(4)
  }
}

class Frage4 extends React.Component {
  render() {
    return (
      <section className="wuchabericht">
        <h1>Wuchabericht! 5/8</h1>
        <h2>Wieso isch {harder} a {hardValue}?</h2>
        <button className="btn" onClick={() => this.click()}>Nächsti Frog!</button>
        <button className="btn btn2" onClick={() => setStep(0)}>Z'rück!</button>
        <Footer/>
      </section>
    );
  }

  click() {

  }
}

ReactDOM.render(<Main />, document.querySelector(".wuchabericht-wrapper"));
