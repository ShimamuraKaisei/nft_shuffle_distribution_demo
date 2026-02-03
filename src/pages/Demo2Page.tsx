import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Mock data - ラインナップ非表示パターン
const mockShuffleData: ShuffleData = {
  title: "Summer Collection 2025",
  description: "限定NFTが当たるスペシャルシャッフル！何が出るかはお楽しみ！",
  image: "https://arweave.net/ul3PS95k8Uw3KiRegdwsinAPp-pq65GAK1NyMi9WSN8",
  startDate: "2025-01-01T00:00:00",
  endDate: "2025-02-28T23:59:59",
  showLineup: false,
  showProbability: false,
  showShareButton: true,
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

// Main screen before shuffle - No Lineup
const ShuffleReadyScreen = ({ data, onShuffle }: { data: ShuffleData; onShuffle: () => void }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  };

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
        padding: '24px 20px 100px',
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

        {/* Mystery Message - ラインナップの代わり */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '32px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #FF6900 0%, #FF8533 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 4px 14px rgba(255, 105, 0, 0.3)',
          }}>
            <span style={{ fontSize: '28px', color: '#fff', fontWeight: '700' }}>?</span>
          </div>
          <h2 style={{
            margin: '0 0 8px',
            fontSize: '18px',
            fontWeight: '700',
            color: '#172B4D',
          }}>
            何が出るかはお楽しみ！
          </h2>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6B778C',
          }}>
            シャッフルして結果を確認しよう
          </p>
        </div>
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
          <button
            onClick={onShuffle}
            disabled={data.remainingCount === 0}
            style={{
              width: '100%',
              padding: '18px 32px',
              fontSize: '17px',
              fontWeight: '700',
              color: '#fff',
              background: data.remainingCount > 0
                ? '#FF6900'
                : '#A5ADBA',
              border: 'none',
              borderRadius: '14px',
              cursor: data.remainingCount > 0 ? 'pointer' : 'not-allowed',
              boxShadow: data.remainingCount > 0
                ? '0 4px 14px rgba(255, 105, 0, 0.4)'
                : 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (data.remainingCount > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 105, 0, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 105, 0, 0.4)';
            }}
          >
            {data.remainingCount > 0 ? 'シャッフルする' : '回数上限に達しました'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ===== Shuffle Animation Sub-components =====

type AnimationPhase = 'buildup' | 'shuffle' | 'reveal';

// Particle Field - 渦巻き状のパーティクルエフェクト
const ParticleField = ({ phase }: { phase: AnimationPhase }) => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      angle: (i / 30) * Math.PI * 2,
      radius: 150 + Math.random() * 100,
      size: 4 + Math.random() * 6,
      delay: i * 0.03,
    })),
  []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {particles.map((p) => {
        const x = Math.cos(p.angle) * p.radius;
        const y = Math.sin(p.angle) * p.radius;

        return (
          <motion.div
            key={p.id}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0,
            }}
            animate={phase === 'buildup' ? {
              x: 0,
              y: 0,
              opacity: 0.8,
              scale: 1.5,
            } : phase === 'shuffle' ? {
              x: [0, x * 0.5, x],
              y: [0, y * 0.5, y],
              opacity: [0.8, 1, 0.4],
              scale: [1.5, 1, 0.5],
              rotate: [0, 180, 360],
            } : {
              x: x * 2,
              y: y * 2,
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: phase === 'shuffle' ? 1.5 : phase === 'reveal' ? 0.5 : 0.8,
              delay: p.delay,
              ease: phase === 'shuffle' ? 'linear' : 'easeOut',
              repeat: phase === 'shuffle' ? Infinity : 0,
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              background: `radial-gradient(circle, rgba(255,200,100,0.9) 0%, rgba(255,105,0,0.6) 100%)`,
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(255,150,50,0.8)',
            }}
          />
        );
      })}
    </div>
  );
};

// Energy Ring - パルス状のエネルギーリング
const EnergyRing = ({ phase }: { phase: AnimationPhase }) => {
  if (phase === 'buildup') return null;

  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={phase === 'shuffle' ? {
            scale: [0.3, 1.5, 2.5],
            opacity: [0, 0.8, 0],
          } : {
            scale: 3,
            opacity: 0,
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.4,
            repeat: phase === 'shuffle' ? Infinity : 0,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            width: 280,
            height: 360,
            border: '2px solid',
            borderColor: 'rgba(255, 150, 50, 0.6)',
            borderRadius: 24,
            boxShadow: '0 0 20px rgba(255, 105, 0, 0.4), inset 0 0 20px rgba(255, 105, 0, 0.2)',
          }}
        />
      ))}
    </>
  );
};

// Mystery Card - 3D回転するカード
const MysteryCard = ({ phase }: { phase: AnimationPhase }) => {
  const cardVariants = {
    buildup: {
      scale: 0.9,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      rotateZ: 0,
    },
    shuffle: {
      scale: 1,
      y: [0, -15, 0, -10, 0],
      rotateY: [0, 360, 720, 1080, 1440],
      rotateX: [0, 8, -8, 8, 0],
      rotateZ: [0, 2, -2, 2, 0],
    },
    reveal: {
      scale: 1.08,
      y: 0,
      rotateY: 1440,
      rotateX: 0,
      rotateZ: 0,
    },
  };

  const glowVariants = {
    buildup: {
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    },
    shuffle: {
      boxShadow: [
        '0 0 40px rgba(255, 105, 0, 0.6), 0 0 80px rgba(255, 150, 50, 0.4)',
        '0 0 60px rgba(255, 105, 0, 0.8), 0 0 100px rgba(255, 150, 50, 0.6)',
        '0 0 40px rgba(255, 105, 0, 0.6), 0 0 80px rgba(255, 150, 50, 0.4)',
      ],
    },
    reveal: {
      boxShadow: '0 0 100px rgba(255, 105, 0, 1), 0 0 150px rgba(255, 200, 100, 0.8)',
    },
  };

  return (
    <motion.div
      style={{
        width: 260,
        height: 340,
        perspective: 1200,
      }}
    >
      <motion.div
        variants={cardVariants}
        initial="buildup"
        animate={phase}
        transition={{
          duration: phase === 'shuffle' ? 1.5 : phase === 'reveal' ? 0.6 : 0.8,
          ease: phase === 'reveal' ? [0.16, 1, 0.3, 1] : 'easeInOut',
          repeat: phase === 'shuffle' ? Infinity : 0,
        }}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          variants={glowVariants}
          initial="buildup"
          animate={phase}
          transition={{
            duration: phase === 'shuffle' ? 0.5 : 0.6,
            repeat: phase === 'shuffle' ? Infinity : 0,
          }}
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, #FF6900 0%, #FF8533 50%, #FFB366 100%)',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backfaceVisibility: 'hidden',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Shimmer effect overlay */}
          <motion.div
            animate={phase === 'shuffle' ? {
              x: ['-200%', '200%'],
            } : {}}
            transition={{
              duration: 0.8,
              repeat: phase === 'shuffle' ? Infinity : 0,
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Card Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 20,
            opacity: 0.15,
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 8px,
                rgba(255,255,255,0.2) 8px,
                rgba(255,255,255,0.2) 16px
              )
            `,
          }} />

          {/* Question Mark Container */}
          <motion.div
            animate={phase === 'shuffle' ? {
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            } : phase === 'reveal' ? {
              scale: 1.1,
            } : {}}
            transition={{
              duration: 0.3,
              repeat: phase === 'shuffle' ? Infinity : 0,
            }}
            style={{
              width: 120,
              height: 120,
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
              boxShadow: 'inset 0 0 20px rgba(255,255,255,0.2)',
            }}
          >
            <motion.span
              animate={phase === 'shuffle' ? {
                textShadow: [
                  '0 4px 20px rgba(0,0,0,0.2)',
                  '0 0 40px rgba(255,255,255,0.8)',
                  '0 4px 20px rgba(0,0,0,0.2)',
                ],
              } : {}}
              transition={{
                duration: 0.4,
                repeat: phase === 'shuffle' ? Infinity : 0,
              }}
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: '#fff',
                textShadow: '0 4px 20px rgba(0,0,0,0.2)',
              }}
            >
              ?
            </motion.span>
          </motion.div>

          <motion.p
            animate={phase === 'reveal' ? { opacity: 0 } : { opacity: 1 }}
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: '#fff',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            何が出るかな...？
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ===== Main Animation Screen =====
const ShuffleAnimationScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<AnimationPhase>('buildup');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('shuffle'), 800),
      setTimeout(() => setPhase('reveal'), 2600),
      setTimeout(onComplete, 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const statusText = {
    buildup: '準備中...',
    shuffle: 'シャッフル中...',
    reveal: '結果発表...',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1628 0%, #1a365d 50%, #0d2137 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow background */}
      <motion.div
        animate={{
          opacity: phase === 'shuffle' ? [0.3, 0.6, 0.3] : phase === 'reveal' ? 0.8 : 0.2,
          scale: phase === 'reveal' ? 1.5 : 1,
        }}
        transition={{
          duration: phase === 'shuffle' ? 0.8 : 0.5,
          repeat: phase === 'shuffle' ? Infinity : 0,
        }}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(255,105,0,0.4) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />

      <ParticleField phase={phase} />

      {/* Status Text */}
      <AnimatePresence mode="wait">
        <motion.h2
          key={phase}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            color: '#fff',
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 50,
            textAlign: 'center',
            textShadow: '0 2px 20px rgba(255,105,0,0.5)',
            letterSpacing: 2,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {statusText[phase]}
        </motion.h2>
      </AnimatePresence>

      {/* Card Container */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <EnergyRing phase={phase} />
        <MysteryCard phase={phase} />
      </div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 60,
          width: '60%',
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(255,150,50,0.5), transparent)',
        }}
      />
    </motion.div>
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
export default function Demo2Page() {
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
        <ShuffleAnimationScreen onComplete={handleAnimationComplete} />
      )}
      {screen === 'result' && (
        <ShuffleResultScreen data={data} result={result} />
      )}
    </>
  );
}
