import { useTranslation } from 'react-i18next';

interface Seat {
  id: number;
  zone_id: number;
  row: string;
  number: number;
  status: string;
  price: number;
}
interface Zone {
  id: number;
  name: string;
  price_multiplier: number;
}

interface SeatMapProps {
  seats: Seat[];
  zones: Zone[];
  selected: number[];
  onSelect: (id: number) => void;
}

export default function SeatMap({ seats, zones, selected, onSelect }: SeatMapProps) {
  const { t } = useTranslation();
  const byZone = zones.map((z) => ({ zone: z, seats: seats.filter((s) => s.zone_id === z.id) }));

  const statusColor = (status: string) => {
    if (status === 'sold') return 'bg-gray-400 cursor-not-allowed';
    if (status === 'reserved') return 'bg-amber-200 cursor-not-allowed';
    return 'bg-maroc-vert hover:opacity-80 cursor-pointer';
  };

  return (
    <div className="space-y-6">
      {byZone.map(({ zone, seats: zoneSeats }) => (
        <div key={zone.id} className="bg-white rounded p-4 shadow">
          <h3 className="font-semibold text-maroc-rouge mb-2">
            {zone.name} · {t('zone')} (×{zone.price_multiplier})
          </h3>
          <div className="flex flex-wrap gap-1">
            {zoneSeats.map((s) => (
              <button
                key={s.id}
                type="button"
                title={`${t('price')}: ${s.price} MAD · ${t(s.status as 'available' | 'reserved' | 'sold')}`}
                disabled={s.status !== 'available'}
                onClick={() => s.status === 'available' && onSelect(s.id)}
                className={`w-8 h-8 rounded text-xs font-medium text-white ${statusColor(s.status)} ${selected.includes(s.id) ? 'ring-2 ring-maroc-rouge ring-offset-1' : ''}`}
              >
                {s.row}{s.number}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
