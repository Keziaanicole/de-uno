// Email sign-in with a one-time code (no passwords, no links to open).
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, H, T, s as ui } from '../components/ui';
import { useStore } from '../lib/store';
import { isConfigured, supabase } from '../lib/supabase';
import { C, F } from '../lib/theme';

export default function SignIn() {
  const { startGuest } = useStore();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const sendCode = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setMsg('Enter a valid email address.'); return; }
    setBusy(true); setMsg('');
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
    setBusy(false);
    if (error) setMsg(error.message);
    else setSent(true);
  };

  const verify = async () => {
    setBusy(true); setMsg('');
    const { error } = await supabase.auth.verifyOtp({ email: email.trim(), token: code.trim(), type: 'email' });
    setBusy(false);
    if (error) setMsg('That code didn\'t work. Check it, or send a new one.');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>De Uno</Text>
        <H size={32} style={{ marginTop: 18 }}>Spanish, one sentence at a time.</H>
        <T style={[ui.muted, { marginTop: 8 }]}>Sign in so your level and progress follow you to any device.</T>
        {!isConfigured ? (
          <Card style={{ marginTop: 22, gap: 12 }}>
            <T>This copy of De Uno isn't connected to its server yet, so the AI tutor and accounts are off. You can still try it with the built-in practice sentences.</T>
            <Button label="Try it offline" onPress={startGuest} />
          </Card>
        ) : (
          <Card style={{ marginTop: 22, gap: 12 }}>
            {!sent ? (
              <>
                <Text style={styles.label}>Email</Text>
                <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" autoComplete="email" keyboardType="email-address"
                  textContentType="emailAddress" placeholder="you@example.com" placeholderTextColor={C.muted} keyboardAppearance="dark"
                  style={styles.input} onSubmitEditing={sendCode} returnKeyType="send" />
                <Button label={busy ? 'Sending…' : 'Email me a code'} onPress={sendCode} disabled={busy} />
              </>
            ) : (
              <>
                <T>We sent a 6-digit code to <Text style={{ fontFamily: F.bodyBold }}>{email.trim()}</Text>.</T>
                <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code"
                  placeholder="123456" placeholderTextColor={C.muted} keyboardAppearance="dark" style={[styles.input, styles.code]} maxLength={10} />
                <Button label={busy ? 'Checking…' : 'Sign in'} onPress={verify} disabled={busy || code.trim().length < 6} />
                <View style={ui.row}>
                  <Button kind="link" label="Use a different email" onPress={() => { setSent(false); setCode(''); }} />
                  <Button kind="link" label="Send a new code" onPress={sendCode} />
                </View>
              </>
            )}
            {!!msg && <Text style={ui.nudge}>{msg}</Text>}
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 60, paddingBottom: 220 },
  brand: { fontFamily: F.display, fontSize: 26, color: C.goldHi },
  label: { fontFamily: F.bodyBold, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: C.muted },
  input: { borderWidth: 1.5, borderColor: C.line, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: C.bg, color: C.ink, fontFamily: F.body, fontSize: 17 },
  code: { fontFamily: F.bodyBold, fontSize: 24, letterSpacing: 6, textAlign: 'center' },
});
