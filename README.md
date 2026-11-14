# BTC Calc Card – Bitcoin & Sats Calculator

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration) [![GitHub total downloads](https://img.shields.io/github/downloads/jinx-22/btc-calc-card/total?style=flat-square&color=red)](https://github.com/jinx-22/btc-calc-card/releases/) [![GitHub release](https://img.shields.io/github/release/jinx-22/btc-calc-card?include_prereleases=&sort=semver&color=blue)](https://github.com/jinx-22/btc-calc-card/releases/) [![File size](https://img.shields.io/github/size/jinx-22/btc-calc-card/btc-calc-card.js?label=Card%20Size)](https://github.com/jinx-22/btc-calc-card) [![last commit](https://img.shields.io/github/last-commit/jinx-22/btc-calc-card)](https://github.com/jinx-22/btc-calc-card/commits/main) [![stars](https://img.shields.io/github/stars/jinx-22/btc-calc-card)](https://github.com/jinx-22/btc-calc-card/stargazers) [![Donate Bitcoin](https://img.shields.io/badge/%E2%82%BF-Bitcoin-F7931A?style=flat-square)](#bitcoin) [![Donate Lightning](https://img.shields.io/badge/%E2%9A%A1-Lightning-FFD700?style=flat-square)](#lightning)

🇬🇧 **English** · 🇩🇪 [**Deutsch**](https://github.com/jinx-22/btc-calc-card/blob/main/README_DE.md)

---

**BTC Calc Card** is a Home Assistant custom card that converts between Bitcoin, sats and any number of fiat currencies using your own price sensors – and calculates the spread of a Bitcoin offer.

> [!TIP]
> ## Why use this card?
> Many online BTC calculators send your IP address and data to third-party servers with every input.
> This card runs completely locally on your own Home Assistant – nothing leaves your network!!!

**Current version: 0.4.6**

See the [CHANGELOG](CHANGELOG.md) for the history.

<table> <tr> <td width="50%" valign="top"> Screenshot with 1 currency:<br> <img width="100%" alt="preview-usd-en" src="https://github.com/user-attachments/assets/639e0d13-89df-4466-b154-c3808309cb99" /> <br><br> Screenshot with 1 currency and enable spread calculator:<br> <img width="100%" alt="preview-usd-spread-en" src="https://github.com/user-attachments/assets/bf9d7e41-baa5-483e-b4d4-d2ffe5392525" /> </td> <td width="50%" valign="top"> Screenshot with 4 currency and enable spread calculator:<br> <img width="100%" alt="preview-en" src="https://github.com/user-attachments/assets/d67cb32f-199f-402e-b8d6-1ee9bb5bf8f9" /> </td> </tr> </table>

The screenshot shows example prices.


---

> **Note:** After the update, hard-reload the dashboard with `Ctrl + F5` and clear the browser cache so that the editor and the card load the new version.

---

## 📖 About BTC Calc Card

Type an amount into any field and all other fields are calculated at once: how many sats you get for 100 €, what 10,000 sats cost in euro, dollar and so on. The current prices stand on top of the card. Optionally the card also calculates the **spread** of an offer, for example when buying bitcoin at a premium.

### Highlights

- Any number of currencies – one price sensor per currency, added in the editor
- Only the active currencies are shown and calculated, the order is freely changeable
- Live conversion in both directions between sats / BTC and every currency
- The Bitcoin field can be switched between **sats** and **BTC**
- Current price per currency on top, with the value of 1 unit in sats
- Optional **offer calculator**: check the spread of an offer or calculate the sats for a given premium or discount
- Premium / discount in **%**, **sats** or **BTC**
- Remembers your inputs in the browser
- Responsive layout, also for the app (price tiles two per row)
- Live preview in the card picker
- Visual Home Assistant editor
- English and German (follows the HA language)

> [!TIP]
> ## Need price sensors?
> Use your own self-hosted Mempool instance with the **[Mempool Watch](https://github.com/jinx-22/mempool_watch)** integration.  
> It creates BTC price entities in multiple currencies – completely local.

---

# 📦 Installation

## Easy installation → [Open in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=jinx-22&repository=btc-calc-card&category=plugin)

## HACS Marketplace -> comming soon!

1. Open **HACS**
2. Select **Frontend**
3. Search for **BTC Calc Card**
4. Install the card
5. Reload Home Assistant or the browser

## Manual

1. Download `btc-calc-card.js`
2. Copy it to `/config/www/community/btc-calc-card/`
3. Add the following resource under **Settings → Dashboards → Resources**:

   `/local/community/btc-calc-card/btc-calc-card.js`

   Type: **JavaScript module**

Then reload the browser, e.g. with **Ctrl + F5**.

---

# ⚙️ Example configuration

```yaml
type: custom:btc-calc-card
title: Bitcoin Calculator
show_spread: true
currencies:
  - entity: sensor.bitcoin_price_eur
    code: EUR
    symbol: €
  - entity: sensor.bitcoin_price_usd
    code: USD
    symbol: $
  - entity: sensor.bitcoin_price_gbp
    code: GBP
    symbol: £
    active: false
```

The sensors must provide the **price of 1 BTC** in the respective currency as a number. All options that are not listed use their default value.

---

# 📋 Configuration options

| Option        | Default                                   | Type    | Description |
|---------------|-------------------------------------------|---------|-------------|
| `type`        | `custom:btc-calc-card`                    | string  | Card type |
| `title`       | `Bitcoin Calculator` / `Bitcoin Rechner`  | string  | Card title (depends on the HA language). An empty string hides the title |
| `show_spread` | `false`                                   | boolean | Show the offer calculator below the fields |
| `currencies`  | –                                         | list    | One entry per currency (see below). The order of the list is the order in the card |

### Currency entries (`currencies`)

| Option   | Default            | Type    | Description |
|----------|--------------------|---------|-------------|
| `entity` | –                  | string  | Sensor with the price of 1 BTC (`sensor`, `input_number` or `number`) |
| `code`   | unit of the sensor | string  | Short code above the price and as field name, e.g. `EUR` |
| `symbol` | `code`             | string  | Symbol behind the amount, e.g. `€` |
| `active` | `true`             | boolean | Show and calculate this currency. Inactive currencies stay in the configuration |

Without any entity the card shows demo values until you select your sensors in the editor. If a sensor is unavailable, the card shows “unavailable” for this currency and disables its field.

When you add the card from the card picker, it looks for suitable sensors itself (entity ID or name contains “btc” or “bitcoin”, number as state, unit EUR, USD, GBP, CHF or JPY).

---

# 🧮 Calculator

- **Bitcoin field:** amount in sats or BTC (switch in the field). Below it the card shows the other unit.
- **Currency fields:** one field per active currency. Typing in any field fills all the others.
- A dot typed as decimal mark is corrected automatically to the decimal mark of your language.

---

# 💱 Offer calculator

Enable it with `show_spread: true` (or in the editor). Choose the currency at the top right and one of two modes. **Always enter both values.**

### Check spread

Enter the **amount** you receive (sats or BTC) and the **purchase amount**. The card shows how much more (or less) than the market price you pay.

### Calculate sats

Enter the **purchase amount** and the **premium / discount** in %, sats or BTC (negative = discount). The card shows the sats you receive.

### Results

Both modes show the same results in the same order:

| Result | Meaning |
|--------|---------|
| Premium / discount in % | `offer price / market price - 1` |
| Premium / discount in currency | purchase amount minus the market value of the sats you receive |
| Premium / discount in sats | sats at market price minus sats you receive |
| You receive | amount in sats, the BTC value is shown below |
| Sats at market price | what the purchase amount would buy at the current market price |
| Offer price | `purchase amount / amount in BTC` |
| Market price | current price of 1 BTC from your sensor |

---

# 📸 Screenshot

<table> <tr> <td width="50%" valign="top"> Screenshot with 1 currency:<br> <img width="100%" alt="preview-usd-en" src="https://github.com/user-attachments/assets/639e0d13-89df-4466-b154-c3808309cb99" /> <br><br> Screenshot with 1 currency and enable spread calculator:<br> <img width="100%" alt="preview-usd-spread-en" src="https://github.com/user-attachments/assets/bf9d7e41-baa5-483e-b4d4-d2ffe5392525" /> </td> <td width="50%" valign="top"> Screenshot with 4 currency and enable spread calculator:<br> <img width="100%" alt="preview-en" src="https://github.com/user-attachments/assets/d67cb32f-199f-402e-b8d6-1ee9bb5bf8f9" /> </td> </tr> </table>

The screenshot shows example prices.

---

# 🐛 Issues & Feature Requests

Please provide the following information:

- Home Assistant version
- BTC Calc Card version
- Current configuration
- Relevant error messages
- Short description of the problem

Please remove any personal or sensitive information from configurations and logs.

Create a [GitHub Issue](https://github.com/jinx-22/btc-calc-card/issues).

---

# 🧡 Support & Donations

<div align="center">

### <a id="lightning"></a>Lightning

<img width="32" alt="Lightning" src="https://github.com/user-attachments/assets/0bff59d2-7986-46cf-9d39-17fe0dbb128a" />

`usefulplay52@walletofsatoshi.com`

<img height="300" alt="Lightning - Wallet of Satoshi" src="https://github.com/user-attachments/assets/65cc18d9-05d1-4a00-8ccc-9922fdb54baf" />

### <a id="bitcoin"></a>Bitcoin

<img width="32" alt="Bitcoin" src="https://github.com/user-attachments/assets/f74cad36-8c05-4a33-89cd-b998075af33b" />

`bc1qkz7mtp23cmshxnru96lzgeayu0urlysvqk5vry`

<img height="300" alt="Bitcoin donation" src="https://github.com/user-attachments/assets/196f68e4-b0e8-4f27-bded-8c4fe13b9d45" />

</div>

Thank you for your support — a free ⭐ helps others discover the project:

[![stars](https://img.shields.io/github/stars/jinx-22/btc-calc-card)](https://github.com/jinx-22/btc-calc-card/stargazers)

---
# 📜 License

**Apache-2.0**

---

Made with ❤️ for Home Assistant
