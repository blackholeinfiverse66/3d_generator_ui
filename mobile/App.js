import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';

const API_BASE_URL = 'http://localhost:3001/api/v1';
const AUTH_TOKEN = 'mock-jwt-token';

const MobileApp = () => {
  const [prompt, setPrompt] = useState('');
  const [jsonSpec, setJsonSpec] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify({
          user_id: 'mobile_user',
          project_id: 'mobile_proj',
          prompt: prompt.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setJsonSpec(data.spec_json || data);
        setPreviewUrl(data.preview_url);
      } else {
        Alert.alert('Error', 'Failed to generate design');
      }
    } catch (err) {
      console.error('Generate failed:', err);
      // Fallback to mock data
      const mockData = {
        type: 'furniture',
        style: 'modern',
        material: 'wood',
        dimensions: { width: 50, height: 80, depth: 45 }
      };
      setJsonSpec(mockData);
    }
    setIsLoading(false);
  }, [prompt]);

  const handleMaterialSwitch = useCallback(async (material) => {
    if (!jsonSpec) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/switch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`
        },
        body: JSON.stringify({
          user_id: 'mobile_user',
          spec_id: 'current_spec',
          object_id: 'main_object',
          material
        })
      });

      if (response.ok) {
        const data = await response.json();
        setJsonSpec(data.spec_json || data);
        setPreviewUrl(data.preview_url);
        Alert.alert('Success', `Material changed to ${material}`);
      }
    } catch (err) {
      console.error('Material switch failed:', err);
      Alert.alert('Error', 'Failed to switch material');
    }
  }, [jsonSpec]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>3D Design Generator</Text>
      
      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          placeholder="Describe your design..."
          placeholderTextColor="#666"
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        
        <TouchableOpacity 
          style={[styles.button, styles.generateButton]}
          onPress={handleGenerate}
          disabled={isLoading || !prompt.trim()}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Text>
        </TouchableOpacity>
      </View>

      {jsonSpec && (
        <View style={styles.resultSection}>
          <Text style={styles.sectionTitle}>Generated Design</Text>
          
          <View style={styles.previewBox}>
            <Text style={styles.previewText}>
              {previewUrl ? '3D Preview Available' : 'Preview Loading...'}
            </Text>
          </View>
          
          <View style={styles.jsonBox}>
            <Text style={styles.jsonText}>
              {JSON.stringify(jsonSpec, null, 2)}
            </Text>
          </View>
          
          <View style={styles.materialSection}>
            <Text style={styles.sectionTitle}>Quick Material Switch</Text>
            <View style={styles.materialButtons}>
              {['wood', 'metal', 'glass', 'fabric'].map(material => (
                <TouchableOpacity
                  key={material}
                  style={[styles.button, styles.materialButton]}
                  onPress={() => handleMaterialSwitch(material)}
                >
                  <Text style={styles.buttonText}>{material}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ffff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  inputSection: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.3)',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  generateButton: {
    backgroundColor: 'rgba(0,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.5)',
  },
  buttonText: {
    color: '#00ffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
  },
  previewBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  previewText: {
    color: '#666',
    fontSize: 16,
  },
  jsonBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  jsonText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  materialSection: {
    marginTop: 20,
  },
  materialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  materialButton: {
    backgroundColor: 'rgba(255,110,199,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,110,199,0.3)',
    flex: 1,
    minWidth: '45%',
  },
});

export default MobileApp;