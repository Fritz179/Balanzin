class MainMenu extends Menu {
  constructor() {
    super()
    
    this.listen('onKey')
  }

  onKey(input) {
    switch (input) {
      case 'p': setCurrentStatus('levelSelection'); break;
      case 'o': setCurrentStatus('options'); break;
      case 'c': setCurrentStatus('create'); break;
    }
  }
}
