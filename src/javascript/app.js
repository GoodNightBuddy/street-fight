import { createFighters } from './components/fightersView';
import { fighterService } from './services/fightersService';
import {renderArena} from './components/arena'

class App {
  static rootElement = document.getElementById('root');
  static loadingElement = document.getElementById('loading-overlay');

  static async startApp() {
    try {
      App.loadingElement.style.visibility = 'visible';

      const fighters = await fighterService.getFighters();
      const fightersElement = createFighters(fighters);   

      App.rootElement.appendChild(fightersElement);

      
// renderArena([
//   {
//       "_id": "2",
//       "name": "Dhalsim",
//       "health": 60,
//       "attack": 3,
//       "defense": 1,
//       "source": "https://i.pinimg.com/originals/c0/53/f2/c053f2bce4d2375fee8741acfb35d44d.gif"
//   },
//   {
//       "_id": "4",
//       "name": "Zangief",
//       "health": 60,
//       "attack": 4,
//       "defense": 1,
//       "source": "https://media1.giphy.com/media/nlbIvY9K0jfAA/source.gif"
//   }
// ])
    } catch (error) {
      console.warn(error);
      App.rootElement.innerText = 'Failed to load data';
    } finally {
      App.loadingElement.style.visibility = 'hidden';
    }
  }
}

export default App;