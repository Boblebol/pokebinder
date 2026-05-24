import { TRAINERS } from './trainers.js';
import { POKEMON_RAW } from './pokemon.js';

export const ACHIEVEMENTS = [
  {
    id: 'champ-kanto',
    label: 'Champion de Kanto',
    icon: '🔴',
    color: '#ff375f',
    desc: 'Décroche les 8 badges de Kanto.',
    check: (col) => TRAINERS.filter(t => t.region === 'kanto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-johto',
    label: 'Champion de Johto',
    icon: '⭐',
    color: '#ffd60a',
    desc: 'Décroche les 8 badges de Johto.',
    check: (col) => TRAINERS.filter(t => t.region === 'johto' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'champ-hoenn',
    label: 'Champion de Hoenn',
    icon: '💚',
    color: '#38b000',
    desc: 'Décroche les 8 badges de Hoenn.',
    check: (col) => TRAINERS.filter(t => t.region === 'hoenn' && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main'))
  },
  {
    id: 'grand-maitre',
    label: 'Grand Maître',
    icon: '👑',
    color: '#ffd700',
    desc: 'Champion des 3 régions.',
    check: (col) => ['kanto', 'johto', 'hoenn'].every(r => TRAINERS.filter(t => t.region === r && t.badge).every(t => t.team.every(id => col[id] === 'rangé' || col[id] === 'en main')))
  },
  {
    id: 'dresseur-ultime',
    label: 'Dresseur Ultime',
    icon: '🌟',
    color: '#c0a0ff',
    desc: 'Tous les 386 Pokémon rangés ou en main.',
    check: (col) => POKEMON_RAW.every(([id]) => col[id] === 'rangé' || col[id] === 'en main')
  }
];
