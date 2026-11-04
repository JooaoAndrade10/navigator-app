# 🧭 Navigator

**Aplicativo de navegação urbana em desenvolvimento.**

O Navigator é um projeto pessoal de desenvolvimento de software inspirado em aplicativos de navegação como o Waze.

Seu objetivo é explorar tecnologias de geolocalização, mapas e integração entre aplicações mobile e serviços de backend.

O projeto está sendo desenvolvido como parte do meu aprendizado em Análise e Desenvolvimento de Sistemas e da construção do meu portfólio profissional.

## 🎯 Objetivo do projeto

Desenvolver uma aplicação de navegação intuitiva que permita aos usuários pesquisar destinos e visualizar informações geográficas, com possibilidade de incorporar recursos de trânsito em versões futuras.

## 🛠️ Tecnologias utilizadas

- **React Native:** desenvolvimento da aplicação mobile.
- **Expo:** ambiente de desenvolvimento.
- **Expo Router:** gerenciamento de navegação entre telas.
- **TypeScript:** tipagem e organização do código.
- **react-native-maps:** exibição de mapas na aplicação.
- **Node.js:** ambiente de execução do backend.
- **Express:** criação das rotas da API.
- **OpenStreetMap:** dados geográficos e mapas.
- **Nominatim:** serviço de pesquisa de endereços.

## ✅ Funcionalidades implementadas

- Exibição de mapa com ruas e informações geográficas reais.
- Interface inicial de navegação.
- Estrutura inicial de backend com Node.js e Express.
- API para pesquisa de endereços utilizando o Nominatim.

## 🚧 Próximas etapas

- Integrar a pesquisa de destinos à interface mobile.
- Exibir e aperfeiçoar marcadores de localização no mapa.
- Implementar cálculo e visualização de rotas.
- Explorar integração com informações de trânsito.
- Melhorar a experiência e a interface do usuário.

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de começar, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- npm (instalado junto com o Node.js)

### 1. Baixar as dependências

Na pasta principal do projeto, abra o terminal e execute:

```bash
npm install
```

### 2. Iniciar o aplicativo

Execute:

```bash
npx expo start
```

Após iniciar o servidor, o Expo disponibilizará opções para executar o aplicativo em diferentes ambientes:

- [Expo Go](https://expo.dev/go)
- [Emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Build de desenvolvimento](https://docs.expo.dev/develop/development-builds/introduction/)

### 3. Iniciar o backend

O Navigator também possui um servidor desenvolvido com Node.js e Express.

Para iniciá-lo, abra outro terminal na pasta principal do projeto e execute:

```bash
node server.cjs
```

O servidor utiliza a porta 3000 por padrão.

## 📚 Documentação e referências

- [Documentação oficial do Expo](https://docs.expo.dev/)
- [Tutorial do Expo](https://docs.expo.dev/tutorial/introduction/)
- [Documentação do React Native](https://reactnative.dev/docs/getting-started)
- [Documentação do Expo Router](https://docs.expo.dev/router/introduction/)
- [Documentação do OpenStreetMap](https://www.openstreetmap.org/about)
- [Documentação do Nominatim](https://nominatim.org/release-docs/latest/)

## 📌 Status do projeto

**Em desenvolvimento.**

O Navigator está em constante evolução. Novas funcionalidades estão sendo planejadas e implementadas gradualmente, conforme o avanço do desenvolvimento e dos estudos.

---

Desenvolvido como projeto pessoal de aprendizado e portfólio.

Dados cartográficos: © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).