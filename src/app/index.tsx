// The whole app lives on one route: sign-in → level check → three tabs.
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import City from '../components/City';
import SparkleLayer from '../components/SparkleLayer';
import TabBar, { type Tab } from '../components/TabBar';
import { Loading, Meter } from '../components/ui';
import { lvLabel, lvProgress } from '../lib/engine';
import { useStore } from '../lib/store';
import { C, F, GOLD_GRADIENT } from '../lib/theme';
import Grammar, { TopicSheet } from '../screens/Grammar';
import Onboarding from '../screens/Onboarding';
import Practice from '../screens/Practice';
import Roleplay from '../screens/Roleplay';
import SignIn from '../screens/SignIn';
import StatsSheet from '../screens/StatsSheet';

function Header({ onLevel }: { onLevel: () => void }) {
  const { S } = useStore();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <View style={styles.brandRow}>
        <LinearGradient colors={GOLD_GRADIENT} style={styles.mark}><Text style={styles.markText}>1</Text></LinearGradient>
        <Text style={styles.brand}>De Uno</Text>
      </View>
      <View style={{ flex: 1 }} />
      {S.stats.streak > 0 && <Text style={styles.streak}>✦ {S.stats.streak} {S.stats.streak === 1 ? 'día' : 'días'}</Text>}
      <Pressable onPress={onLevel} style={styles.chip} accessibilityRole="button" accessibilityLabel={`Level ${lvLabel(S.level)}. Open stats`}>
        <Text style={styles.chipLv}>{lvLabel(S.level)}</Text>
        <Meter value={lvProgress(S.level)} width={42} />
      </Pressable>
    </View>
  );
}

export default function Home() {
  const { authReady, session, guest, loaded, S } = useStore();
  const [tab, setTab] = useState<Tab>('practice');
  const [topic, setTopic] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [stats, setStats] = useState(false);

  let body;
  if (!authReady) body = <View style={styles.center}><Loading label="Opening De Uno…" /></View>;
  else if (!session && !guest) body = <SignIn />;
  else if (!loaded) body = <View style={styles.center}><Loading label="Loading your progress…" /></View>;
  else if (!S.placed)
    body = (<><Header onLevel={() => setStats(true)} /><Onboarding onDone={() => setTab('practice')} /></>);
  else
    body = (
      <>
        <Header onLevel={() => setStats(true)} />
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View style={[styles.page, tab !== 'grammar' && styles.hidden]}><Grammar onOpenTopic={setTopic} /></View>
          <View style={[styles.page, tab !== 'practice' && styles.hidden]}>
            <Practice focusTopic={focus} onFocusHandled={() => setFocus(null)} onOpenTopic={setTopic} />
          </View>
          <View style={[styles.page, tab !== 'roleplay' && styles.hidden]}><Roleplay /></View>
        </KeyboardAvoidingView>
        <TabBar tab={tab} onChange={setTab} />
        <TopicSheet id={topic} onClose={() => setTopic(null)} onPractice={(id) => { setTopic(null); setFocus(id); setTab('practice'); }} />
        <StatsSheet visible={stats} onClose={() => setStats(false)} onRetake={() => setStats(false)} />
      </>
    );

  return (
    <View style={styles.root}>
      <City />
      {body}
      <SparkleLayer />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  page: { flex: 1 },
  hidden: { display: 'none' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 10, backgroundColor: 'rgba(12,9,7,0.92)' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  mark: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  markText: { fontFamily: F.display, fontSize: 15, color: C.onGold },
  brand: { fontFamily: F.display, fontSize: 23, color: C.goldHi },
  streak: { fontFamily: F.bodySemi, fontSize: 13, color: C.muted },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5 },
  chipLv: { fontFamily: F.display, fontSize: 14, color: C.ink },
});
