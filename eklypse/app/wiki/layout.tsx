export default function WikiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '64px', // header height
    }}>
      {children}
    </div>
  );
}
