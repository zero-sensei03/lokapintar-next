export interface ClickParticle {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
}

export interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

export function ClickEffectView({
  effect,
}: {
  effect: ClickEffect;
}) {
  const particles: ClickParticle[] =
    Array.from(
      { length: 18 },
      (_, index) => ({
        id: index,
        x: 0,
        y: 0,
        angle:
          (Math.PI * 2 * index) / 18 +
          ((index * 17) % 20) / 100,
        distance: 35 + ((index * 23) % 75),
        size: 2 + (index % 3),
      }),
    );

  return (
    <div
      className={`click-effect-${effect.id} pointer-events-none fixed z-50`}
      style={{
        left: effect.x,
        top: effect.y,
      }}
    >
      {/* Outer orbital ring */}

      <div className="click-ring absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#4ADE80] opacity-0" />

      {/* Second ring */}

      <div className="click-ring-two absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#A3E635] opacity-0" />

      {/* Center */}

      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#86EFAC]" />

      {/* Particles */}

      {particles.map((particle) => (
        <span
          key={particle.id}
          data-angle={particle.angle}
          data-distance={particle.distance}
          className="click-particle absolute left-1/2 top-1/2 rounded-full bg-[#86EFAC] opacity-0"
          style={{
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
}