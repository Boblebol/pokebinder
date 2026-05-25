import { TRAINERS } from './trainers.js';
import { POKEMON_RAW } from './pokemon.js';

export const ACHIEVEMENTS = [
  {
    id: 'champ-kanto',
    label: 'Champion de Kanto',
    icon: '🔴',
    color: '#ff375f',
    desc: 'Décroche tous les badges de Kanto.',
    check: (col) => TRAINERS.filter(t => t.region === 'kanto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-johto',
    label: 'Champion de Johto',
    icon: '⭐',
    color: '#ffd60a',
    desc: 'Décroche tous les badges de Johto.',
    check: (col) => TRAINERS.filter(t => t.region === 'johto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-xy',
    label: 'Champion de Xy',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Xy.',
    check: (col) => TRAINERS.filter(t => t.region === 'xy' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-bw',
    label: 'Champion de Bw',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Bw.',
    check: (col) => TRAINERS.filter(t => t.region === 'bw' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-sm',
    label: 'Champion de Sm',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Sm.',
    check: (col) => TRAINERS.filter(t => t.region === 'sm' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-sv',
    label: 'Champion de Sv',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Sv.',
    check: (col) => TRAINERS.filter(t => t.region === 'sv' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-b2w2',
    label: 'Champion de B2w2',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de B2w2.',
    check: (col) => TRAINERS.filter(t => t.region === 'b2w2' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-gs',
    label: 'Champion de Gs',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Gs.',
    check: (col) => TRAINERS.filter(t => t.region === 'gs' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-swsh',
    label: 'Champion de Swsh',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Swsh.',
    check: (col) => TRAINERS.filter(t => t.region === 'swsh' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-rs',
    label: 'Champion de Rs',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Rs.',
    check: (col) => TRAINERS.filter(t => t.region === 'rs' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-dp',
    label: 'Champion de Dp',
    icon: '🏆',
    color: '#888888',
    desc: 'Décroche tous les badges de Dp.',
    check: (col) => TRAINERS.filter(t => t.region === 'dp' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'grand-maitre',
    label: 'Grand Maître',
    icon: '👑',
    color: '#ffd700',
    desc: 'Champion de toutes les régions.',
    check: (col) => ['kanto', 'johto', 'xy', 'bw', 'sm', 'sv', 'b2w2', 'gs', 'swsh', 'rs', 'dp'].every(r => TRAINERS.filter(t => t.region === r && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main')))
  },
  {
    id: 'dresseur-ultime',
    label: 'Dresseur Ultime',
    icon: '🌟',
    color: '#c0a0ff',
    desc: 'Tous les Pokémon rangés ou en main.',
    check: (col) => POKEMON_RAW.every(([id]) => col[id] === 'rangé' || col[id] === 'en main')
  }
];
