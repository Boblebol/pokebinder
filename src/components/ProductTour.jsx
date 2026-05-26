import React from 'react';
import { hexToRgba } from '../utils/color.js';

export const TOUR_STEPS = [
  {
    title: "Bienvenue sur PokéClasseur ! ✨",
    desc: "Cette application vous aide à organiser vos cartes Pokémon physiques dans vos vrais classeurs. Laissez-nous calculer les emplacements parfaits !",
    tab: "pokedex"
  },
  {
    title: "Le Pokédex 🔴",
    desc: "Déclarez vos cartes ici. Cliquez pour marquer un Pokémon comme 'Rangé' (dans le classeur) ou 'En main' (prêt à être trié).",
    tab: "pokedex"
  },
  {
    title: "Le Visuel des Classeurs 📖",
    desc: "Ce classeur interactif simule vos pages physiques. Il vous indique la page, la ligne et la colonne de chaque carte !",
    tab: "binders"
  },
  {
    title: "Badges & Succès 🏅",
    desc: "Relevez des défis en complétant les équipes des Champions d'Arène, les rapports de recherche des Professeurs, ou les Maîtrises de Type !",
    tab: "succes"
  },
  {
    title: "Statistiques 📊",
    desc: "Suivez votre complétion par région et type. C'est également ici que vous pouvez sauvegarder (exporter) ou restaurer votre collection en JSON.",
    tab: "dashboard"
  },
  {
    title: "Configuration ⚙️",
    desc: "Personnalisez la taille de vos pages (9 ou 12 cases), modifiez le thème visuel, et vérifiez ou forcez les mises à jour de l'application !",
    tab: "settings"
  }
];

export default function ProductTour({ step, onNext, onPrev, onClose, theme }) {
  const current = TOUR_STEPS[step];
  if (!current) return null;

  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Dark backdrop overlay to dim screen contents (excluding TabBar) */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 82,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 1999,
          pointerEvents: 'auto'
        }}
      />

      {/* Floating Guided Tour Card */}
      <div style={{
        position: 'absolute',
        bottom: 96,
        left: 16,
        right: 16,
        background: 'rgba(16, 16, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1.5px solid ${theme.accent}44`,
        borderRadius: 16,
        padding: '16px 18px',
        boxShadow: `0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px ${theme.accent}15`,
        zIndex: 2000,
        animation: 'tourSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        {/* Step Indicator */}
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 8,
          color: theme.accent,
          marginBottom: 6,
          letterSpacing: 1
        }}>
          GUIDE · {step + 1} / {TOUR_STEPS.length}
        </div>

        {/* Title */}
        <div style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 6,
          lineHeight: 1.3
        }}>
          {current.title}
        </div>

        {/* Description */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.65)',
          fontSize: 13,
          lineHeight: 1.5,
          marginBottom: 16
        }}>
          {current.desc}
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
              color: 'rgba(255, 255, 255, 0.35)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 0',
              fontFamily: 'inherit',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.35)'}
          >
            Passer
          </button>

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={onPrev}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
              >
                Précédent
              </button>
            )}

            <button
              onClick={onNext}
              style={{
                background: theme.accent,
                border: 'none',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: `0 4px 12px ${theme.accent}25`,
                transition: 'transform 0.1s, opacity 0.2s'
              }}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLast ? "Terminer" : "Suivant"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
