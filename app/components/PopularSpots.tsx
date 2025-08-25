import React from 'react';

interface PopularSpotsProps {
  spots: any[];
  selectPopularSpot: (spot: any) => void;
  rippleStyle: string;
}

const PopularSpots: React.FC<PopularSpotsProps> = ({ spots, selectPopularSpot, rippleStyle }) => (
  <div className="mt-6">
    <style>{rippleStyle}</style>
    <p className="text-white text-sm mb-3">Popular surf spots:</p>
    <div className="flex flex-wrap gap-2">
      {spots.map(spot => (
        <button
          key={spot.name}
          onClick={e => {
            const btn = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            ripple.style.width = ripple.style.height = `${rect.width}px`;
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            selectPopularSpot(spot);
          }}
          className="bg-black/20 cursor-pointer bg-opacity-20 text-white px-3 py-2 rounded-full text-sm transition-all duration-200 relative overflow-hidden hover:bg-opacity-30 focus:bg-opacity-40 focus:outline-none"
        >
          {spot.name}
        </button>
      ))}
    </div>
  </div>
);

export default PopularSpots;
