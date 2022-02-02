export interface Product {
  waitTime: number
  id: number
  name: string
  queueId: number
  queueName: string
  nameTranslations?: {[key: string]: string}; 
}

export interface SubProduct extends Product {
  showInfo?: boolean
}

export interface AnyProduct {
  waitTime?: number
  id?: number
  name?: string
  queueId?: number
  queueName?: string
  title?: string
  infoText?: string,
  header?: string,
  showInfo?: boolean
  products?: Array<{
    id: string,
    subTitle?: string,
    showInfo: boolean,
    infoText?: string
  }>
  nameTranslations?: {[key: string]: string}; 
}
