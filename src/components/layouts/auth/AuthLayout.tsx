"use client";

import { ClickEffect, ClickEffectView } from "@/components/auth-component/ClickEffectView";
import { GalaxyBackground } from "@/components/auth-component/GalaxyBackground";
import { ORBITS } from "@/constants/Effect.constant";
import { animate, createTimeline, stagger } from "animejs";
import { ReactNode, useEffect, useRef, useState } from "react";


export function AuthLayout({ children }: { children: ReactNode }) {

  const pageRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLDivElement>(null);

  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);

  useEffect(() => {
    const page = pageRef.current;
    const brand = brandRef.current;

    if (!page || !brand) {
      return;
    }

    const timeline = createTimeline({
      defaults: {
        ease: "out(4)",
      },
    });

    timeline
      .add(page, {
        opacity: {
          from: 0,
          to: 1,
        },
        duration: 500,
      })
      .add(
        brand,
        {
          opacity: {
            from: 0,
            to: 1,
          },
          translateY: {
            from: -30,
            to: 0,
          },
          duration: 700,
        },
        "-=250",
      )

    return () => {
      timeline.pause();
    };
  }, []);

  useEffect(() => {
    const galaxy = galaxyRef.current;

    if (!galaxy) {
      return;
    }

    const stars =
      galaxy.querySelectorAll<HTMLElement>(
        ".galaxy-star",
      );

    const brightStars =
      galaxy.querySelectorAll<HTMLElement>(
        ".bright-star",
      );

    const starAnimation = animate(stars, {
      opacity: [
        {
          to: 0.15,
          duration: 0,
        },
        {
          to: 0.65,
          duration: 1800,
        },
        {
          to: 0.2,
          duration: 1800,
        },
      ],
      scale: [
        {
          to: 0.75,
          duration: 0,
        },
        {
          to: 1,
          duration: 1800,
        },
        {
          to: 0.8,
          duration: 1800,
        },
      ],
      delay: stagger(90, {
        from: "random",
      }),
      duration: 3600,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    });

    const brightAnimation = animate(
      brightStars,
      {
        opacity: [
          {
            to: 0.25,
            duration: 900,
          },
          {
            to: 0.9,
            duration: 1300,
          },
          {
            to: 0.35,
            duration: 1100,
          },
        ],
        scale: [
          {
            to: 0.8,
            duration: 900,
          },
          {
            to: 1.15,
            duration: 1300,
          },
          {
            to: 0.9,
            duration: 1100,
          },
        ],
        delay: stagger(700, {
          from: "random",
        }),
        duration: 3300,
        loop: true,
        ease: "inOutSine",
      },
    );

    return () => {
      starAnimation.pause();
      brightAnimation.pause();
    };
  }, []);

  useEffect(() => {
    const galaxy = galaxyRef.current;

    if (!galaxy) {
      return;
    }

    const orbitObjects =
      galaxy.querySelectorAll<HTMLElement>(
        ".orbit-object",
      );

    const animations: Array<ReturnType<typeof animate>> =
      [];

    orbitObjects.forEach((object, index) => {
      const duration =
        ORBITS[index % ORBITS.length].duration;

      const reverse =
        ORBITS[index % ORBITS.length].reverse;

      const animation = animate(object, {
        rotate: reverse ? -360 : 360,
        duration,
        loop: true,
        ease: "linear",
      });

      animations.push(animation);
    });

    return () => {
      animations.forEach((animation) => {
        animation.pause();
      });
    };
  }, []);

  useEffect(() => {
    const planets =
      galaxyRef.current?.querySelectorAll<HTMLElement>(
        ".orbit-planet",
      );

    if (!planets) {
      return;
    }

    const animations: Array<ReturnType<typeof animate>> =
      [];

    planets.forEach((planet, index) => {
      const animation = animate(planet, {
        scale: [
          {
            to: 0.75,
            duration: 1600,
          },
          {
            to: 1.1,
            duration: 1600,
          },
          {
            to: 0.8,
            duration: 1600,
          },
        ],
        opacity: [
          {
            to: 0.35,
            duration: 1600,
          },
          {
            to: 0.9,
            duration: 1600,
          },
          {
            to: 0.4,
            duration: 1600,
          },
        ],
        delay: index * 600,
        duration: 4800,
        loop: true,
        ease: "inOutSine",
      });

      animations.push(animation);
    });

    return () => {
      animations.forEach((animation) => {
        animation.pause();
      });
    };
  }, []);

  const handleBackgroundClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {

    const target = event.target as HTMLElement;

    if (
      target.closest(".auth-card") ||
      target.closest("button") ||
      target.closest("input")
    ) {
      return;
    }

    const effectId = Date.now();

    const effect: ClickEffect = {
      id: effectId,
      x: event.clientX,
      y: event.clientY,
    };

    setClickEffects((previous) => [
      ...previous,
      effect,
    ]);

    window.setTimeout(() => {
      setClickEffects((previous) =>
        previous.filter(
          (item) => item.id !== effectId,
        ),
      );
    }, 1500);

    window.requestAnimationFrame(() => {
      animate(
        `.click-effect-${effectId} .click-ring`,
        {
          scale: {
            from: 0.1,
            to: 1,
          },
          opacity: [
            {
              to: 0.8,
              duration: 100,
            },
            {
              to: 0,
              duration: 900,
            },
          ],
          duration: 1000,
          ease: "out(4)",
        },
      );

      animate(
        `.click-effect-${effectId} .click-ring-two`,
        {
          scale: {
            from: 0.1,
            to: 1,
          },
          rotate: 180,
          opacity: [
            {
              to: 0.55,
              duration: 100,
            },
            {
              to: 0,
              duration: 1100,
            },
          ],
          duration: 1100,
          ease: "out(4)",
        },
      );

      animate(
        `.click-effect-${effectId} .click-particle`,
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          translateX: (element: any) => {
            const angle = Number(
              (element as HTMLElement).dataset.angle,
            );

            const distance = Number(
              (element as HTMLElement).dataset.distance,
            );

            return Math.cos(angle) * distance;
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          translateY: (element: any) => {
            const angle = Number(
              (element as HTMLElement).dataset.angle,
            );

            const distance = Number(
              (element as HTMLElement).dataset.distance,
            );

            return Math.sin(angle) * distance;
          },
          opacity: [
            {
              to: 1,
              duration: 80,
            },
            {
              to: 0,
              duration: 900,
            },
          ],
          scale: [
            {
              to: 1,
              duration: 100,
            },
            {
              to: 0,
              duration: 900,
            },
          ],
          duration: 1000,
          delay: stagger(25),
          ease: "out(4)",
        },
      );
    });
  };

  return (
    <main
      ref={pageRef}
      onClick={handleBackgroundClick}
      className="auth-page relative min-h-screen overflow-hidden bg-background text-foreground"
    >
      <GalaxyBackground
        galaxyRef={galaxyRef}
      />

      {clickEffects.map((effect) => (
        <ClickEffectView
          key={effect.id}
          effect={effect}
        />
      ))}

      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-[440px]">
          {/* ==================================================
              BRAND
          ================================================== */}

          <div
            ref={brandRef}
            className="mb-7 flex items-center gap-2"
          >
            <div className="flex justify-center">
              <div className="relative flex h-[74px] w-[74px] items-center justify-center">
                <div className="logo-orbit absolute inset-0 rounded-full border border-[#284B34]" />

                <div className="absolute inset-[9px] rounded-full border border-[#193322]" />

                <div className="logo-core relative flex h-11 w-11 items-center justify-center rounded-xl border border-[#376E4B] bg-[#102217]">
                  <div className="h-4 w-4 rotate-45 rounded-[4px] border-2 border-[#4ADE80]" />

                  <div className="absolute h-1.5 w-1.5 rounded-full bg-[#A3E635]" />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </h1>

              <p className="text-sm text-foreground/60">
                A quiet place for your digital world.
              </p>
            </div>
          </div>

          
          {children}

          <p className="mt-6 text-center text-[10px] text-foreground/60">
            © 2026 {(new Date().getFullYear()) === 2026 ? "" : `- ${new Date().getFullYear()}`} {process.env.NEXT_PUBLIC_APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
