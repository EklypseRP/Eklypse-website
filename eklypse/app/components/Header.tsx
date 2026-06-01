'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, LogIn, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const NAV_ITEMS = [
  { href: '/',            label: 'Accueil' },
  { href: '/wiki',        label: 'Wiki' },
  { href: '/candidature', label: 'Candidature' },
];

const Header: React.FC = () => {
  const [mounted,     setMounted]     = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();
  const { data: session }: any = useSession();
  const { theme, toggle } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);
    const onResize = () => { setWindowWidth(window.innerWidth); if (window.innerWidth > 1024) setMenuOpen(false); };
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll); };
  }, []);

  const isMobile = windowWidth < 1024;

  // mounted ensures SSR and initial client render match (both transparent/unscrolled)
  // then after hydration the real scroll state takes over — no mismatch
  const solid = mounted && (scrolled || menuOpen);
  const headerBg = solid
    ? (isLight ? 'rgba(255,255,255,0.97)' : 'rgba(5,2,13,0.97)')
    : 'transparent';

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 'var(--z-overlay)' as any,
      padding: '0 1.5rem',
      height: 64,
      background: headerBg,
      backdropFilter: solid ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: solid ? 'blur(20px)' : 'none',
      borderBottom: solid ? '1px solid var(--border-subtle)' : '1px solid transparent',
      boxShadow: solid ? 'var(--shadow-card)' : 'none',
      transition: 'background 300ms ease, backdrop-filter 300ms ease, border-color 300ms ease, box-shadow 300ms ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
    }}>

      {/* Logo */}
      <Link href="/" style={{ flexShrink: 0, lineHeight: 0 }}>
        <Image
          src="/Eklypse.png" alt="Eklypse" width={110} height={36}
          style={{ height: isMobile ? 36 : 40, width: 'auto' }}
          priority
        />
      </Link>

      {/* Desktop nav */}
      {!isMobile && (
        <nav aria-label="Navigation principale" style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '0.25rem', alignItems: 'center',
        }}>
          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return <NavLink key={item.href} href={item.href} label={item.label} active={active} ghost={!solid} />;
          })}
          {session?.user?.isRecruiter && (
            <NavLink href="/admin/candidatures" label="Dashboard" active={pathname.startsWith('/admin/candidatures')} ghost={!solid} />
          )}
        </nav>
      )}

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {!isMobile && (
          session?.user ? (
            <>
              <UserBadge session={session} ghost={!solid} />
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                aria-label="Se déconnecter"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'transparent',
                  border: `1px solid ${!solid ? 'rgba(255,255,255,0.25)' : 'var(--border-base)'}`,
                  color: !solid ? 'rgba(255,255,255,0.72)' : 'var(--text-secondary)',
                  padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.04em',
                  transition: 'background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
                  minHeight: 36,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
                  e.currentTarget.style.color = '#F87171';
                  e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = !solid ? 'rgba(255,255,255,0.72)' : 'var(--text-secondary)';
                  e.currentTarget.style.borderColor = !solid ? 'rgba(255,255,255,0.25)' : 'var(--border-base)';
                }}
              >
                <LogOut size={13} strokeWidth={2} />
                Quitter
              </button>
            </>
          ) : pathname !== '/login' && (
            <Link href="/login" style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: !solid ? 'rgba(255,255,255,0.15)' : 'var(--brand-primary)',
              border: `1px solid ${!solid ? 'rgba(255,255,255,0.3)' : 'var(--brand-primary)'}`,
              color: '#fff',
              padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.04em',
              transition: 'background var(--duration-fast) var(--ease-out)',
              minHeight: 36, textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = !solid ? 'rgba(255,255,255,0.25)' : '#5B21B6'; }}
            onMouseLeave={e => { e.currentTarget.style.background = !solid ? 'rgba(255,255,255,0.15)' : 'var(--brand-primary)'; }}
            >
              <LogIn size={13} strokeWidth={2} />
              Connexion
            </Link>
          )
        )}

        {/* Theme toggle — always visible */}
        <ThemeToggleButton isLight={isLight} onToggle={toggle} />

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            style={{
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', cursor: 'pointer',
            }}
          >
            {menuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0,
          background: isLight ? 'rgba(255,255,255,0.98)' : 'rgba(5,2,13,0.98)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-base)',
          padding: '1rem 1.5rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.1rem',
          animation: 'slide-down var(--duration-base) var(--ease-out)',
          boxShadow: 'var(--shadow-raised)',
        }}>
          {session?.user && <UserBadge session={session} mobile />}

          {NAV_ITEMS.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
                textDecoration: 'none', fontSize: '0.95rem', fontWeight: active ? 700 : 500,
              }}>
                {active && <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--brand-primary)', flexShrink: 0 }} />}
                {item.label}
              </Link>
            );
          })}

          {session?.user?.isRecruiter && (
            <Link href="/admin/candidatures" onClick={() => setMenuOpen(false)} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0',
              borderBottom: '1px solid var(--border-subtle)',
              color: pathname.startsWith('/admin') ? 'var(--brand-primary)' : 'var(--text-secondary)',
              textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500,
            }}>
              <LayoutDashboard size={14} strokeWidth={1.5} />
              Dashboard
            </Link>
          )}

          <div style={{ paddingTop: '1rem' }}>
            {session?.user ? (
              <button onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false); }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'none', border: 'none', color: '#DC2626',
                fontSize: '0.95rem', fontWeight: 600,
                padding: '0.5rem 0', cursor: 'pointer',
              }}>
                <LogOut size={14} strokeWidth={2} />
                Se déconnecter
              </button>
            ) : pathname !== '/login' && (
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                display: 'block', color: 'var(--brand-primary)',
                textDecoration: 'none', fontSize: '0.95rem', fontWeight: 700,
                padding: '0.5rem 0',
              }}>
                Se connecter
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const ThemeToggleButton: React.FC<{ isLight: boolean; onToggle: () => void }> = ({ isLight, onToggle }) => (
  <button
    onClick={onToggle}
    aria-label={isLight ? 'Passer en mode sombre' : 'Passer en mode clair'}
    title={isLight ? 'Mode sombre' : 'Mode clair'}
    style={{
      width: 36, height: 36,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'transparent',
      border: '1px solid var(--border-base)',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      transition: 'background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)',
      flexShrink: 0,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = 'var(--state-hover-bg)';
      e.currentTarget.style.color = 'var(--text-primary)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.color = 'var(--text-secondary)';
    }}
  >
    {isLight ? <Moon size={15} strokeWidth={2} /> : <Sun size={15} strokeWidth={2} />}
  </button>
);

const NavLink: React.FC<{ href: string; label: string; active: boolean; ghost?: boolean }> = ({ href, label, active, ghost }) => {
  const [hov, setHov] = useState(false);
  // ghost = header is transparent (over dark map) → force white text
  const color = ghost
    ? (active ? '#fff' : 'rgba(255,255,255,0.72)')
    : (active ? 'var(--brand-primary)' : (hov ? 'var(--text-primary)' : 'var(--text-secondary)'));
  const bg = ghost
    ? (hov ? 'rgba(255,255,255,0.10)' : 'transparent')
    : (active ? 'rgba(109,40,217,0.07)' : (hov ? 'rgba(0,0,0,0.04)' : 'transparent'));

  return (
    <Link
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', textDecoration: 'none',
        padding: '0.4rem 0.75rem',
        minHeight: 44, display: 'flex', alignItems: 'center',
        color,
        background: bg,
        fontSize: '0.85rem', fontWeight: active ? 700 : 500,
        letterSpacing: '0.02em',
        borderRadius: 'var(--radius-sm)',
        transition: `color var(--duration-base) var(--ease-out), background var(--duration-base) var(--ease-out)`,
      }}
    >
      {label}
    </Link>
  );
};

const UserBadge: React.FC<{ session: any; mobile?: boolean; ghost?: boolean }> = ({ session, mobile, ghost }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: mobile ? '0.75rem 0 1rem' : '0.3rem 0.6rem',
    background: mobile ? 'none' : (ghost ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.04)'),
    borderTop:    mobile ? 'none' : `1px solid ${ghost ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)'}`,
    borderRight:  mobile ? 'none' : `1px solid ${ghost ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)'}`,
    borderLeft:   mobile ? 'none' : `1px solid ${ghost ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)'}`,
    borderBottom: mobile ? '1px solid var(--border-subtle)' : `1px solid ${ghost ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)'}`,
    borderRadius: mobile ? 0 : 'var(--radius-sm)',
    marginBottom: mobile ? '0.5rem' : 0,
  }}>
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <Image src={session.user.image} alt="" width={26} height={26} style={{
        borderRadius: '50%',
        border: '1.5px solid var(--border-base)',
        display: 'block',
      }} />
      <span style={{
        position: 'absolute', bottom: -1, right: -1,
        width: 8, height: 8, background: '#16A34A',
        border: '2px solid var(--surface-bg)', borderRadius: '50%',
      }} />
    </div>
    <div style={{ lineHeight: 1.2 }}>
      <p style={{ fontSize: '0.7rem', fontWeight: 600, color: ghost ? 'rgba(255,255,255,0.55)' : 'var(--text-muted)', margin: 0 }}>Connecté</p>
      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: ghost ? '#fff' : 'var(--text-primary)', margin: 0 }}>{session.user.name}</p>
    </div>
  </div>
);

export default Header;
