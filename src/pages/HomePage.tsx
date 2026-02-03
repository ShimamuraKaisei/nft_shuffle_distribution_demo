import { Link } from 'react-router-dom';

interface DemoItem {
  id: number;
  path: string;
  title: string;
  description: string;
  thumbnail?: string;
}

const demos: DemoItem[] = [
  {
    id: 1,
    path: '/demo1',
    title: 'NFT Shuffle Distribution',
    description: 'NFTシャッフル配布のデモ画面',
    thumbnail: 'https://arweave.net/ul3PS95k8Uw3KiRegdwsinAPp-pq65GAK1NyMi9WSN8',
  },
  // 新しいデモはここに追加
];

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FAFBFC 0%, #F4F5F7 100%)',
      padding: '40px 20px',
    }}>
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
      }}>
        <h1 style={{
          margin: '0 0 8px',
          fontSize: '28px',
          fontWeight: '700',
          color: '#172B4D',
          textAlign: 'center',
        }}>
          Claude Desktop Demos
        </h1>
        <p style={{
          margin: '0 0 32px',
          fontSize: '14px',
          color: '#6B778C',
          textAlign: 'center',
        }}>
          Claude Desktopで作成したデモ一覧
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}>
          {demos.map((demo) => (
            <Link
              key={demo.id}
              to={demo.path}
              style={{
                display: 'block',
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '20px',
                gap: '16px',
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#F4F5F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {demo.thumbnail ? (
                    <img
                      src={demo.thumbnail}
                      alt={demo.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <span style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: '#6B778C',
                    }}>
                      {demo.id}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#FF6900',
                      background: '#FFF4E5',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}>
                      Demo {demo.id}
                    </span>
                  </div>
                  <p style={{
                    margin: '0 0 4px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#172B4D',
                  }}>
                    {demo.title}
                  </p>
                  <p style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#6B778C',
                  }}>
                    {demo.description}
                  </p>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A5ADBA" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>
          ))}

          {demos.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6B778C',
            }}>
              <p style={{ margin: 0, fontSize: '15px' }}>
                まだデモがありません
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
