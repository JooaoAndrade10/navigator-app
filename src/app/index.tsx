import { useRef, useState } from 'react';

import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, {
    Marker,
    type Region,
} from 'react-native-maps';

type SearchResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export default function HomeScreen() {
  const mapRef = useRef<MapView>(null);
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [message, setMessage] = useState(
    'Pronto para sua próxima viagem?'
  );
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: -23.5505,
    longitude: -46.6333,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });

  async function searchDestination() {
    const query = destination.trim();
    if (!query) {
      setMessage('Digite um destino para começar.');
      return;
    }
    if (loading) {
      return;
    }
    setLoading(true);
    setMessage('Pesquisando destino...');
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      if (!apiUrl) {
        throw new Error('Endereço da API não configurado.');
      }
      const url = `${apiUrl}/api/geocode?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const results: SearchResult[] = await response.json();
      if (results.length === 0) {
        setMessage(
          'Destino não encontrado. Tente outro endereço.'
        );
        return;
      }
      setSearchResults(results);
      setMessage(
        `${results.length} opções encontradas. Escolha o destino desejado.`
      );
    } catch (error) {
      console.error('Erro ao pesquisar destino:', error);
      setMessage(
        'Não foi possível pesquisar. Verifique o servidor e a conexão.'
      );
    } finally {
      setLoading(false);
    }
  }

  function selectDestination(result: SearchResult) {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      setMessage('As coordenadas do destino são inválidas.');
      return;
    }
    const newRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(newRegion);
    setMarker({ latitude, longitude });
    setDestination(result.display_name);
    setSearchResults([]);
    setMessage(`Destino selecionado: ${result.display_name}`);
    mapRef.current?.animateToRegion(newRegion, 1000);
  }

  function selectShortcut(place: string) {
    setDestination(place);
    setMessage(`Destino selecionado: ${place}`);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              SUA JORNADA COMEÇA AQUI
            </Text>
            <Text style={styles.logo}>
              naviga<Text style={styles.logoAccent}>tor</Text>
            </Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>ONLINE</Text>
          </View>
        </View>
        <View style={styles.welcome}>
          <Text style={styles.title}>
            Para onde vamos?
          </Text>
          <Text style={styles.subtitle}>
            Encontre seu destino e explore o caminho.
          </Text>
        </View>
        <View style={styles.searchCard}>
          <Text style={styles.inputLabel}>
            SEU DESTINO
          </Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              value={destination}
              onChangeText={(text) => {
                setDestination(text);
                setSearchResults([]);
              }}
              placeholder="Digite um endereço ou lugar"
              placeholderTextColor="#7E8982"
              returnKeyType="search"
              onSubmitEditing={searchDestination}
              autoCapitalize="words"
              accessibilityLabel="Pesquisar destino"
            />
            <TouchableOpacity
              style={[
                styles.searchButton,
                loading && styles.searchButtonDisabled,
              ]}
              onPress={searchDestination}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Buscar destino"
            >
              {loading ? (
                <ActivityIndicator color="#08100B" />
              ) : (
                <Text style={styles.searchButtonText}>
                  IR
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.message}>
            {message}
          </Text>
        </View>
        {searchResults.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              ESCOLHA UM DESTINO
            </Text>
            {searchResults.map((result, index) => (
              <TouchableOpacity
                key={`${result.lat}-${result.lon}-${index}`}
                style={styles.resultItem}
                onPress={() => selectDestination(result)}
                activeOpacity={0.75}
              >
                <View style={styles.resultNumber}>
                  <Text style={styles.resultNumberText}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.resultContent}>
                  <Text
                    style={styles.resultName}
                    numberOfLines={1}
                  >
                    {result.display_name.split(',')[0]}
                  </Text>
                  <Text
                    style={styles.resultAddress}
                    numberOfLines={2}
                  >
                    {result.display_name}
                  </Text>
                </View>
                <Text style={styles.resultArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mapa</Text>
          <Text style={styles.sectionCaption}>
            MAPA REAL
          </Text>
        </View>
        <View style={styles.mapCard}>
          <MapView
            ref={mapRef}
            style={styles.mapView}
            initialRegion={region}
            showsCompass
            showsScale
            loadingEnabled
          >
            {marker && (
              <Marker
                coordinate={marker}
                title="Seu destino"
                description={destination}
              />
            )}
          </MapView>
          <View style={styles.mapLabel}>
            <View style={styles.statusDot} />
            <Text style={styles.mapLabelText}>
              NAVIGATOR MAP
            </Text>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Acesso rápido
          </Text>
          <Text style={styles.sectionCaption}>
            EXPLORE
          </Text>
        </View>
        <View style={styles.shortcuts}>
          <TouchableOpacity
            style={styles.shortcut}
            onPress={() =>
              selectShortcut('Avenida Paulista, São Paulo')
            }
          >
            <Text style={styles.shortcutIcon}>⌖</Text>
            <Text style={styles.shortcutTitle}>
              Avenida Paulista
            </Text>
            <Text style={styles.shortcutSubtitle}>
              São Paulo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcut}
            onPress={() =>
              selectShortcut('Parque Ibirapuera, São Paulo')
            }
          >
            <Text style={styles.shortcutIcon}>◇</Text>
            <Text style={styles.shortcutTitle}>
              Parque Ibirapuera
            </Text>
            <Text style={styles.shortcutSubtitle}>
              São Paulo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortcut}
            onPress={() =>
              selectShortcut(
                'Aeroporto de Congonhas, São Paulo'
              )
            }
          >
            <Text style={styles.shortcutIcon}>✈</Text>
            <Text style={styles.shortcutTitle}>
              Aeroporto
            </Text>
            <Text style={styles.shortcutSubtitle}>
              Congonhas
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Uma nova forma de explorar.
          </Text>
          <Text style={styles.infoText}>
            Pesquise um endereço para centralizar o mapa e
            visualizar o local encontrado. A navegação curva
            a curva ainda não está implementada.
          </Text>
        </View>
        <Text style={styles.footer}>
          NAVIGATOR • PROJETO EM DESENVOLVIMENTO
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0F0D',
  },

  container: {
    flex: 1,
    backgroundColor: '#0B0F0D',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  eyebrow: {
    color: '#8D9A91',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 5,
  },

  logo: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -1,
  },

  logoAccent: {
    color: '#64E58B',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17251B',
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#64E58B',
    marginRight: 7,
  },

  statusText: {
    color: '#A8F4BB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  welcome: {
    marginBottom: 22,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },

  subtitle: {
    color: '#A0AAA3',
    fontSize: 14,
    lineHeight: 21,
  },

  searchCard: {
    backgroundColor: '#151C18',
    borderColor: '#26332A',
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 26,
  },

  inputLabel: {
    color: '#9AA79E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 11,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  input: {
    flex: 1,
    minHeight: 48,
    backgroundColor: '#0D130F',
    borderColor: '#303D33',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    color: '#FFFFFF',
    fontSize: 14,
  },

  searchButton: {
    minWidth: 52,
    height: 48,
    backgroundColor: '#64E58B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchButtonDisabled: {
    opacity: 0.65,
  },

  searchButtonText: {
    color: '#08100B',
    fontSize: 14,
    fontWeight: '900',
  },

  message: {
    color: '#A9B5AC',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },

  sectionCaption: {
    color: '#64E58B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  resultsContainer: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#303D33',
  },

  resultsTitle: {
    color: '#64E58B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#26332A',
  },

  resultNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#17251B',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resultNumberText: {
    color: '#64E58B',
    fontSize: 12,
    fontWeight: '800',
  },

  resultContent: {
    flex: 1,
    marginLeft: 11,
  },

  resultName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  resultAddress: {
    color: '#9AA79E',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  resultArrow: {
    color: '#64E58B',
    fontSize: 25,
    marginLeft: 8,
  },

  mapCard: {
    height: 290,
    borderRadius: 18,
    overflow: 'hidden',
    borderColor: '#2A382E',
    borderWidth: 1,
    marginBottom: 27,
    backgroundColor: '#19231D',
  },

  mapView: {
    flex: 1,
  },

  mapLabel: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0F0D',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },

  mapLabelText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  shortcuts: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 25,
  },

  shortcut: {
    flex: 1,
    minHeight: 120,
    backgroundColor: '#151C18',
    borderColor: '#26332A',
    borderWidth: 1,
    borderRadius: 14,
    padding: 11,
    justifyContent: 'center',
  },

  shortcutIcon: {
    color: '#64E58B',
    fontSize: 23,
    marginBottom: 9,
  },

  shortcutTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 5,
  },

  shortcutSubtitle: {
    color: '#94A097',
    fontSize: 10,
  },

  infoCard: {
    backgroundColor: '#132019',
    borderColor: '#284532',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },

  infoTitle: {
    color: '#C8FBD4',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 9,
  },

  infoText: {
    color: '#A9B9AD',
    fontSize: 13,
    lineHeight: 21,
  },

  footer: {
    color: '#68766C',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
});
