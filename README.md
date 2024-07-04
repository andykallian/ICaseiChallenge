# Projeto YouTube Video Integration

Este projeto permite buscar e exibir vídeos do YouTube, além de gerenciar uma lista de vídeos favoritos. Ele é composto por várias instâncias e utiliza a API do YouTube para fornecer os vídeos.

## Descrição

O projeto consiste em duas partes principais:
1. **mf_drawer**: Módulo responsável por gerenciar a interface de favoritos.
2. **mf_videos**: Módulo para buscar e exibir vídeos do YouTube.

A integração com a API do YouTube permite a busca de vídeos em tempo real, e a estrutura modular facilita a gestão e o desenvolvimento de diferentes partes da aplicação.

## Pré-requisitos

Antes de começar, você vai precisar ter o seguinte instalado na sua máquina:

- [Node.js](https://nodejs.org/)
- [NPM](https://www.npmjs.com/) (geralmente instalado junto com o Node.js)
- Conta no [Google Cloud](https://cloud.google.com/) para obter uma chave da API do YouTube

## Configuração

### 1. Clonar o Repositório

Primeiro, clone o repositório para sua máquina local:

git clone https://github.com/seu-usuario/seu-repositorio.git



### 2. Instalar Dependências

Você deve instalar as dependências em cada instância do projeto.

Para a instância mf_drawer:

cd mf_drawer
npm install

Para a instância mf_videos:

cd mf_videos
npm install

### 3. Instalar Dependências na Raiz do Projeto

Volte para a raiz do projeto e instale as dependências gerais:

cd ..
npm install

### 4. Configurar o Arquivo .env
Crie um arquivo .env na raiz do projeto e adicione a chave da API do YouTube fornecida pela google cloud youtube v3:


YOUTUBE_API_KEY=your_youtube_api_key_here

### Build e Execução

### 5. Build do Projeto
Na raiz do projeto, execute o comando para compilar todas as instâncias:

npm run build:all

### 6. Iniciar o Servidor
Ainda na raiz do projeto, inicie o servidor com o seguinte comando:

npm run serve