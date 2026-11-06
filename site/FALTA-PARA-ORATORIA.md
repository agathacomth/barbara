# Oratória de Autoridade: o que a página precisa antes de ir ao ar

Atualizado em 06/11/2026.

A página está pronta e funcional. Os itens abaixo são informações que eu
**não tinha** e que não inventei. Cada um está marcado onde entra.

---

## 🔴 Trava a venda

| O que falta | Onde entra | Enquanto não vier |
|---|---|---|
| **Link do checkout do Square** | `oratoria.html`, no começo: `var CHECKOUT_URL = "";` | Os seis botões abrem o WhatsApp da Bárbara com mensagem pronta. Nenhum botão morto, mas nenhuma venda automática. |
| **Código do cupom de US$ 100 e a validade** | A página mostra US$ 699 riscado e US$ 599 como valor promocional | Não escrevi o código em lugar nenhum. Se o cupom precisar ser digitado pelo comprador, a página está prometendo um preço que o checkout não vai dar sozinho: isso precisa ser resolvido antes de anunciar. |

**Sobre o cupom, uma pergunta direta:** o US$ 599 é automático no link do
Square, ou a pessoa digita o cupom? A resposta muda o texto da dobra de preço.
Hoje está escrito "Com o cupom promocional", o que assume que ela digita.

## 🟡 Falta confirmar

- **Endereço exato em São Francisco.** O FAQ hoje responde que o endereço vai
  por e-mail e WhatsApp na confirmação. Se vocês quiserem o endereço na
  página, me manda e eu coloco na ficha e no FAQ.
- **Certificado, material incluso, estacionamento e política de cancelamento.**
  O briefing deixou os quatro em aberto. Não inventei nenhum, então eles não
  aparecem na página nem no FAQ. Com as respostas, viram quatro perguntas novas.
- **Pixel da Meta.** O briefing pede para configurar. Preciso do ID do pixel.
  Sem ele não dá para medir conversão de anúncio.

## 🟢 Decidido e aplicado

- **Febracis:** mantive a mesma redação cautelosa da mentoria, sem nenhum verbo
  de trabalho. O briefing trazia "atuou como treinadora da FEBRACIS", e a
  Ágatha confirmou em 06/11 que fica a redação cautelosa até a Bárbara dizer o
  contrário por escrito.
- **Depoimentos:** cada um diz de onde veio. O Felipe Guedes é do treinamento
  de comunicação. A Paula Regis é do acompanhamento individual, e está escrito
  assim, porque o briefing pede para não apresentar experiências diferentes
  como se fossem a mesma turma.
- **Mentoria Identidade Raiz:** saiu do ar. A página inteira está guardada em
  `mentoria-arquivo.html`, com `noindex`, e nada aponta para ela.

---

## Vídeos: o que eu editei

| Arquivo | Origem | Corte |
|---|---|---|
| `video/barbara-oratoria` | IMG_4665, 2min02 | A Bárbara gravou o roteiro inteiro duas vezes. Ficou só a primeira tomada, e tirei a repetição do CTA no fim. **1min01** |
| `video/felipe-guedes` | IMG_4042, 2min09 | Cortado no ponto em que ele termina o raciocínio do "divisor de águas". **49s** |
| `video/paula-regis` | IMG_5049, 25s | Inteiro, só com legenda. **25s** |

Os três estão em WebM e em MP4. O navegador baixa só um: Chrome e Firefox
pegam o WebM, que é mais leve, e o Safari e o iPhone pegam o MP4. A legenda é
queimada na imagem, em Montserrat, porque a maior parte assiste sem som.

Os arquivos originais, inteiros, continuam com você. Se quiser outro ponto de
corte em qualquer um, me diz o trecho e eu refaço.
