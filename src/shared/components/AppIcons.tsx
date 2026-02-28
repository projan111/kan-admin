import React from "react";

type IconProps = Readonly<{ size?: number; strokeWidth?: number }>;

const S: React.FC<React.PropsWithChildren<IconProps>> = ({ size = 16, strokeWidth = 2, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const UsersIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></S>;
export const TeamIcon: React.FC<IconProps> = UsersIcon;
export const ContactIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></S>;
export const BrandIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M20.59 13.41 11 3H4v7l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82z"/><path d="M7 7h.01"/></S>;
export const CsrIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M12 21C12 21 4 13.5 4 8.5A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 8 3.5C20 13.5 12 21 12 21z"/></S>;
export const NewsIcon: React.FC<IconProps> = (p) => <S {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></S>;
export const FaqIcon: React.FC<IconProps> = (p) => <S {...p}><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1-1.9 1.5-1.9 3"/><path d="M12 17h.01"/></S>;
export const CompanyIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></S>;
export const DashboardIcon: React.FC<IconProps> = (p) => <S {...p}><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="5"/><rect x="13" y="10" width="8" height="11"/><rect x="3" y="13" width="8" height="8"/></S>;
export const PlusIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M12 5v14M5 12h14"/></S>;
export const PencilIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M12 20h9"/><path d="m16.5 3.5 4 4L7 21l-4 1 1-4Z"/></S>;
export const TrashIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/></S>;
export const RefreshIcon: React.FC<IconProps> = (p) => <S {...p}><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></S>;
