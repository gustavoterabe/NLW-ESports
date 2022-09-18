import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import { Text, FlatList, Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GameParams } from "../../@types/navigation";
import { Background } from "../../components/Background";
import { THEME } from "../../theme";
import logoImg from "../../assets/logo-nlw-esports.png";
import { styles } from "./styles";
import { Heading } from "../../components/Heading";
import { DuoCard } from "../../components/DuoCard";
import { DuoMatch } from "../../components/DuoMatch";

export function Game() {
  const [duos, setDuos] = useState([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState("");
  const route = useRoute();
  const game = route.params as GameParams;

  const navigation = useNavigation();

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    fetch(`http://192.168.18.87:3335/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data))
      .catch((error) => console.log(error));
  }, []);

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.18.87:3335/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => setDiscordDuoSelected(data.discord))
      .catch((error) => console.log(error));
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo name="chevron-thin-left" color={THEME.COLORS.CAPTION_300} />
          </TouchableOpacity>
          <Image source={logoImg} style={styles.logo} />
          <View style={styles.right} />
        </View>
        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />
        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
          )}
          horizontal
          contentContainerStyle={[
            duos.length > 0 ? styles.contentList : styles.emptyListContent,
          ]}
          showsHorizontalScrollIndicator={false}
          style={styles.containerList}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected("")}
        />
      </SafeAreaView>
    </Background>
  );
}
