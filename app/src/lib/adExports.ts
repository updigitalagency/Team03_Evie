const keywords = ['russian manicure dtla','russian manicure los angeles','russian manicure near me','downtown la manicure','nail studio downtown la','russian manicure downtown','nail care dtla','private manicure los angeles','cuticle care los angeles','nail artist downtown la'];
const headlines = ['Russian Manicure in DTLA','Private Nail Studio','Eve’s Space Downtown LA','Careful Cuticle Work','Russian Manicure Near You','Nail Care in Downtown LA','One Client at a Time','Nail Health Comes First','Manicures by Eve','Personal Nail Care','Expert Nail Preparation','Downtown LA Nail Artist','Book a Studio Visit','Russian Nail Technique','A Private Appointment'];
const descriptions = ['I take time to prepare your nails and care for your cuticles.','Visit my private nail studio in Downtown Los Angeles.','I tailor each manicure to the condition of your nails.','Learn more about my Russian manicure appointments.'];
const googleHeaders = ['Campaign','Campaign Daily Budget','Campaign Type','Networks','Ad Group','Keyword','Criterion Type',...headlines.map((_,i)=>`Headline ${i+1}`),...descriptions.map((_,i)=>`Description ${i+1}`),'Final URL','Location'];
const metaHeaders = ['Campaign Name','Campaign Objective','Ad Set Name','Ad Set Daily Budget','Ad Set Run Status','Location Types','Addresses','Radius','Ad Name','Title','Body','Link','Display Link'];
const encode = (rows: string[][]) => '\uFEFF' + rows.map(row => row.map(value => {const safe = /^[=+@\-\t\r]/.test(value) ? `'${value}` : value; return `"${safe.replace(/"/g,'""')}"`;}).join(',')).join('\r\n');
export type AdExportDetails={copy:{headlines:string[];texts:string[];cta:string;code:string};audience:{location:string;radius:number;minAge:number;maxAge:number;interests:string[]};daily:number;service:string};
export function googleDraft(daily: string, creative?:AdExportDetails) {
  const campaign = 'Eve’s Space – DTLA Search';
  const campaignRow = [campaign,daily,'Search','Google Search','','','',...Array(19).fill(''),'',''];
  const keywordRows = keywords.map((keyword,i) => [campaign,'','','','Russian manicure',keyword,i%2?'Exact':'Phrase',...Array(19).fill(''),'','']);
  const adHeadlines=creative?[...creative.copy.headlines,...Array(12).fill('')]:headlines;
  const adDescriptions=creative?[...creative.copy.texts,...Array(2).fill('')]:descriptions;
  const ad = [campaign,'','','','Russian manicure','','',...adHeadlines,...adDescriptions,'https://evesspacela.com',''];
  const location = [campaign,'','','','','','',...Array(19).fill(''),'',creative?`${creative.audience.radius} miles around 90014`:'5 miles around 90014'];
  return encode([googleHeaders,campaignRow,...keywordRows,ad,location]);
}
export function metaDraft(daily: string, creative?:AdExportDetails) {
  const rows = ['Nail care','Private studio'].map((name,i) => ['Eve’s Space – DTLA','Traffic','Downtown LA',daily,'Paused','', '90014',creative?`${creative.audience.radius} miles`:'5 miles',name,creative?.copy.headlines[i]||headlines[i],creative?.copy.texts[i]||descriptions[i],'https://evesspacela.com','evesspacela.com']);
  return encode([metaHeaders,...rows]);
}
