// src\components\Layout\LayoutProtectedExt.tsx
import inversify from '@src/commons/inversify';
import { contextStore } from '@stores/contextStore';
import { LayoutProtected } from '@happykiller/sunny-ui';
import { HeaderExt } from '@components/layout/HeaderExt';
import { FooterExt } from '@components/layout/FooterExt';

export function LayoutProtectedExt({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProtected
      header={<HeaderExt />}
      footer={<FooterExt />}
      sessionInfoUsecase={inversify.sessionInfo}
      loggerService={inversify.loggerService}
      contextStore={contextStore}
    >
      {children}
    </LayoutProtected>
  );
}
