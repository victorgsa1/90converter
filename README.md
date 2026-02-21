# 90'Converter

Criei este software porque eu e um amigo que é editor, muita das vezes, precisamos utilizar imagens da internet e quando baixamos as vezes elas vem em formatos não tão comuns, ou não usuais para alguns softwares.

Depois de ouvir muita reclamação da parte dele de sites de conversão de arquivos que têm limitações, filas, marca d'água e ainda cobram para usar, eu decidi fazer o **90'Converter**: um aplicativo conversor de imagem que roda na sua máquina. :computer:

A ideia é simples: abrir, escolher as imagens, converter e seguir o trabalho. Sem depender de upload em site, sem dor de cabeça e com mais controle do seu fluxo. :rocket:

https://prnt.sc/7KU8qNaWbLZ4

## O que o app resolve

- Converte imagens para formatos mais usados no dia a dia de edição.
- Funciona localmente no desktop (foco em performance e praticidade).
- Evita limitações comuns de conversores online.
- Ajuda quem precisa converter vários arquivos de forma rápida.

## Stack usada

- **Frontend:** React + TypeScript + Vite
- **Backend/Core:** Rust
- **Desktop runtime:** Tauri
- **UI/estilo:** Tailwind CSS

## Visão técnica

### Arquitetura

O app é dividido em 2 camadas:

- **Camada de interface (React/TypeScript):** renderização da UI, fila de arquivos, estado de conversão e interação com usuário.
- **Camada de processamento (Rust via Tauri commands):** leitura de metadados de arquivo e conversão de imagem.

A comunicação entre as camadas é feita por `invoke` (Tauri API), chamando comandos Rust do frontend.

### Pipeline de conversão

Fluxo simplificado por arquivo:

1. O frontend monta a fila (`path`, `name`, `extension`, `sizeBytes`).
2. Ao converter, chama `convert_image` no Rust com:
   - `inputPath`: caminho do arquivo de entrada.
   - `outputPath`: caminho do arquivo de saída.
   - `quality`: qualidade de compressão (0.0 a 1.0).
3. O backend decodifica a imagem (`image::ImageReader`), detecta formato de saída pela extensão e codifica:
   - **JPG/JPEG:** `JpegEncoder::new_with_quality(...)`
   - **PNG:** `save_with_format(..., ImageFormat::Png)`
   - **WEBP:** `webp::Encoder` com qualidade em `f32`

### Formatos suportados

- **Entrada:** `jpg`, `jpeg`, `png`, `webp`, `avif`
- **Saída:** `png`, `jpg`, `webp`

No backend, a crate `image` está com features de AVIF habilitadas para leitura/escrita conforme configuração atual do projeto.

### Qualidade de imagem

- O controle de qualidade impacta **JPG** e **WEBP**.
- Em **PNG** (lossless), qualidade visual não muda como em formatos com perda; por isso o comportamento é diferente.

### Escrita de arquivo e conflito de nome

Antes de salvar, o backend verifica se já existe arquivo com o mesmo nome no destino.

Se existir, gera nome incremental:

- `example.png`
- `example1.png`
- `example2.png`

Isso evita sobrescrever arquivos existentes.

### Observações de build no Windows

Para builds com suporte AVIF nativo, o ambiente precisa das ferramentas auxiliares usadas no pipeline Rust/Tauri (ex.: `meson`, `ninja`, `pkg-config`, `nasm`), já consideradas no fluxo atual de build do projeto.

## Objetivo do projeto

Esse projeto nasceu para ser útil de verdade no dia a dia de quem trabalha com imagem: direto ao ponto, rápido.
Se você também já perdeu tempo com conversor online limitado, o 90'Converter foi feito pensando exatamente nisso.
