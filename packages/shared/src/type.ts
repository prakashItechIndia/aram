export type CustomSVGIconTypeProps = {
  variant?: 'on' | 'off' | undefined;
  className?: string;
  onClick?: (e?: any) => void;
  color?: string;
};

export type CustomSVGIconType = ({
  variant,
  className,
  onClick,
  color,
}: CustomSVGIconTypeProps) => JSX.Element;

export type FlattenKeys<T> = T extends object
  ? {
    [K in keyof T]-?: `${K & string}${T[K] extends object ? '.' : ''}${FlattenKeys<T[K]>}`;
  }[keyof T]
  : '';

export type HttpClientMinState = {
  user: { accessToken: string; refreshToken: string } | null;
  authTokenVersion: number | undefined;
  exchangeOnlyOnce: () => Promise<unknown>;
  logout: () => void;
  onUnauthorized?: () => void;
};
export type LanguageType = 'en' | 'de';
