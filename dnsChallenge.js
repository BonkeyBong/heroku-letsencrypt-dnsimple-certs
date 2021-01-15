/**
 * A script to use the DNSimple API to set a TXT record for a given domain.
 * Used to perform automated SSL cert generation with domain validation.
 * 
 * This script is used as part of a certbot renewal process, and can be plugged in as
 * a certbot manual-auth-hook script.
 * 
 * Script requires two arguments:
 * 1) A domain name with DNS managed by DNSimple
 * 2) A TXT record value from LetsEncrypt to set for the domain
 * 
 * Example:
 * `node dnsChallenge.js $CERTBOT_DOMAIN $CERTBOT_VALIDATION`
 * Where $CERTBOT_DOMAIN and $CERTBOT_VALIDATION are environment variables 
 * holding the required values
 */
const axios = require('axios')
const secrets = require('./secrets.json')

const TOKEN = secrets.dnsimple_token

const args = process.argv.slice(2)
const domain = args[0]
const txtValue = args[1]

const dnsUrl = 'https://api.dnsimple.com/v2/'
const sandboxUrl = 'https://api.sandbox.dnsimple.com/v2/'
const recordName = '_acme-challenge'

const apiUrl = dnsUrl

const loginPath = 'whoami'

console.log(args)

async function getAccountId() {
  const result = await axios.get(apiUrl + loginPath, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  })

  return result.data.data.account.id
}

async function findZoneAcmeRecord(accountId) {
  const zoneListPath = `${accountId}/zones/${domain}/records?type=TXT`
  const result = await axios.get(apiUrl + zoneListPath, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  })

  return result.data.data.find(record => {
    return record.name === recordName
  })
}

async function updateZoneRecord(accountId, record) {
  const recordPath = `${accountId}/zones/${record.zone_id}/records/${record.id}`
  await axios.patch(apiUrl + recordPath, { content: txtValue }, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`
    }
  })
}

async function run() {
  try {
    const accountId = await getAccountId()
    const record = await findZoneAcmeRecord(accountId)
    await updateZoneRecord(accountId, record)
  } catch(e) {
    console.error(e.toJSON())
    process.exit(1)
  }
  console.log(`Successfully update TXT record for ${domain}`)
  process.exit(0)
}

run()

