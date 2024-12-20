// creditos: inbiza
// discord.gg/ferinha
const fs = require('fs');
const axios = require("axios");
const color = {
  blue: '\x1b[38;5;39m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  purple: '\x1b[35m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m'
}

const token = 'Njk2MzU3OTM5MTUzMzM4NDI5.G65AWV.KfbxHlItFUfjlMn7SWiyxhF_i8mfjQLiTdvRMk' // coloque o token da sua conta aqui (opcional) !!
let checkados = 0
let validos = 0
let invalidos = 0
const { format } = require('date-fns');
const { ptBR } = require('date-fns/locale');

const links = fs.readFileSync('trimensais.txt', 'utf-8').split('\n')

const checker = async() => {
  console.clear()
  for (const link of links) {
    let codigo;
    if (link.startsWith('https://discord.com/billing/promotions/')) {
      codigo = link.replace('https://discord.com/billing/promotions/', '')
    } else if (link.startsWith('https://promos.discord.gg/')) {
      codigo = link.replace('https://promos.discord.gg/', '')
    } else {
      console.log(`${color['red']}[ERRO] Esse link ${color['cyan']}"${link}" ${color['red']}não é suportado pelo checker!`)
      continue;
    }
    console.log('\n\n')
    const url = `https://discord.com/api/v9/entitlements/gift-codes/${codigo}`
    const params = {
      country_code: "BR",
      with_application: "false",
      with_subscription_plan: "true"
    }
    const headers = {
      Authorization: token
    }
    checkados++
    try {
      const response = await axios.get(url, { params, headers })
      if (response.status == 200) {
        const data = response.data
        if (!data.redeemed && data.uses < 1) {
          fs.appendFileSync('input/validos.txt', link + '\n')
          validos++
          console.log(`${color['green']}[VALIDO] O link (${link}) é válido\n[TIPO] ${link.startsWith('https://promos.discord.gg/') ? "Mensal" : "Trimensal"}\n${color['reset']}[EXPIRAÇÃO] ${expiryIn(data.expires_at)}\n`)
        } else {
          fs.appendFileSync('input/invalidos.txt', link + '\n')
          invalidos++
          console.log(`${color['red']}[INVALIDO] O link (${link}) é inválido\n[TIPO] ${link.startsWith('https://promos.discord.gg/') ? "Mensal" : "Trimensal"}\n`)
        }
      } else {
        fs.appendFileSync('input/invalidos.txt', link + '\n')
        invalidos++
        console.log(`${color['red']}[INVALIDO] O link (${link}) é inválido\n[TIPO] ${link.startsWith('https://promos.discord.gg/') ? "Mensal" : "Trimensal"}\n`)
      }
    } catch (error) {
      fs.appendFileSync('input/invalidos.txt', link + '\n')
      invalidos++
      console.log(`${color['red']}[INVALIDO] O link (${link}) é inválido\n[TIPO] ${link.startsWith('https://promos.discord.gg/') ? "Mensal" : "Trimensal"}\n`)
    }
  }
  
  console.log(`${color['cyan']}[FINALIZADO] | Validos: ${validos} | Invalidos: ${invalidos} | Total: ${checkados}`);
}

function expiryIn(isoDate) {
  const date = new Date(isoDate);

  // Formatar a data para o formato brasileiro
  const formattedDate = format(date, 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
  
  return formattedDate
}

checker()