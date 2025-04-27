// src\components\Layout\LayoutProtectedExt.tsx
import inversify from '@src/commons/inversify';
import { contextStore } from '@stores/contextStore';
import { LayoutProtected } from '@happykiller/sunny-ui';
import { HeaderExt } from '@components/layout/HeaderExt';

export function LayoutProtectedExt({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProtected
      header={<HeaderExt />}
      sessionInfoUsecase={inversify.sessionInfo}
      loggerService={inversify.loggerService}
      contextStore={contextStore}
    >
      {children}
    </LayoutProtected>
  );
}
