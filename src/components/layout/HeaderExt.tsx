// src\components\Layout\HeaderExt.tsx
import { Header } from '@happykiller/sunny-ui';
import MenuIcon from '@mui/icons-material/Menu';
import inversify from '@src/commons/inversify';
import { contextStore } from '@stores/contextStore';
import { volatileStore } from '@stores/volatileStore';

export function HeaderExt() {
  return <Header
    contextStore={contextStore()}
    volatileStore={volatileStore()}
    routes={['trainings', 'exercices', 'workouts', 'info', 'dashboard']}
    settings={['profile', 'logout']}
    brandName='Vergo'
    icons={{ menu: <MenuIcon /> }}
    onLogout={() => inversify.loggerService.log('logout')}
  />
}
export default HeaderExt;
