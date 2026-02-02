import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '16px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '20px',
        },
      }}
    />
  );
}

export { toast } from 'sonner';
