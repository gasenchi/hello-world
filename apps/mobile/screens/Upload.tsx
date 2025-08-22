import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function Upload() {
  const [status, setStatus] = useState<'idle' | 'signing' | 'uploading' | 'processing' | 'ready' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const pickAndUpload = useCallback(async () => {
    try {
      setStatus('signing');
      setMessage('Requesting upload…');
      const creatorId = 'alice'; // placeholder: would come from auth/user context
      const signRes = await fetch('http://localhost:3000/videos/presign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contentType: 'video/mp4', creatorId })
      });
      const { url, key, videoId } = await signRes.json();

      const file = await DocumentPicker.getDocumentAsync({ type: 'video/*', multiple: false, copyToCacheDirectory: true });
      if (file.canceled) return;
      const asset = file.assets?.[0];
      if (!asset?.uri) return;

      setStatus('uploading');
      setMessage('Uploading…');
      const blob = await (await fetch(asset.uri)).blob();
      const upRes = await fetch(url, { method: 'PUT', body: blob, headers: { 'Content-Type': blob.type || 'video/mp4' } });
      if (!upRes.ok) throw new Error('Upload failed');

      setStatus('processing');
      setMessage('Processing…');
      const interval = setInterval(async () => {
        try {
          const st = await fetch(`http://localhost:3000/videos/${videoId}/status`).then(r => r.json());
          if (st.status === 'READY') {
            clearInterval(interval);
            setStatus('ready');
            setMessage('Ready!');
          }
        } catch {}
      }, 2000);
    } catch (e: any) {
      setStatus('error');
      setMessage(e?.message || 'Error');
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickAndUpload}>
        <Text style={styles.buttonText}>Select video to upload</Text>
      </TouchableOpacity>
      {status !== 'idle' && (
        <View style={styles.row}>
          {(status === 'signing' || status === 'uploading' || status === 'processing') && <ActivityIndicator color="#fff" />} 
          <Text style={styles.status}>{message}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center', gap: 16 },
  button: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#000', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  status: { color: '#fff' },
});