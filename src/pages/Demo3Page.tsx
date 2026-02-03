import { useState, useEffect } from 'react';

// Types
interface LineupItem {
  id: number;
  name: string;
  image: string;
  probability: number;
}

interface ShuffleData {
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  showLineup: boolean;
  showProbability: boolean;
  showShareButton: boolean;
  requireTermsAgreement: boolean;
  termsUrl: string;
  externalLink: string;
  remainingCount: number;
  maxCount: number;
  lineup: LineupItem[];
}

interface ShuffleResult {
  id: number;
  name: string;
  image: string;
}

// Mock data - 利用規約同意パターン
const mockShuffleData: ShuffleData = {
  title: "Summer Collection 2025",
  description: "限定NFTが当たるスペシャルシャッフル！全5種類のNFTからランダムで1つゲットできます。",
  image: "https://arweave.net/ul3PS95k8Uw3KiRegdwsinAPp-pq65GAK1NyMi9WSN8",
  startDate: "2025-01-01T00:00:00",
  endDate: "2025-02-28T23:59:59",
  showLineup: true,
  showProbability: true,
  showShareButton: true,
  requireTermsAgreement: true,
  termsUrl: "https://example.com/terms",
  externalLink: "https://example.com/collection",
  remainingCount: 2,
  maxCount: 3,
  lineup: [
    { id: 1, name: "Legendary Dragon", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format&fit=crop&q=60", probability: 1 },
    { id: 2, name: "Golden Phoenix", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60", probability: 9 },
    { id: 3, name: "Crystal Wolf", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&auto=format&fit=crop&q=60", probability: 20 },
    { id: 4, name: "Storm Eagle", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&auto=format&fit=crop&q=60", probability: 30 },
    { id: 5, name: "Forest Spirit", image: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=400&auto=format&fit=crop&q=60", probability: 40 },
  ]
};

const mockResult: ShuffleResult = {
  id: 2,
  name: "Golden Phoenix",
  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=60",
};

// NFT Card Component
const NFTCard = ({ item, showProbability }: { item: LineupItem; showProbability: boolean }) => (
  <div style={{
    background: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
  }}
  >
    <div style={{ position: 'relative', paddingTop: '100%', background: '#f4f5f7' }}>
      <img
        src={item.image}
        alt={item.name}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
    <div style={{ padding: '14px' }}>
      <p style={{
        margin: 0,
        fontSize: '14px',
        fontWeight: '600',
        color: '#172B4D',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {item.name}
      </p>
      {showProbability && (
        <p style={{
          margin: '6px 0 0',
          fontSize: '13px',
          color: '#6B778C',
        }}>
          {item.probability}%
        </p>
      )}
    </div>
  </div>
);

// Checkbox Component
interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  linkText: string;
  linkUrl: string;
  suffix: string;
}

const Checkbox = ({ checked, onChange, label, linkText, linkUrl, suffix }: CheckboxProps) => (
  <label style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    padding: '16px',
    background: '#F4F5F7',
    borderRadius: '12px',
    marginBottom: '12px',
  }}>
    <div style={{
      width: '24px',
      height: '24px',
      minWidth: '24px',
      borderRadius: '6px',
      border: checked ? 'none' : '2px solid #DFE1E6',
      background: checked ? '#FF6900' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    }}>
      {checked && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      style={{ display: 'none' }}
    />
    <span style={{
      fontSize: '14px',
      color: '#172B4D',
      lineHeight: '1.5',
    }}>
      {label}
      {linkUrl && (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#FF6900',
            textDecoration: 'underline',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {linkText}
        </a>
      )}
      {suffix}
    </span>
  </label>
);

// Main screen before shuffle
const ShuffleReadyScreen = ({ data, onShuffle }: { data: ShuffleData; onShuffle: () => void }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

  const canShuffle = data.remainingCount > 0 && (!data.requireTermsAgreement || agreedToTerms);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FAFBFC 0%, #F4F5F7 100%)',
    }}>
      {/* Hero Section - Card Style */}
      <div style={{
        padding: '24px 20px 0',
        background: '#F4F5F7',
      }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          }}>
            <img
              src={data.image}
              alt={data.title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        padding: '24px 20px 180px',
      }}>
        {/* Title Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '24px',
        }}>
          <h1 style={{
            margin: '0 0 12px',
            fontSize: '24px',
            fontWeight: '700',
            color: '#172B4D',
            letterSpacing: '-0.5px',
          }}>
            {data.title}
          </h1>
          <p style={{
            margin: '0 0 20px',
            fontSize: '15px',
            color: '#6B778C',
            lineHeight: '1.6',
          }}>
            {data.description}
          </p>

          {/* Info Row */}
          <div style={{
            display: 'flex',
            gap: '16px',
            padding: '16px',
            background: '#F4F5F7',
            borderRadius: '12px',
          }}>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>開催期間</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#172B4D', fontWeight: '600' }}>
                {formatDate(data.startDate)} - {formatDate(data.endDate)}
              </p>
            </div>
            <div style={{ width: '1px', background: '#DFE1E6' }} />
            <div>
              <p style={{ margin: 0, fontSize: '12px', color: '#6B778C', marginBottom: '4px' }}>残り回数</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#172B4D', fontWeight: '600' }}>
                <span style={{ color: '#FF6900', fontSize: '20px' }}>{data.remainingCount}</span>
                <span style={{ color: '#6B778C' }}> / {data.maxCount}回</span>
              </p>
            </div>
          </div>
        </div>

        {/* Lineup Section */}
        {data.showLineup && (
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              margin: '0 0 16px',
              fontSize: '16px',
              fontWeight: '700',
              color: '#172B4D',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{
                width: '4px',
                height: '20px',
                background: '#FF6900',
                borderRadius: '2px',
                display: 'inline-block',
              }} />
              ラインナップ
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}>
              {data.lineup.map((item) => (
                <NFTCard key={item.id} item={item} showProbability={data.showProbability} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 20px',
        background: 'linear-gradient(transparent, #fff 20%)',
        paddingTop: '40px',
      }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          {/* Terms Agreement Checkbox */}
          {data.requireTermsAgreement && (
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              label=""
              linkText="利用規約"
              linkUrl={data.termsUrl}
              suffix="に同意する"
            />
          )}

          <button
            onClick={onShuffle}
            disabled={!canShuffle}
            style={{
              width: '100%',
              padding: '18px 32px',
              fontSize: '17px',
              fontWeight: '700',
              color: '#fff',
              background: canShuffle
                ? '#FF6900'
                : '#A5ADBA',
              border: 'none',
              borderRadius: '14px',
              cursor: canShuffle ? 'pointer' : 'not-allowed',
              boxShadow: canShuffle
                ? '0 4px 14px rgba(255, 105, 0, 0.4)'
                : 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (canShuffle) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 105, 0, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = canShuffle ? '0 4px 14px rgba(255, 105, 0, 0.4)' : 'none';
            }}
          >
            {data.remainingCount === 0
              ? '回数上限に達しました'
              : 'シャッフルする'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Animation screen
const ShuffleAnimationScreen = ({ data, onComplete }: { data: ShuffleData; onComplete: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlowing, setIsSlowing] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let speed = 80;
    let iterations = 0;
    const maxIterations = 25;

    const animate = () => {
      iterations++;
      setCurrentIndex(prev => (prev + 1) % data.lineup.length);

      if (iterations > maxIterations - 10) {
        setIsSlowing(true);
        speed += 40;
      }

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      } else {
        clearInterval(interval);
        interval = setInterval(animate, speed);
      }
    };

    interval = setInterval(animate, speed);
    return () => clearInterval(interval);
  }, [data.lineup.length, onComplete]);

  const currentItem = data.lineup[currentIndex];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0052CC 0%, #00308F 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <h2 style={{
        color: '#fff',
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '40px',
        textAlign: 'center',
        textShadow: '0 2px 10px rgba(0,0,0,0.3)',
      }}>
        しばらくお待ちください...
      </h2>

      {/* Card Display */}
      <div style={{
        width: '260px',
        height: '340px',
        perspective: '1000px',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: '#fff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          animation: isSlowing ? 'pulse 0.5s ease-in-out infinite' : 'none',
          transition: 'all 0.08s ease-out',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '70%',
            background: '#f4f5f7',
          }}>
            <img
              src={currentItem.image}
              alt={currentItem.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={{
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: '#172B4D',
            }}>
              {currentItem.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Result screen
const ShuffleResultScreen = ({ data, result }: { data: ShuffleData; result: ShuffleResult }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${data.title}で${result.name}をゲット！`,
        text: `${result.name}を手に入れました！`,
        url: window.location.href,
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FAFBFC 0%, #F4F5F7 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px 200px',
    }}>
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      {/* Confetti - Rainbow */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        {[...Array(60)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: `${6 + Math.random() * 10}px`,
              height: `${6 + Math.random() * 10}px`,
              background: [
                '#FF0000', '#FF4500', '#FF6900', '#FFD700', '#FFFF00',
                '#7CFC00', '#00FF00', '#00CED1', '#00BFFF', '#1E90FF',
                '#8A2BE2', '#FF00FF', '#FF1493', '#FF69B4'
              ][i % 14],
              left: `${Math.random() * 100}%`,
              top: '-20px',
              animation: `confetti ${2 + Math.random() * 3}s linear forwards`,
              animationDelay: `${Math.random() * 2}s`,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* Result Label */}
      <div style={{
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.5s ease-out',
        marginBottom: '24px',
        textAlign: 'center',
      }}>
        <p style={{
          margin: '0 0 8px',
          fontSize: '14px',
          color: '#6B778C',
          fontWeight: '500',
        }}>
          おめでとうございます！
        </p>
        <h1 style={{
          margin: 0,
          fontSize: '28px',
          fontWeight: '700',
          color: '#172B4D',
        }}>
          結果発表
        </h1>
      </div>

      {/* Result Card */}
      <div style={{
        width: '100%',
        maxWidth: '280px',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transitionDelay: '0.2s',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Glow effect */}
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          right: '-20px',
          bottom: '-20px',
          background: 'rgba(107, 119, 140, 0.3)',
          borderRadius: '36px',
          filter: 'blur(30px)',
          opacity: 0.6,
          zIndex: -1,
        }} />

        <div style={{
          background: '#fff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
        }}>
          <div style={{
            position: 'relative',
            paddingTop: '100%',
            background: '#f4f5f7',
          }}>
            <img
              src={result.image}
              alt={result.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
          <div style={{
            padding: '24px',
            textAlign: 'center',
          }}>
            <h2 style={{
              margin: '0 0 8px',
              fontSize: '22px',
              fontWeight: '700',
              color: '#172B4D',
            }}>
              {result.name}
            </h2>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#6B778C',
            }}>
              1〜2分後にウォレットに届きます
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px 20px',
        background: 'linear-gradient(transparent, #fff 20%)',
        paddingTop: '40px',
      }}>
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {data.showShareButton && (
            <button
              onClick={handleShare}
              style={{
                width: '100%',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                background: '#000',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Xでシェアする
            </button>
          )}

          {data.externalLink && (
            <a
              href={data.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#fff',
                background: '#FF6900',
                border: 'none',
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'center',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(255, 105, 0, 0.4)',
                boxSizing: 'border-box',
              }}
            >
              コレクションを確認する
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function Demo3Page() {
  const [screen, setScreen] = useState<'ready' | 'animating' | 'result'>('ready');
  const [data] = useState<ShuffleData>(mockShuffleData);
  const [result] = useState<ShuffleResult>(mockResult);

  const handleShuffle = () => {
    setScreen('animating');
  };

  const handleAnimationComplete = () => {
    setScreen('result');
  };

  return (
    <>
      {screen === 'ready' && (
        <ShuffleReadyScreen data={data} onShuffle={handleShuffle} />
      )}
      {screen === 'animating' && (
        <ShuffleAnimationScreen data={data} onComplete={handleAnimationComplete} />
      )}
      {screen === 'result' && (
        <ShuffleResultScreen data={data} result={result} />
      )}
    </>
  );
}
