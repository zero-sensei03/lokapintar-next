export function BrightStar({
  left,
  top,
  size,
}: {
  left: string;
  top: string;
  size: number;
}) {
  return (
    <span
      className="bright-star absolute"
      style={{
        left,
        top,
        width: size,
        height: size,
      }}
    >
      <span className="absolute inset-0 rounded-full bg-[#D1FAE5]" />
      <span className="absolute left-1/2 top-1/2 h-[18px] w-px -translate-x-1/2 -translate-y-1/2 bg-[#8DB99A] opacity-40" />
      <span className="absolute left-1/2 top-1/2 h-px w-[18px] -translate-x-1/2 -translate-y-1/2 bg-[#8DB99A] opacity-40" />
    </span>
  );
}