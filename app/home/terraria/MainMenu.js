class MainMenu extends Menu {
  constructor() {
    super()

    this.listen('onKey')
  }

  onKey(input) {
    switch (input) {
      case 'p': setCurrentStatus('play'); break;
      case 'o': setCurrentStatus('options'); break;
    }
  }
}
