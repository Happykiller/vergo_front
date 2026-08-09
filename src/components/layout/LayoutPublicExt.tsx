// src\components\Layout\LayoutProtectedExt.tsx
import { FooterExt } from '@components/layout/FooterExt';
import { LayoutPublic } from '@happykiller/sunny-ui';

export function LayoutPublicExt({ children }: { children: React.ReactNode }) {
  return (
    <LayoutPublic
      footer={<FooterExt />}
    >
      {children}
    </LayoutPublic>
  );
}
