// src\components\Header.tsx
import MenuIcon from '@mui/icons-material/Menu';

import { contextStore } from '@src/stores/contextStore';
import { volatileStore } from '@src/stores/volatileStore';
import { Header as SunnyHeader } from '@happykiller/sunny-ui';

function Header() {
  return <SunnyHeader
    contextStore={contextStore()}
    volatileStore={volatileStore()}
    routes={['trainings', 'exercices', 'workouts', 'info']}
    settings={['profile', 'logout']}
    brandName="Vergo"
    icons={{ menu: <MenuIcon /> }}
    onLogout={() => console.log('logout')}
  />
}
export default Header;