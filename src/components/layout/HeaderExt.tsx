// src\components\Layout\HeaderExt.tsx
import inversify from '@src/commons/inversify';
import MenuIcon from '@mui/icons-material/Menu';

import { Header } from '@happykiller/sunny-ui';
import { contextStore } from '@stores/contextStore';
import { volatileStore } from '@stores/volatileStore';

export function HeaderExt() {
  return <Header
    contextStore={contextStore()}
    volatileStore={volatileStore()}
    routes={['trainings', 'exercices', 'workouts', 'info']}
    settings={['profile', 'logout']}
    brandName="Vergo"
    icons={{ menu: <MenuIcon /> }}
    onLogout={() => inversify.loggerService.log('logout')}
  />
}
export default Header;
