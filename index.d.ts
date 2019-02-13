type CreateTokenDetails = {}

type BrandType = 'Visa' | 'American Express' | 'MasterCard' | 'Discover' | 'JCB' | 'Diners Club' | 'Unknown'
type CheckType = 'pass' | 'fail' | 'unavailable' | 'unchecked'
type FundingType = 'credit' | 'debit' | 'prepaid' | 'unknown'
type TokenizationType = 'apple_pay' | 'android_pay'

interface Card {
  id: string
  object: string
  address_city?: string
  address_country?: string
  address_line1?: string
  address_line1_check?: CheckType
  address_line2?: string
  address_state?: string
  address_zip?: string
  address_zip_check?: CheckType
  brand: BrandType
  country: string
  currency?: string
  cvc_check?: CheckType
  dynamic_last4: string
  exp_month: number
  exp_year: number
  fingerprint: string
  funding: FundingType
  last4: string
  metadata: any
  name?: string
  tokenization_method?: TokenizationType
  three_d_secure?: 'required' | 'recommended' | 'optional' | 'not_supported'
}

type StatusType = 'new' | 'validated' | 'verified' | 'verification_failed' | 'errored'

interface BankAccount {
  id: string
  object: string
  account_holder_name: string
  account_holder_type: string
  bank_name: string
  country: string
  currency: string
  fingerprint: string
  last4: string
  routing_number: string
  status: StatusType
}

interface Token {
  id: string
  object: string
  bank_account?: BankAccount
  card?: Card
  client_ip: string
  created: number
  livemode: boolean
  type: string
  used: boolean
}

interface CardDetails {
  card: {
    number: string
    exp_month: string
    exp_year: string
    cvc: string
    name?: string
  }
}

type AccountHolderType = 'individual' | 'company'

interface BankAccountDetails {
  bank_account: {
    country: string
    currency: string
    account_holder_name: string
    account_holder_type: AccountHolderType
    routing_number: string
    account_number: string
  }
}

interface PiiDetails {
  personal_id_number: string
}

type CreateTokenDetails = CardDetails | BankAccountDetails | PiiDetails

export interface StripeClient {
  readonly createToken: (details: CreateTokenDetails) => Promise<Token>
}

export default (key: string) => StripeClient
