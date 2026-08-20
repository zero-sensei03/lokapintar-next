import { ORBITS } from "@/constants/Effect.constant";
import { BrightStar } from "./BrightStar";

const STAR_COUNT = 180;

export function GalaxyBackground({
  galaxyRef,
}: {
  galaxyRef: React.RefObject<HTMLDivElement | null>;
}) {
  const stars = Array.from(
    { length: STAR_COUNT },
    (_, index) => {
      const seedA =
        ((index * 47.173) % 100) / 100;

      const seedB =
        ((index * 83.719) % 100) / 100;

      const size =
        index % 17 === 0
          ? 2
          : index % 7 === 0
            ? 1.5
            : 1;

      return {
        id: index,
        left: `${seedA * 100}%`,
        top: `${seedB * 100}%`,
        size,
      };
    },
  );

  return (
    <div
      ref={galaxyRef}
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Deep space */}

      <div className="absolute inset-0 bg-background" />

      {/* =====================================================
          DISTANT GALAXY
      ====================================================== */}

      <div className="absolute left-1/2 top-1/2 h-[650px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] opacity-[0.18]">
        <div className="absolute inset-0 rounded-[50%] border border-[#263E2C]" />

        <div className="absolute inset-[80px] rounded-[50%] border border-[#1C3323]" />

        <div className="absolute inset-[160px] rounded-[50%] border border-[#172C1D]" />

        <div className="absolute inset-[240px] rounded-[50%] border border-[#12251A]" />
      </div>

      {/* =====================================================
          ORBITS
      ====================================================== */}

      {ORBITS.map((orbit, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            width: orbit.width,
            height: orbit.height,
            left: `calc(${orbit.left} - ${
              orbit.width / 2
            }px)`,
            top: `calc(${orbit.top} - ${
              orbit.height / 2
            }px)`,
            transform: `rotate(${orbit.rotate}deg)`,
          }}
        >
          {/* Orbit line */}

          <div className="absolute inset-0 rounded-[50%] border border-[#284333] opacity-[0.48]" />

          {/* Second subtle line */}

          <div className="absolute inset-[10px] rounded-[50%] border border-[#172C1D] opacity-[0.55]" />

          {/* Moving object */}

          <div className="orbit-object absolute left-1/2 top-0 h-full w-full -translate-x-1/2">
            <div
              className="orbit-object absolute left-1/2 top-0"
              style={{
                transform: `translate(-50%, -50%)`,
              }}
            >
              <div className="orbit-traveler h-[5px] w-[5px] rounded-full bg-[#86EFAC]" />
            </div>
          </div>

          {/* Planet */}

          {index % 2 === 0 && (
            <div
              className="orbit-planet absolute rounded-full bg-[#4ADE80]"
              style={{
                width:
                  index === 0
                    ? 5
                    : index === 2
                      ? 7
                      : 4,
                height:
                  index === 0
                    ? 5
                    : index === 2
                      ? 7
                      : 4,
                left:
                  index === 0
                    ? "76%"
                    : index === 2
                      ? "23%"
                      : "88%",
                top:
                  index === 0
                    ? "16%"
                    : index === 2
                      ? "73%"
                      : "45%",
              }}
            />
          )}
        </div>
      ))}

      {/* =====================================================
          STARS
      ====================================================== */}

      <div className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="galaxy-star absolute rounded-full bg-[#A8CBB2]"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* =====================================================
          BRIGHT STARS
      ====================================================== */}

      <BrightStar
        left="12%"
        top="20%"
        size={4}
      />

      <BrightStar
        left="81%"
        top="18%"
        size={5}
      />

      <BrightStar
        left="88%"
        top="71%"
        size={4}
      />

      <BrightStar
        left="16%"
        top="77%"
        size={3}
      />

      <BrightStar
        left="73%"
        top="82%"
        size={3}
      />

      <BrightStar
        left="35%"
        top="10%"
        size={3}
      />

      {/* =====================================================
          SHOOTING STARS
      ====================================================== */}

      <span className="shooting-star absolute left-[10%] top-[13%] h-px w-20 rotate-[30deg] bg-[#72977D] opacity-0" />

      <span className="shooting-star absolute left-[62%] top-[7%] h-px w-24 rotate-[30deg] bg-[#72977D] opacity-0" />

      <span className="shooting-star absolute left-[78%] top-[48%] h-px w-16 rotate-[30deg] bg-[#72977D] opacity-0" />

      <span className="shooting-star absolute left-[28%] top-[75%] h-px w-16 rotate-[30deg] bg-[#72977D] opacity-0" />

      {/* =====================================================
          GALAXY GRAIN
      ====================================================== */}

      <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(#B7D9C1_0.6px,transparent_0.6px)] [background-size:4px_4px]" />
    </div>
  );
}