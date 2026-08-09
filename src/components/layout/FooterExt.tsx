// src\components\Layout\HeaderExt.tsx
import { Footer } from '@happykiller/sunny-ui';
import { BugReport, Cloud, DarkMode,Email, Language, LightMode, Map } from '@mui/icons-material';
import inversify from '@src/commons/inversify';
import { contextStore } from '@stores/contextStore';

export function FooterExt() {
  const mode = contextStore((s) => s.themeMode);
  const toggleTheme = contextStore((s) => s.toggleTheme);
  return <Footer
    systemInfoUsecase={inversify.systemInfoUsecase}
    frontVersion={process.env.VERSION ?? '1.0.0'}
    issuesUrl="https://github.com/Happykiller/vergo_front/issues"
    projectUrl="https://github.com/users/Happykiller/projects/4/views/1"
    mailto="fabrice.rosito@gmail.com"
    brandName="Vergo"
    icons={{
      email: <Email fontSize="small" />,
      issues: <BugReport fontSize="small" />,
      roadmap: <Map fontSize="small" />,
      language: <Language fontSize="small" />,
      cloud: <Cloud fontSize="small" />
    }}
    onToggleTheme={toggleTheme}
    iconThemeToggle={mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
  />
}
