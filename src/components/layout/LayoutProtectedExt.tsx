// src\components\Layout\LayoutProtectedExt.tsx
import { FooterExt } from '@components/layout/FooterExt';
import { HeaderExt } from '@components/layout/HeaderExt';
import { LayoutProtected } from '@happykiller/sunny-ui';
import inversify from '@src/commons/inversify';
import { contextStore } from '@stores/contextStore';

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
