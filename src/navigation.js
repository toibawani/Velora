/**
 * Every top-level screen, in one list, with the places it can be reached from.
 *
 * There used to be four separate item lists - the bottom bar, the mobile
 * drawer, the header on the atlas, and the command palette - written out
 * independently. They drifted: the Curious Dictionary was in the header and the
 * drawer but not the bottom bar, the Journey was in none of them, and the
 * question desk was still labelled "Community" after the invented forum behind
 * that name was deleted. Four lists means four chances to forget a feature, and
 * the feature that gets forgotten is the one nobody clicks, so nobody notices
 * it is gone.
 *
 * One list, four renderings. Adding a screen means adding an entry here.
 *
 * `primary: true` puts a screen in the bottom bar as well as the drawer. That
 * bar is limited to six: at 375px, seven labels of 52px plus padding overflow
 * the viewport, and the layout check fails the build on exactly that. So
 * "primary" means used often enough to deserve the always-visible slot. The
 * rest are still one click from anywhere via the drawer, which keeps every
 * live feature within two clicks of the atlas.
 */
import {
  Compass,
  BookOpen,
  BookText,
  Gamepad2,
  BarChart3,
  Users,
  Clock,
  Map,
  Settings as SettingsIcon,
  ListTodo,
} from 'lucide-react';

export const SCREENS = [
  {
    id: 'universe',
    label: 'Atlas',
    drawerLabel: 'Home',
    description: 'Your learning home, and the knowledge atlas',
    icon: Compass,
    primary: true,
  },
  {
    id: 'learn',
    label: 'Learn',
    drawerLabel: 'Learn',
    description: 'Choose a subject and follow your curiosity',
    icon: BookOpen,
    primary: true,
  },
  {
    id: 'dictionary',
    label: 'Dictionary',
    drawerLabel: 'Curious Dictionary',
    description: 'Terms you looked up, with what they actually mean',
    icon: BookText,
    primary: true,
  },
  {
    id: 'games',
    label: 'Flow',
    drawerLabel: 'Flow Games',
    description: 'Short question-first games over what you have read',
    icon: Gamepad2,
    primary: true,
  },
  {
    id: 'analytics',
    label: 'Insights',
    drawerLabel: 'Analytics',
    description: 'Time actually spent, and what it went on',
    icon: BarChart3,
    primary: true,
  },
  {
    id: 'journey',
    label: 'Journey',
    drawerLabel: 'Journey',
    description: 'A timeline of the study sessions on this device',
    icon: Clock,
    primary: true,
  },
  {
    id: 'tasks',
    label: 'Next up',
    drawerLabel: 'Next up',
    description: 'Things you noticed while reading and want to come back to',
    icon: ListTodo,
    primary: false,
  },
  {
    id: 'roadmap',
    label: 'Roadmap',
    drawerLabel: 'Roadmap',
    description: 'What is built, what is half-built, what is not started',
    icon: Map,
    primary: false,
  },
  {
    id: 'settings',
    label: 'Settings',
    drawerLabel: 'Settings',
    description: 'Theme, and the answers you gave during setup',
    icon: SettingsIcon,
    primary: false,
  },
  {
    id: 'community',
    label: 'Questions',
    drawerLabel: 'Question desk',
    description: 'Questions you wrote down, and notes against them',
    icon: Users,
    primary: false,
  },
];

export const PRIMARY_SCREENS = SCREENS.filter((screen) => screen.primary);

export const SCREEN_IDS = SCREENS.map((screen) => screen.id);

export const findScreen = (id) => SCREENS.find((screen) => screen.id === id) || null;
