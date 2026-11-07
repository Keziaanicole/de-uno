// Night skyline with gold-lit windows, drawn once behind every screen.
import { memo, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const H = 190;

function City() {
  const { width } = useWindowDimensions();
  const { buildings, windows } = useMemo(() => {
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const buildings: { x: number; y: number; w: number; h: number; c: string }[] = [];
    const windows: { x: number; y: number; o: number }[] = [];
    ([['#1a130f', 0.55, 0.9], ['#140e0b', 0.8, 1]] as const).forEach(([c, minH, lit]) => {
      let x = -10;
      while (x < width) {
        const w = 18 + rnd() * 34, h = H * (minH * 0.45 + rnd() * minH * 0.55);
        buildings.push({ x, y: H - h, w, h, c });
        if (rnd() > 0.75) buildings.push({ x: x + w / 2 - 1, y: H - h - 14, w: 2, h: 14, c });
        for (let wy = H - h + 8; wy < H - 6; wy += 9)
          for (let wx = x + 4; wx < x + w - 5; wx += 7) if (rnd() > 0.72) windows.push({ x: wx, y: wy, o: 0.15 + rnd() * 0.45 * lit });
        x += w + 2;
      }
    });
    return { buildings, windows };
  }, [width]);
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: H }}>
      <Svg width={width} height={H}>
        <Defs>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0c0907" stopOpacity="1" />
            <Stop offset="0.45" stopColor="#0c0907" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {buildings.map((b, i) => <Rect key={`b${i}`} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.c} />)}
        {windows.map((w, i) => <Rect key={`w${i}`} x={w.x} y={w.y} width={2.5} height={3.5} fill="#e3c98f" fillOpacity={w.o} />)}
        <Rect x={0} y={0} width={width} height={H} fill="url(#fade)" />
      </Svg>
    </View>
  );
}
export default memo(City);
