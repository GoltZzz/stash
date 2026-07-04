import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  useDerivedValue,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

import { CatMood } from './cat-sprite';

type CatSVGProps = {
  size?: number;
  mood?: CatMood;
  onTap?: () => void;
  interactive?: boolean;
  selected?: boolean;
};

// Theme Color Hex Codes (matching the mobile/src/global.css variables)
const COLORS = {
  orange: '#ea580c',      // primary orange
  orangeDeep: '#c2410c',  // deep stripe/shading orange
  orangeSoft: '#ffedd5',  // soft cream tint
  cream: '#fffbf5',       // warm body chest patch
  ink: '#291c12',         // stroke / eyes / outlines
  inkLight: '#786252',    // secondary text
  line: '#eadac8',        // soft border
  blush: '#ffcbd1',       // rose blush
  sweat: '#3b82f6',       // stress blue sweat drop
  heart: '#dc2626',       // happy heart red
  white: '#ffffff',       // eye highlights/shocked whites
};

const AnimatedG = Animated.createAnimatedComponent(G);

// -------------------------------------------------------------
// ASCII SPRITES DEFINITIONS (48x48 logical grid space)
// Legend:
// . or space = transparent
// # = outline (COLORS.ink)
// o = body orange (COLORS.orange)
// s = deep orange shadow (COLORS.orangeDeep)
// c = cream chest patch (COLORS.cream)
// h = orange soft highlight (COLORS.orangeSoft)
// p = blush pink (COLORS.blush)
// w = eye white (COLORS.white)
// r = heart red (COLORS.heart)
// b = sweat blue (COLORS.sweat)
// -------------------------------------------------------------

const SHADOW_SPRITE = [
  "      ##########      ",
  "    ##############    ",
  "      ##########      "
];

const BODY_SPRITE = [
  "        ################        ",
  "      ##oooooooooooooooo##      ",
  "     #oooooooooooooooooooo#     ",
  "    #oooossssssssssssssoooo#    ",
  "   #ooosssccccccccccccossoo#    ",
  "  #ooossscccccccccccccsssoo#    ",
  "  #ooosscccccccccccccccsssoo#   ",
  " #ooosscccccccccccccccccosso#   ",
  " #ooss###cccccccccc###coosso#   ", // paws / arms outlines
  " #ooss#oo#cccccccc#oo#coosso#   ",
  " #ooss#cc#cccccccc#cc#coosso#   ", // cream paw pads
  "#oooss###cccccccccc###coossoo#  ",
  "#ooossssscccccccccccsssoossoo#  ",
  "#oooosssscccccccccccssssooooo#  ",
  "#ooooossscccccccccccssssooooo#  ",
  " #ooooosssccccccccccsssooooo#   ",
  " #oooooosssccccccccsssoooooo#   ",
  "  #ooooooosssssssssooooooo#     ",
  "   #ooooooosssssssssooooo#      ",
  "    #oo#############oo##        ", // feet
  "     ##cccc#     ##cccc#        ", // white claws
  "       ####        ####         "
];

const HEAD_SPRITE_GOOD = [
  "  ####                     ####  ",
  " #oohh##                 ##hhoo# ",
  " #oohhhho#             #ohhhhoo# ",
  " #oohhhhho#           #ohhhhhoo# ",
  " #oohhhhhho###########ohhhhhhoo# ",
  "  #oohhhhhhhhhhhhhhhhhhhhhhoo#   ",
  "  ##oohhhhhhhhhhhhhhhhhhhhhoo##  ",
  " #ooossssssssssssssssssssssooo#  ",
  " #oooooooooooooooooooooooooooo#  ",
  "#oooooooooooooooooooooooooooooo# ",
  "#oooooooooooooooooooooooooooooo# ",
  "#oooooo..oooooooooooo..oooooooo# ", // eye slots (column 7-9 and 21-23)
  "#oooopp..oooooooooooo..ppoooooo# ", // blush slots
  "#ooooppooooooooooooooooppoooooo# ",
  " #oooooooooooooooooooooooooooo#  ",
  " ##oooooooooooooooooooooooooo##  ",
  "  #oooooooooooooooooooooooooo#   ",
  "   ##oooooooooooooooooooooo##    ",
  "     ######################      ",
  "       ##################        "
];

const HEAD_SPRITE_WORRIED = [
  "                                 ",
  "  ####                     ####  ",
  " #oohh##                 ##hhoo# ",
  "   #oohhhho###########ohhhhoo#   ",
  "   #oohhhhhhhhhhhhhhhhhhhhhhoo#  ",
  "  #oohhhhhhhhhhhhhhhhhhhhhhoo#   ",
  "  ##oohhhhhhhhhhhhhhhhhhhhhoo##  ",
  " #ooossssssssssssssssssssssooo#  ",
  " #oooooooooooooooooooooooooooo#  ",
  "#oooooooooooooooooooooooooooooo# ",
  "#oooooooooooooooooooooooooooooo# ",
  "#oooooo..oooooooooooo..oooooooo# ",
  "#oooopp..oooooooooooo..ppoooooo# ",
  "#ooooppooooooooooooooooppoooooo# ",
  " #oooooooooooooooooooooooooooo#  ",
  " ##oooooooooooooooooooooooooo##  ",
  "  #oooooooooooooooooooooooooo#   ",
  "   ##oooooooooooooooooooooo##    ",
  "     ######################      ",
  "       ##################        "
];

const HEAD_SPRITE_SLEEP = [
  "                                 ",
  "                                 ",
  "  ####                     ####  ",
  " #oohh##                 ##hhoo# ",
  "   #oohhhho###########ohhhhoo#   ",
  "  #oohhhhhhhhhhhhhhhhhhhhhhoo#   ",
  "  ##oohhhhhhhhhhhhhhhhhhhhhoo##  ",
  " #ooossssssssssssssssssssssooo#  ",
  " #oooooooooooooooooooooooooooo#  ",
  "#oooooooooooooooooooooooooooooo# ",
  "#oooooooooooooooooooooooooooooo# ",
  "#oooooo..oooooooooooo..oooooooo# ",
  "#oooopp..oooooooooooo..ppoooooo# ",
  "#ooooppooooooooooooooooppoooooo# ",
  " #oooooooooooooooooooooooooooo#  ",
  " ##oooooooooooooooooooooooooo##  ",
  "  #oooooooooooooooooooooooooo#   ",
  "   ##oooooooooooooooooooooo##    ",
  "     ######################      ",
  "       ##################        "
];

const EYES_GOOD_LEFT = [
  " ### ",
  "#w###",
  "#####",
  " ### "
];
const EYES_GOOD_RIGHT = [
  " ### ",
  "###w#",
  "#####",
  " ### "
];

const EYES_WARNING_LEFT = [
  " ### ",
  "#####",
  "#ww##",
  " ### "
];
const EYES_WARNING_RIGHT = [
  " ### ",
  "#####",
  "##ww#",
  " ### "
];

const EYES_CRITICAL_LEFT = [
  " ### ",
  "#www#",
  "#w#w#",
  "#www#",
  " ### "
];
const EYES_CRITICAL_RIGHT = [
  " ### ",
  "#www#",
  "#w#w#",
  "#www#",
  " ### "
];

const EYES_EMPTY_LEFT = [
  ".....",
  "#####",
  "....."
];
const EYES_EMPTY_RIGHT = [
  ".....",
  "#####",
  "....."
];

const EYES_JUMPING_LEFT = [
  ".#.",
  "#.#",
  "..."
];
const EYES_JUMPING_RIGHT = [
  ".#.",
  "#.#",
  "..."
];

const SNOUT_SPRITE = [
  "  #  ",
  " # # "
];

const TAIL_SPRITE = [
  "      ######      ",
  "    ##oooooo##    ",
  "   #oooooooooo#   ",
  "  #oooooooooooo#  ",
  " #oooooooooooooo# ",
  " #ossssoooooooos# ",
  " #ossssssooooosss#",
  " #osssssssooossss#",
  "  #ossssssooosss# ",
  "   #ossssooooss#  ",
  "    #osssooosss#  ",
  "     #ssooosss#   ",
  "     #ssooosss#   ",
  "     #ssooosss#   ",
  "    #osoooosss#   ",
  "   #oosoooosss#   ",
  "  #oossooooosss#  ",
  " #oossooooooosss# ",
  "#oossoooooooosss# ",
  "#oossoooooooosss# ",
  " #oossoooooosss#  ",
  "  ##oossoooss##   ",
  "    #######       ",
  "      ###         "
];

const SWEAT_SPRITE = [
  "  #  ",
  " #b# ",
  "#bb#",
  " ## "
];

const HEART_SPRITE = [
  " # # ",
  "###r#",
  "#rrr#",
  " #r# ",
  "  #  "
];

const ZZZ_SMALL = [
  "##",
  " #",
  "##"
];

const ZZZ_LARGE = [
  "###",
  "  #",
  " # ",
  "###"
];

// -------------------------------------------------------------
// ASCII SPRITE PARSER
// Compiles ASCII character matrix to SVG path commands d
// -------------------------------------------------------------
function parseAsciiSprite(
  grid: string[],
  cellSize: number = 3,
  offsetX: number = 0,
  offsetY: number = 0
): Record<string, string> {
  const paths: Record<string, string> = {};

  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    let currentChar = '';
    let startC = -1;

    for (let c = 0; c < row.length; c++) {
      const char = row[c];

      if (char !== currentChar) {
        if (currentChar && currentChar !== '.' && currentChar !== ' ') {
          if (!paths[currentChar]) paths[currentChar] = '';
          const x = offsetX + startC * cellSize;
          const y = offsetY + r * cellSize;
          const w = (c - startC) * cellSize;
          const h = cellSize;
          paths[currentChar] += `M ${x} ${y} h ${w} v ${h} h -${w} z `;
        }
        currentChar = char;
        startC = c;
      }
    }

    // Flush end of row
    if (currentChar && currentChar !== '.' && currentChar !== ' ') {
      if (!paths[currentChar]) paths[currentChar] = '';
      const x = offsetX + startC * cellSize;
      const y = offsetY + r * cellSize;
      const w = (row.length - startC) * cellSize;
      const h = cellSize;
      paths[currentChar] += `M ${x} ${y} h ${w} v ${h} h -${w} z `;
    }
  }

  return paths;
}

// Pre-compile static path commands to avoid runtime overhead
const PATHS_SHADOW = parseAsciiSprite(SHADOW_SPRITE, 3, 47, 136);
const PATHS_BODY = parseAsciiSprite(BODY_SPRITE, 3, 32, 74);
const PATHS_SNOUT = parseAsciiSprite(SNOUT_SPRITE, 3, 75, 59);

const PATHS_HEAD_GOOD = parseAsciiSprite(HEAD_SPRITE_GOOD, 3, 32, 20);
const PATHS_HEAD_WORRIED = parseAsciiSprite(HEAD_SPRITE_WORRIED, 3, 32, 20);
const PATHS_HEAD_SLEEP = parseAsciiSprite(HEAD_SPRITE_SLEEP, 3, 32, 20);

const PATHS_EYES_GOOD_L = parseAsciiSprite(EYES_GOOD_LEFT, 3, 53, 50);
const PATHS_EYES_GOOD_R = parseAsciiSprite(EYES_GOOD_RIGHT, 3, 95, 50);

const PATHS_EYES_WARNING_L = parseAsciiSprite(EYES_WARNING_LEFT, 3, 53, 50);
const PATHS_EYES_WARNING_R = parseAsciiSprite(EYES_WARNING_RIGHT, 3, 95, 50);

const PATHS_EYES_CRITICAL_L = parseAsciiSprite(EYES_CRITICAL_LEFT, 3, 53, 50);
const PATHS_EYES_CRITICAL_R = parseAsciiSprite(EYES_CRITICAL_RIGHT, 3, 95, 50);

const PATHS_EYES_EMPTY_L = parseAsciiSprite(EYES_EMPTY_LEFT, 3, 53, 50);
const PATHS_EYES_EMPTY_R = parseAsciiSprite(EYES_EMPTY_RIGHT, 3, 95, 50);

const PATHS_EYES_JUMPING_L = parseAsciiSprite(EYES_JUMPING_LEFT, 3, 53, 50);
const PATHS_EYES_JUMPING_R = parseAsciiSprite(EYES_JUMPING_RIGHT, 3, 95, 50);

const PATHS_TAIL = parseAsciiSprite(TAIL_SPRITE, 3, 100, 64);
const PATHS_SWEAT = parseAsciiSprite(SWEAT_SPRITE, 3, 112, 40);
const PATHS_HEART = parseAsciiSprite(HEART_SPRITE, 3, 100, 40);

const PATHS_ZZZ_S = parseAsciiSprite(ZZZ_SMALL, 3, 118, 38);
const PATHS_ZZZ_L = parseAsciiSprite(ZZZ_LARGE, 3, 126, 26);

// Color-to-brand mapping helper
const renderColorPaths = (paths: Record<string, string>) => {
  return Object.keys(paths).map((char) => {
    const fill = COLOR_MAP[char];
    if (!fill) return null;
    return <Path key={char} d={paths[char]} fill={fill} />;
  });
};

const COLOR_MAP: Record<string, string> = {
  '#': COLORS.ink,
  'o': COLORS.orange,
  's': COLORS.orangeDeep,
  'c': COLORS.cream,
  'h': COLORS.orangeSoft,
  'p': COLORS.blush,
  'w': COLORS.white,
  'r': COLORS.heart,
  'b': COLORS.sweat,
};

export default function CatSVG({
  size = 150,
  mood = 'good',
  onTap,
  interactive = true,
  selected,
}: CatSVGProps) {
  const reducedMotion = useReducedMotion();

  // Shared Animation Values
  const jumpY = useSharedValue(0);
  const scaleX = useSharedValue(1);
  const scaleY = useSharedValue(1);
  const breathScaleY = useSharedValue(1);
  const headY = useSharedValue(0);
  const headRotation = useSharedValue(0);
  const tailRotation = useSharedValue(0);
  const earLeftRotation = useSharedValue(0);
  const earRightRotation = useSharedValue(0);
  const blinkScaleY = useSharedValue(1);

  // Floating Effects
  const heartOpacity = useSharedValue(0);
  const heartY = useSharedValue(0);
  const sweatOpacity = useSharedValue(0);
  const sweatScale = useSharedValue(0);
  const zzzOpacity = useSharedValue(0);

  // 1. Idle Breathing and Head Bobbing
  useEffect(() => {
    if (reducedMotion) {
      breathScaleY.value = 1;
      headY.value = 0;
      return;
    }

    breathScaleY.value = withRepeat(
      withTiming(1.025, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );

    headY.value = withRepeat(
      withTiming(0.8, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [reducedMotion]);

  // 2. Dynamic Tail-Wagging based on Mood
  useEffect(() => {
    if (reducedMotion) {
      tailRotation.value = 0;
      return;
    }

    let duration = 2000;
    let targetRotation = 10; // degrees

    if (mood === 'critical') {
      duration = 320;
      targetRotation = 26;
    } else if (mood === 'warning') {
      duration = 750;
      targetRotation = 16;
    } else if (mood === 'empty') {
      duration = 4000;
      targetRotation = -6; // low droop
    } else if (mood === 'walking') {
      duration = 1000;
      targetRotation = 12;
    }

    tailRotation.value = withRepeat(
      withSequence(
        withTiming(-targetRotation, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }),
        withTiming(targetRotation, { duration: duration / 2, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [mood, reducedMotion]);

  // 3. Ear Posture and Stress Drops/Sleep Indicators based on Mood
  useEffect(() => {
    let earLeftTarget = 0;
    let earRightTarget = 0;
    let headRotTarget = 0;

    // Default states
    sweatOpacity.value = withTiming(0, { duration: 200 });
    sweatScale.value = withTiming(0, { duration: 200 });
    zzzOpacity.value = withTiming(0, { duration: 200 });

    if (mood === 'critical') {
      earLeftTarget = 16;   // Airplane ears pointing out/down
      earRightTarget = -16;
      headRotTarget = 2;
      
      // Stress sweat drop popping up
      sweatOpacity.value = withTiming(1, { duration: 300 });
      sweatScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0.85, { duration: 150 }),
          withTiming(1, { duration: 150 })
        ),
        -1,
        true
      );
    } else if (mood === 'warning') {
      earLeftTarget = 10;
      earRightTarget = -10;
      headRotTarget = -1;
    } else if (mood === 'empty') {
      earLeftTarget = 7;    // Sad, forward drooped ears
      earRightTarget = -7;
      headRotTarget = -3;
      
      // Floating Zzzs for sleeping/inactive cat
      zzzOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 0 }),
          withTiming(1, { duration: 1200, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        false
      );
    } else if (mood === 'walking') {
      headRotTarget = 1;
    }

    earLeftRotation.value = withTiming(earLeftTarget, { duration: 300 });
    earRightRotation.value = withTiming(earRightTarget, { duration: 300 });
    headRotation.value = withTiming(headRotTarget, { duration: 400 });
  }, [mood]);

  // 4. Random Periodic Blinking (for good/warning/walking states)
  useEffect(() => {
    if (reducedMotion) return;

    const blinkInterval = setInterval(() => {
      // Don't blink if cat is sleeping/sad (empty) or in extreme shock (critical)
      if (mood === 'empty' || mood === 'critical') return;

      blinkScaleY.value = withSequence(
        withTiming(0, { duration: 70, easing: Easing.inOut(Easing.linear) }),
        withTiming(1, { duration: 110, easing: Easing.inOut(Easing.linear) })
      );
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, [mood, reducedMotion]);

  // 5. Spring-loaded Interactive Jump & Squish
  const handlePress = () => {
    if (reducedMotion) {
      onTap?.();
      return;
    }

    // Squash slightly before leaping up, then stretch, then squish on land
    scaleY.value = withSequence(
      withTiming(0.82, { duration: 50 }),
      withTiming(1.15, { duration: 100 }),
      withSpring(1, { damping: 9, stiffness: 120 })
    );
    scaleX.value = withSequence(
      withTiming(1.16, { duration: 50 }),
      withTiming(0.88, { duration: 100 }),
      withSpring(1, { damping: 9, stiffness: 120 })
    );

    jumpY.value = withSequence(
      withTiming(-32, { duration: 200, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 240, easing: Easing.bounce }),
      withTiming(0, {}, () => {
        // finished
      })
    );

    // Heart explosion particle effect
    heartY.value = 0;
    heartOpacity.value = 1;
    heartY.value = withTiming(-45, { duration: 800, easing: Easing.out(Easing.quad) });
    heartOpacity.value = withTiming(0, { duration: 800 });

    onTap?.();
  };

  useEffect(() => {
    if (selected && !reducedMotion) {
      scaleY.value = withSequence(
        withTiming(0.85, { duration: 40 }),
        withTiming(1.12, { duration: 90 }),
        withSpring(1, { damping: 9, stiffness: 125 })
      );
      scaleX.value = withSequence(
        withTiming(1.15, { duration: 40 }),
        withTiming(0.9, { duration: 90 }),
        withSpring(1, { damping: 9, stiffness: 125 })
      );

      jumpY.value = withSequence(
        withTiming(-20, { duration: 160, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 180, easing: Easing.bounce })
      );
    }
  }, [selected, reducedMotion]);

  // -------------------------------------------------------------
  // ANIMATED PROPS / STYLES SNAP-MAPPED TO INTEGER GRID COORDINATES
  // Each pixel is exactly 3 SVG units, so translations are rounded to multiples of 3.
  // -------------------------------------------------------------

  const shadowProps = useAnimatedProps(() => {
    const progress = Math.min(Math.max(-jumpY.value / 32, 0), 1);
    // Discrete scale steps (e.g. 1.0, 0.9, 0.8, 0.7, 0.6)
    const scale = 1 - Math.round(progress * 4) * 0.1;
    return {
      opacity: 1 - progress * 0.6,
      transform: `translate(80, 137) scale(${scale}) translate(-80, -137)`,
    };
  });

  const tailProps = useAnimatedProps(() => {
    // Snap tail rotation to multiples of 6 degrees
    const r = Math.round(tailRotation.value / 6) * 6;
    return {
      transform: `translate(100, 120) rotate(${r}) translate(-100, -120)`,
    };
  });

  const bodyProps = useAnimatedProps(() => {
    // Breathing: shift up/down by 0 or 1 grid cell (3 units)
    const breathProgress = (breathScaleY.value - 1) / 0.025; // 0 to 1
    const dy = Math.round(breathProgress) * -3;

    // Jump offset (snap to grid units)
    const jy = Math.round(jumpY.value / 3) * 3;

    // Walking walk cycle step
    let wx = 0;
    let wy = 0;
    if (mood === 'walking') {
      const angle = tailRotation.value;
      if (angle < -6) {
        wx = -3; wy = 0;
      } else if (angle < 0) {
        wx = 0; wy = -3;
      } else if (angle < 6) {
        wx = 3; wy = 0;
      } else {
        wx = 0; wy = -3;
      }
    }

    // Critical shake
    let shakeX = 0;
    let shakeY = 0;
    if (mood === 'critical') {
      const tick = Math.floor(tailRotation.value * 10);
      shakeX = ((tick + 1) % 3 - 1) * 3;
      shakeY = (((tick + 1) >> 1) % 3 - 1) * 3;
    }

    const tx = wx + shakeX;
    const ty = dy + jy + wy + shakeY;

    return {
      transform: `translate(${tx}, ${ty})`,
    };
  });

  const headProps = useAnimatedProps(() => {
    // Breathing/bobbing: head offset
    const progress = headY.value; // 0 to 0.8
    let dy = Math.round(progress) * -3;

    // Head tilt: snap to multiples of 3 degrees
    const rot = Math.round(headRotation.value / 3) * 3;

    // Jump offset
    const jy = Math.round(jumpY.value / 3) * 3;

    // Critical shake
    let shakeX = 0;
    let shakeY = 0;
    if (mood === 'critical') {
      const tick = Math.floor(tailRotation.value * 10);
      shakeX = (tick % 3 - 1) * 3;
      shakeY = ((tick >> 1) % 3 - 1) * 3;
    }

    const tx = shakeX;
    const ty = dy + jy + shakeY;

    return {
      transform: `translate(${tx}, ${ty}) rotate(${rot})`,
    };
  });

  const sweatProps = useAnimatedProps(() => {
    // Snap sweat scale to 0, 0.5, 1
    const scale = Math.round(sweatScale.value * 2) / 2;
    return {
      opacity: sweatOpacity.value,
      transform: `translate(112, 40) scale(${scale}) translate(-112, -40)`,
    };
  });

  const heartProps = useAnimatedProps(() => {
    // Float up discretely
    const dy = Math.round(heartY.value / 3) * 3;
    return {
      opacity: heartOpacity.value,
      transform: `translate(0, ${dy})`,
    };
  });

  const zzzProps = useAnimatedProps(() => {
    const progress = zzzOpacity.value; // 0 to 1
    const dy = Math.round(progress * -15) * 3;
    const dx = Math.round(Math.sin(progress * Math.PI * 2) * 2) * 3;
    return {
      opacity: progress,
      transform: `translate(${dx}, ${dy})`,
    };
  });

  // -------------------------------------------------------------
  // RENDERING HELPERS FOR MOOD-SPECIFIC COMPONENT SPRITES
  // -------------------------------------------------------------
  
  const getHeadPaths = () => {
    if (mood === 'empty') return PATHS_HEAD_SLEEP;
    if (mood === 'warning' || mood === 'critical') return PATHS_HEAD_WORRIED;
    return PATHS_HEAD_GOOD;
  };

  const getLeftEyePaths = () => {
    if (jumpY.value < -2) return PATHS_EYES_JUMPING_L;
    if (mood === 'empty') return PATHS_EYES_EMPTY_L;
    if (mood === 'critical') return PATHS_EYES_CRITICAL_L;
    if (mood === 'warning') return PATHS_EYES_WARNING_L;
    
    // Normal blinking state
    if (blinkScaleY.value < 0.3) return PATHS_EYES_EMPTY_L;
    return PATHS_EYES_GOOD_L;
  };

  const getRightEyePaths = () => {
    if (jumpY.value < -2) return PATHS_EYES_JUMPING_R;
    if (mood === 'empty') return PATHS_EYES_EMPTY_R;
    if (mood === 'critical') return PATHS_EYES_CRITICAL_R;
    if (mood === 'warning') return PATHS_EYES_WARNING_R;
    
    // Normal blinking state
    if (blinkScaleY.value < 0.3) return PATHS_EYES_EMPTY_R;
    return PATHS_EYES_GOOD_R;
  };

  const RootComponent = interactive ? Pressable : View;
  const rootProps = interactive ? { onPress: handlePress } : {};

  return (
    <RootComponent {...rootProps} style={styles.pressableContainer}>
      <Animated.View style={{ width: size, height: size }}>
        <Svg viewBox="0 0 160 160" width="100%" height="100%">
          {/* 1. SHADOW (scales dynamically below the body) */}
          <AnimatedG animatedProps={shadowProps}>
            {renderColorPaths(PATHS_SHADOW)}
          </AnimatedG>

          {/* 2. TAIL (swings dynamically) */}
          <AnimatedG animatedProps={tailProps}>
            {renderColorPaths(PATHS_TAIL)}
          </AnimatedG>

          {/* 3. BODY & CHEST PATCH (breathes and walks continuously) */}
          <AnimatedG animatedProps={bodyProps}>
            {renderColorPaths(PATHS_BODY)}
          </AnimatedG>

          {/* 4. HEAD & FACE DETAILS (bobs, tilts, blinks, expressions) */}
          <AnimatedG animatedProps={headProps}>
            {/* Chubby Head shape + ears */}
            {renderColorPaths(getHeadPaths())}

            {/* Left Eye */}
            {renderColorPaths(getLeftEyePaths())}

            {/* Right Eye */}
            {renderColorPaths(getRightEyePaths())}

            {/* Nose & Mouth */}
            {renderColorPaths(PATHS_SNOUT)}

            {/* Stress Sweat Drop */}
            <AnimatedG animatedProps={sweatProps}>
              {renderColorPaths(PATHS_SWEAT)}
            </AnimatedG>
          </AnimatedG>

          {/* 5. FLOATING INTERACTION PARTICLES (Hearts & Zzzs) */}
          {/* Floating Heart (Tap) */}
          <AnimatedG animatedProps={heartProps}>
            {renderColorPaths(PATHS_HEART)}
          </AnimatedG>

          {/* Sleeping Zzzs (Empty) */}
          <AnimatedG animatedProps={zzzProps}>
            {renderColorPaths(PATHS_ZZZ_S)}
            {renderColorPaths(PATHS_ZZZ_L)}
          </AnimatedG>
        </Svg>
      </Animated.View>
    </RootComponent>
  );
}

const styles = StyleSheet.create({
  pressableContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
});
