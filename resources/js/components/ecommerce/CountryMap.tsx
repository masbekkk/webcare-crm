interface CountryMapProps {
  mapColor?: string;
}

const markers = [
  { name: "USA", left: "19%", top: "39%" },
  { name: "UK", left: "47%", top: "31%" },
  { name: "France", left: "49%", top: "40%" },
  { name: "India", left: "69%", top: "52%" },
];

const CountryMap: React.FC<CountryMapProps> = ({ mapColor = "#D0D5DD" }) => {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-white/[0.03]">
      <svg
        viewBox="0 0 800 360"
        className="h-full w-full"
        role="img"
        aria-label="Customer demographics map"
      >
        <path
          d="M103 129c40-38 117-42 160-14 25 16 35 45 16 69-27 34-86 37-132 23-49-15-78-48-44-78Zm228 13c37-41 105-55 157-36 53 19 74 75 34 115-42 41-119 46-167 14-38-25-53-61-24-93Zm271 11c54-34 120-20 145 30 22 44-3 89-55 99-61 12-127-24-136-77-4-22 11-39 46-52ZM374 262c69-17 171-10 245 20 24 10 34 31 19 44-29 25-188 24-273-4-47-15-39-49 9-60Z"
          fill={mapColor}
          opacity="0.9"
        />
      </svg>

      {markers.map((marker) => (
        <span
          key={marker.name}
          className="absolute flex size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500 ring-4 ring-brand-500/15"
          style={{ left: marker.left, top: marker.top }}
          title={marker.name}
        />
      ))}
    </div>
  );
};

export default CountryMap;
