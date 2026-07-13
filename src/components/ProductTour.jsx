import React, { useState, useEffect, useRef } from 'react';

export const TOUR_STEPS = [
  {
    title: "Bienvenue sur PokéClasseur ! ✨",
    desc: "Cette application vous aide à organiser vos cartes Pokémon physiques dans vos vrais classeurs. Suivez ce guide pour découvrir toutes les fonctionnalités !",
    tab: "pokedex",
    target: null,
    position: "center"
  },
  {
    title: "Votre barre de navigation 🧭",
    desc: "5 onglets pour tout gérer : Pokédex, Succès, Classeurs, Stats et Configuration. Chaque onglet a un rôle unique !",
    tab: "pokedex",
    target: '[data-tour="tabbar"]',
    position: "above",
    padding: 6
  },
  {
    title: "Vos cartes Pokémon 🔴",
    desc: "Voici la grille de votre Pokédex. Tapez sur une carte pour voir ses détails complets : types, stats, évolutions, et sa position exacte dans le classeur.",
    tab: "pokedex",
    target: '[data-tour="first-card"]',
    position: "below",
    padding: 6
  },
  {
    title: "Le bouton statut 🔄",
    desc: "Ce petit bouton change l'état de la carte :\n○ Manquant → ✋ En main → ✓ Rangé → ○\nUtilisez-le pour tracker rapidement vos cartes !",
    tab: "pokedex",
    target: '[data-tour="status-btn"]',
    position: "below",
    padding: 8
  },
  {
    title: "Le Visuel des Classeurs 📖",
    desc: "Ce classeur interactif simule vos pages physiques. Chaque case montre la position exacte (page, côté, ligne, colonne). Tapez une case pour changer son statut !",
    tab: "binders",
    target: '[data-tour="binder-page"]',
    position: "below",
    padding: 4
  },
  {
    title: "Badges & Succès 🏅",
    desc: "Relevez des défis ! Collectez l'équipe complète d'un Champion d'Arène pour débloquer son badge. Des succès spéciaux vous attendent aussi !",
    tab: "succes",
    target: '[data-tour="tabbar"]',
    position: "above",
    padding: 6
  },
  {
    title: "Sauvegardez votre progression 💾",
    desc: "Ce bouton exporte votre collection en fichier JSON. Pensez à sauvegarder régulièrement pour ne jamais perdre votre avancement !",
    tab: "dashboard",
    target: '[data-tour="export-btn"]',
    position: "above",
    padding: 6
  },
  {
    title: "Personnalisez votre classeur ⚙️",
    desc: "Configurez la taille de vos pages (9, 12 ou 16 cases), activez le regroupement par famille d'évolution, et changez le thème visuel !",
    tab: "settings",
    target: '[data-tour="page-format"]',
    position: "below",
    padding: 6
  },
  {
    title: "C'est parti ! 🚀",
    desc: "Vous êtes prêt ! Commencez par marquer vos cartes dans le Pokédex. Vous pouvez relancer ce guide à tout moment depuis les réglages.",
    tab: "pokedex",
    target: null,
    position: "center"
  }
];

/**
 * Get the bounding rect of a target element relative to the .dev container.
 * Falls back to viewport-relative if .dev is not found.
 */
function getRelativeRect(targetEl) {
  const devEl = document.querySelector('.dev');
  const targetRect = targetEl.getBoundingClientRect();

  if (devEl) {
    const devRect = devEl.getBoundingClientRect();
    return {
      top: targetRect.top - devRect.top,
      left: targetRect.left - devRect.left,
      width: targetRect.width,
      height: targetRect.height,
      bottom: devRect.height - (targetRect.bottom - devRect.top),
      right: devRect.width - (targetRect.right - devRect.left),
      devWidth: devRect.width,
      devHeight: devRect.height
    };
  }

  return {
    top: targetRect.top,
    left: targetRect.left,
    width: targetRect.width,
    height: targetRect.height,
    bottom: window.innerHeight - targetRect.bottom,
    right: window.innerWidth - targetRect.right,
    devWidth: window.innerWidth,
    devHeight: window.innerHeight
  };
}

export default function ProductTour({ step, onNext, onPrev, onClose, theme }) {
  const current = TOUR_STEPS[step];
  const [rect, setRect] = useState(null);
  const [tabbarRect, setTabbarRect] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const tooltipRef = useRef(null);

  const target = current?.target || null;
  const isTabbarStep = step === 5 || step === 6 || step === 7;

  // Measure target element position
  useEffect(() => {
    const timers = [];

    if (!target) {
      setRect(null);
    } else {
      timers.push(setTimeout(() => {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'nearest' });
          setRect(getRelativeRect(el));
        } else {
          setRect(null);
        }
      }, 180));
    }

    // Measure TabBar if needed (steps 6, 7, 8 -> step indices 5, 6, 7)
    if (isTabbarStep) {
      timers.push(setTimeout(() => {
        const el = document.querySelector('[data-tour="tabbar"]');
        if (el) {
          setTabbarRect(getRelativeRect(el));
        } else {
          setTabbarRect(null);
        }
      }, 180));
    } else {
      setTabbarRect(null);
    }

    setAnimKey(k => k + 1);
    return () => timers.forEach(clearTimeout);
  }, [step, target, isTabbarStep]);

  // Recalculate on resize and scroll
  useEffect(() => {
    const handleUpdate = () => {
      if (target) {
        const el = document.querySelector(target);
        if (el) {
          setRect(getRelativeRect(el));
        }
      }
      if (isTabbarStep) {
        const el = document.querySelector('[data-tour="tabbar"]');
        if (el) {
          setTabbarRect(getRelativeRect(el));
        }
      }
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { capture: true, passive: true });
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, { capture: true });
    };
  }, [target, isTabbarStep]);

  if (!current) return null;

  const isLast = step === TOUR_STEPS.length - 1;
  const isFirst = step === 0;
  const hasTarget = !!target;
  const pad = current.padding || 8;

  // Compute spotlight cutout styles
  const spotlightStyle = rect ? {
    position: 'absolute',
    top: rect.top - pad,
    left: rect.left - pad,
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
    borderRadius: 14,
    border: `2px solid ${theme.accent}55`,
    zIndex: 2000,
    pointerEvents: 'none',
    animation: 'spotlightPulse 2s ease-in-out infinite',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
  } : null;

  // Compute tooltip position
  const getTooltipPosition = () => {
    if (!hasTarget || !rect) {
      // Center the tooltip
      return {
        position: 'absolute',
        top: '50%',
        left: 16,
        right: 16,
        transform: 'translateY(-50%)',
      };
    }

    const tooltipHeight = 200; // approximate max height
    const margin = 14;

    if (current.position === 'above' || (current.position !== 'below' && rect.top > tooltipHeight + margin + pad)) {
      // Place above the spotlight
      return {
        position: 'absolute',
        bottom: (rect.devHeight || 844) - rect.top + pad + margin,
        left: 16,
        right: 16,
      };
    } else {
      // Place below the spotlight
      return {
        position: 'absolute',
        top: rect.top + rect.height + pad + margin,
        left: 16,
        right: 16,
      };
    }
  };

  const tooltipPos = getTooltipPosition();

  // Format description with line breaks
  const formatDesc = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {i > 0 && <br />}
        {line}
      </React.Fragment>
    ));
  };

  return (
    <>
      {/* Backdrop - different for spotlight vs full overlay */}
      {hasTarget && rect ? (
        <>
          {/* Spotlight cutout outline (purely decorative) */}
          <div style={spotlightStyle} />

          {/* Secondary Spotlight for TabBar (Steps 6, 7, 8) */}
          {tabbarRect && (!rect || rect.top !== tabbarRect.top) && (
            <div
              style={{
                position: 'absolute',
                top: tabbarRect.top - 6,
                left: tabbarRect.left - 6,
                width: tabbarRect.width + 12,
                height: tabbarRect.height + 12,
                borderRadius: 14,
                border: `2px solid ${theme.accent}55`,
                zIndex: 2000,
                pointerEvents: 'none',
                animation: 'spotlightPulse 2s ease-in-out infinite',
                transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          )}

          {/* 4 Backdrop Panels around the spotlight */}
          {/* Top Panel */}
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: Math.max(0, rect.top - pad),
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 1999,
              pointerEvents: 'auto',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
          {/* Bottom Panel */}
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              top: rect.top + rect.height + pad,
              left: 0,
              width: '100%',
              bottom: tabbarRect && (!rect || rect.top !== tabbarRect.top)
                ? (rect.devHeight || 844) - (tabbarRect.top - 6)
                : 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 1999,
              pointerEvents: 'auto',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
          {/* Left Panel */}
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              top: rect.top - pad,
              left: 0,
              width: Math.max(0, rect.left - pad),
              height: rect.height + pad * 2,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 1999,
              pointerEvents: 'auto',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
          {/* Right Panel */}
          <div
            onClick={onClose}
            style={{
              position: 'absolute',
              top: rect.top - pad,
              left: rect.left + rect.width + pad,
              right: 0,
              height: rect.height + pad * 2,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              zIndex: 1999,
              pointerEvents: 'auto',
              transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </>
      ) : (
        /* Full dark overlay when no target */
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            zIndex: 1999,
            pointerEvents: 'auto'
          }}
        />
      )}

      {/* Tooltip Card */}
      <div
        key={animKey}
        ref={tooltipRef}
        style={{
          ...tooltipPos,
          background: 'rgba(12, 12, 22, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: `1.5px solid ${theme.accent}44`,
          borderRadius: 18,
          padding: '18px 20px 16px',
          boxShadow: `0 16px 48px rgba(0, 0, 0, 0.7), 0 0 24px ${theme.accent}18`,
          zIndex: 2002,
          animation: 'tourBubbleEnter 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: "'DM Sans', sans-serif",
          pointerEvents: 'auto'
        }}
      >
        {/* Step indicator + dots */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10
        }}>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 7,
            color: theme.accent,
            letterSpacing: 1,
            opacity: 0.8
          }}>
            GUIDE · {step + 1} / {TOUR_STEPS.length}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 5 }}>
            {TOUR_STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 16 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === step
                    ? theme.accent
                    : i < step
                      ? `${theme.accent}88`
                      : 'rgba(255, 255, 255, 0.12)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'default'
                }}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{
          color: '#fff',
          fontSize: 17,
          fontWeight: 700,
          marginBottom: 8,
          lineHeight: 1.3,
          letterSpacing: -0.2
        }}>
          {current.title}
        </div>

        {/* Description */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: 13,
          lineHeight: 1.6,
          marginBottom: 18
        }}>
          {formatDesc(current.desc)}
        </div>

        {/* Controls row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Skip Button */}
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.3)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 0',
              fontFamily: 'inherit',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
          >
            Passer
          </button>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {!isFirst && (
              <button
                onClick={onPrev}
                style={{
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'rgba(255, 255, 255, 0.75)',
                  padding: '9px 16px',
                  borderRadius: 11,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.11)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                ← Précédent
              </button>
            )}

            <button
              onClick={onNext}
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)`,
                border: 'none',
                color: '#fff',
                padding: '9px 20px',
                borderRadius: 11,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: `0 4px 16px ${theme.accent}35`,
                transition: 'transform 0.12s, box-shadow 0.2s'
              }}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLast ? "C'est parti ! 🎉" : "Suivant →"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
