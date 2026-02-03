import type { LineupItem } from '../types';

interface NFTCardProps {
  item: LineupItem;
  showProbability: boolean;
}

export const NFTCard = ({ item, showProbability }: NFTCardProps) => (
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
