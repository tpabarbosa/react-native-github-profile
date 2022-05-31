import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Linking,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

const colorGithub = '#010409';
const colorFont = '#C9D1C9';
const colorDarkFont = '#4F565E';

const App = () => {
  const [user, setUser] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFindGithubProfile = async () => {
    if (inputRef?.current) {
      inputRef.current.blur();
      inputRef.current.clear();
    }

    setProfileError(null);
    setProfile(null);

    if (!user) {
      setProfileError(`Digite um nome de usuário para buscar o perfil. 
      Exemplo: facebook`);
      return;
    }

    // fetch profile
    setIsLoading(true);
    const userProfile = await getProfileAtGithub(user);
    if (!userProfile) {
      setProfileError(`Erro ao buscar o perfil ${user}`);
    } else {
      setProfile(userProfile);
    }
    setIsLoading(false);
    setUser('');
  };

  const getProfileAtGithub = async (user) => {
    try {
      const response = await fetch(`https://api.github.com/users/${user}`);
      const json = await response.json();
      console.log(`User: ${user} - `, `Status: ${response.status} - `, json);
      if (!response.ok) {
        return null;
      }
      return json;
    } catch (error) {
      console.error('Error', error);
      return null;
    }
  };

  const handleOpenGithubProfile = async () => {
    const response = await Linking.canOpenURL(profile.html_url);
    if (response) {
      console.log(`Abrindo ${profile.html_url}`);
      await Linking.openURL(profile.html_url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colorGithub}
        barStyle={'light-content'}
      />
      <Text style={styles.title}>Buscar Perfil Github</Text>

      <View style={styles.content}>
        <View style={[styles.findProfile]}>
          <Text style={[styles.text, styles.inputLabel]}>Perfil</Text>
          <TextInput
            ref={inputRef}
            autoCapitalize="none"
            onChangeText={(text) => setUser(text)}
            onSubmitEditing={handleFindGithubProfile}
            style={[styles.input]}
          />
        </View>
        <Pressable onPress={handleFindGithubProfile}>
          <View style={[styles.button, styles.findButton]}>
            <Text style={[styles.text, styles.buttonText]}>Buscar</Text>
          </View>
        </Pressable>
      </View>

      {isLoading && (
        <View style={[styles.content]}>
          <Text style={[styles.text, styles.description]}>Carregando</Text>
          <ActivityIndicator
            size="large"
            color={colorFont}
          />
        </View>
      )}

      {profileError && (
        <View style={styles.content}>
          <Text
            accessibilityLabel=""
            style={[styles.text, styles.description]}
          >
            {profileError}
          </Text>
        </View>
      )}

      {profile && (
        <ScrollView>
          <View style={styles.content}>
            <Image
              accessibilityLabel="Imagem de perfil"
              style={styles.avatar}
              source={{ uri: profile.avatar_url }}
            />
            <Text
              accessibilityLabel={`Nome ${profile.name}`}
              style={[styles.text, styles.name]}
            >
              {profile.name}
            </Text>
            <Text
              accessibilityLabel={`Nome de usuário ${profile.username}`}
              style={[styles.text, styles.username]}
            >
              {profile.login}
            </Text>
            <Text
              accessibilityLabel={`Biografia ${profile.bio}`}
              style={[styles.text, styles.bio]}
            >
              {profile.bio}
            </Text>
            <Pressable onPress={handleOpenGithubProfile}>
              <View style={styles.button}>
                <Text style={[styles.text, styles.buttonText]}>
                  Abrir no Github
                </Text>
              </View>
            </Pressable>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorGithub,
    flex: 1,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginTop: 32,
    fontSize: 36,
    fontWeight: '700',
    color: colorDarkFont,
  },
  description: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 28,
  },
  avatar: {
    height: 150,
    width: 150,
    borderRadius: 100,
    alignSelf: 'center',
    resizeMode: 'stretch',
    borderColor: colorDarkFont,
    borderWidth: 2,
  },
  text: {
    color: colorFont,
  },
  name: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 8,
    fontSize: 18,
    color: colorDarkFont,
  },
  bio: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 28,
  },
  button: {
    width: 'auto',
    backgroundColor: colorDarkFont,
    borderRadius: 10,
    padding: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  findProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginBottom: 16,
  },
  findButton: {
    minWidth: '100%',
  },
  inputLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '70%',
    height: 42,
    borderWidth: 2,
    backgroundColor: colorFont,
    color: 'black',
    fontSize: 18,
    borderRadius: 10,
    marginLeft: 12,
  },
});

export default App;
