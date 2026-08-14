# MD for: https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks/brand-brick/default-rendering.md

\# Default rendering Before rendering the Brand Brick, first execute the \[initialization steps\](https://www.mercadopago.com.ar/developers/en/docs/checkout-bricks/common-initialization) shared among all Bricks. From there, see below the necessary information to configure and render the Brand Brick. > NOTE > > Note > > To consult the types and specifications of the parameters and responses of the Brick functions, refer to the \[technical documentation\](https://github.com/mercadopago/sdk-js/blob/main/docs/bricks/brand.md). ## Configure the Brick Create Brick's startup configuration. \`\`\`javascript bricksBuilder.create( "brand", "brandBrick\_container" ); }; \`\`\` ## Render the Brick Once the configurations are created, enter the code below to render the Brick. > WARNING > > Important > > The id \`brandBrick\_container\` of the html div below should correspond to the value used in the method create() of the last step. 

* [html ](#editor%5F1)
* [react-jsx ](#editor%5F2)
html react-jsx 

```
<div id="brandBrick_container"></div>
```

Copiar 

```
import { Brand } from '@mercadopago/sdk-react';

<Brand />
```

The result of rendering the Brick should look like the image below. !\[brand-brick-en\](https://www.mercadopago.com.ar/checkout-bricks/brick-brand-en.png)

# MD for: https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks/brand-brick/settings/payment-methods.md

\# Payment methods The following table demonstrates the available payment method settings for each value prop: | Value prop | Settings| |---|---| |\`payment\_methods\` (default) e \`payment\_methods\_logos\`| - Payment methods (Available balance and Installments without Card will always be enabled; credit and debit cards; ticket)   
  
 \- Credit card brands (Visa, Mastercard, American Express, Naranja X, Cabal Cencosud, Cordobesa, Argencard, Diners, Tarjeta Shopping and CMR)   
  
 \- Number of installments (2 to 12)   
  
 \- Installments with or without interest   
  
 \- Debit card brands (Visa, Mastercard, Maestro and Cabal)   
  
 \- Ticket (Rapipago and Pago Fácil)| |\`installments\`| - Credit card brands (Visa, Mastercard, American Express, Naranja X, Cabal Cencosud, Cordobesa, Argencard, Diners, Tarjeta Shopping and CMR)   
  
 \- Number of installments (2 to 12)   
  
 \- Installments with or without interest | |\`security\`|No settings for the pop-up.| |\`credits\`|No pop-up. | Customizations are passed to Brick through the object below, which must be sent as the third parameter in the \`create()\`\` method. 

* [javascript ](#editor%5F1)
* [react-jsx ](#editor%5F2)
javascript react-jsx 

```
const settings = {
  customization: {
  paymentMethods: {
  excludedPaymentMethods: ["master"], // optional string[]. default []. options ["master", "visa", "amex", "naranja", "maestro", "cabal", "cencosud", "cordobesa", "argencard", "diners", "tarshop", "cmr", "rapipago", "pagofacil", "mercadopago"]
  excludedPaymentTypes: ["ticket"], // optional string[]. default []. options ["credit_card", "debit_card", "ticket"]
  maxInstallments: 12, // optional number. min 2 max 12
  interestFreeInstallments: false, // optional boolean
  },
  },
};
```

Copiar 

```
const customization = {
  paymentMethods: {
  excludedPaymentMethods: ["master"], // optional string[]. default []. options ["master", "visa", "amex", "naranja", "maestro", "cabal", "cencosud", "cordobesa", "argencard", "diners", "tarshop", "cmr", "rapipago", "pagofacil", "mercadopago"]
  excludedPaymentTypes: ["ticket"], // optional string[]. default []. optional string[]. default []. options ["credit_card", "debit_card", "ticket", "account_money", "mercado_credito"]
  maxInstallments: 12, // optional number. min 2 max 12
  interestFreeInstallments: false, // optional boolean
  },
};
```

# MD for: https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks/brand-brick/settings/default-rendering.md

\# Value prop The textual content displayed within the banner and pop-up depends on the choice of a \*\*value prop\*\*. There are five available value propositions for use, and each one enables specific customizations. The table below shows how each value proposition impacts the messages displayed in the banner: | Value prop | Message on the banner| |---|---| |\`payment\_methods\` (default)| Logo Mercado Pago + "Pay by \[payment method\] or with your account money on Mercado Pago. Learn more" (link para pop-up)| |\`payment\_methods\_logos\`|Logos + "Available payment methods with Mercado Pago. Learn more" (link para pop-up)| |\`installments\`|Logo Mercado Pago + "Up to 12 interest-free installments with Mercado Pago. Learn more" (link para pop-up)| |\`security\`|Logo Mercado Pago + "Pay safely with Mercado Pago"| |\`credits\`|Logo Mercado Pago + "Up to 12 installments without cards through Mercado Pago. Learn more" (link para pop-up)| Customizations are passed to Brick through the object below, which must be sent as a third parameter in the \`create()\` method. 

* [javascript ](#editor%5F1)
* [react-jsx ](#editor%5F2)
javascript react-jsx 

```
const settings = {
  customization: {
  text: {
  valueProp: "payment_methods", // optional "installments" | "payment_methods" | "security" | "payment_methods_logos" | "credits"
  },
  },
  };
```

Copiar 

```
const customization = {
  text: {
  valueProp: "payment_methods", // optional "installments" | "payment_methods" | "security" | "payment_methods_logos" | "credits"
  },
};
```

# MD for: https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks/brand-brick/visual-customizations.md

\# Visual customizations To adapt to the store's style, the banner allows the following customizations: - Show or hide the Mercado Pago logo; - Text (font, size, weight, color, alignment, background color and spacing); - Border (show or hide, weight, color, border-radius and spacing). > NOTE > > Important > > Pay close attention to which background and text color you will adopt to ensure they contrast and allow the content to be readable. | Customization | Application| |---|---| | \`hideMercadoPagoLogo\` | Controls whether the Mercado Pago logo will be displayed next to the message.| | \`contentAlign\` | Defines the alignment of non-textual content in the banner.| | \`border\` | Controls whether a border will be shown around the banner.| | \`borderColor\` | Defines the color of the banner border.| | \`borderWidth\` | Defines the width of the banner border.| | \`borderRadius\` | Defines the curvature of the banner border.| | \`verticalPadding\` | Defines the vertical padding of the banner.| | \`horizontalPadding\` | Defines the horizontal padding of the banner.| | \`useCustomFont\` | Controls whether the banner will use a custom font or the default Mercado Pago font.| | \`align\` | Defines the alignment of textual content in the banner.| | \`size\` | Defines the font size of the text in the banner.| | \`fontWeight\` | Defines the font weight in the banner.| The possible values and defaults for each customization are defined in the snippet below, which should be sent as the third parameter in the \`create()\` method. 

* [javascript ](#editor%5F1)
* [react-jsx ](#editor%5F2)
javascript react-jsx 

```
const renderBrandBrick = async (bricksBuilder) => {
  const settings = {
  customization: {
  // the visual changes only apply to the banner, the modal is always default
  visual: {
  hideMercadoPagoLogo: false, // optional boolean.
  contentAlign: "center", // optional "left" | "center" | "right".
  backgroundColor: "white", // optional "white" | "mercado_pago_primary" | "black" | "transparent"
  border: false, // optional boolean
  borderColor: "dark", // optional "dark" | "light"
  borderWidth: "1px", // optional "1px" | "2px"
  borderRadius: "0px", // optional string format: "Npx"
  verticalPadding: "8px", // optional string format: "Npx". max "40px"
  horizontalPadding: "16px", // optional string format: "Npx". max "40px"
  },
  text: {
  align: "left", // optional "left" | "center" | "right",
  useCustomFont: false, // optional boolean. OBS: If is true the Brick inheriths the font from the parent
  size: "medium", // optional "extra_small" | "small" | "medium" | "large".
  fontWeight: "semibold", // optional "regular" | "semibold".
  color: "secondary", // optional "primary" | "secondary" |"inverted".
  },
  },
  };
};
```

Copiar 

```
const customization = {
  // the visual changes only apply to the banner, the modal is always default
  visual: {
  hideMercadoPagoLogo: false, // optional boolean
  contentAlign: "center", // optional "left" | "center" | "right"
  backgroundColor: "white", // optional "white" | "mercado_pago_primary" | "black" | "transparent"
  border: false, // optional boolean
  borderColor: "dark", // optional "dark" | "light"
  borderWidth: "1px", // optional "1px" | "2px"
  borderRadius: "0px", // optional string format: "Npx"
  verticalPadding: "8px" // optional string format: "Npx". max "40px"
  horizontalPadding: "16px" // optional string format: "Npx". max "40px"
  },
  text: {
  align: "left", // optional "left" | "center" | "right",
  useCustomFont: false, // optional boolean. OBS: If is true the Brick inheriths the font from the parent
  size: "medium", // optional "extra-small" | "small" | "medium" | "large".
  fontWeight: "semibold", // optional "regular" | "semibold".
  color: "secondary", // optional "primary" | "secondary" | "inverted".
  },
  },
};
```

# MD for: https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks/brand-brick/callbacks.md

\# Callbacks To simplify integration and interaction with Brick, callbacks are provided that can be used at different moments in the lifecycle to execute functions on your website. | Value prop | Time of use | |---|---| |\`onReady\` |When finishing loading the Brick.| 

* [javascript ](#editor%5F1)
* [react-jsx ](#editor%5F2)
javascript react-jsx 

```
const settings = {
  callbacks: {
  onReady: () => {
  /*
  Callback called when Brick is ready.
  Here you can hide loadings on your site, for example.
  */
  },
  },
};
```

Copiar 

```
import { Brand } from '@mercadopago/sdk-react';
const onReady = async () => {
  /*
  Callback called when Brick is ready.
  Here you can hide loadings on your site, for example.
  */
};

<Brand
  onReady={onReady}
/>
```