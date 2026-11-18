import { siSquare, siAirbnb, siGooglesheets, siGoogledocs, siGooglecalendar, siGoogleanalytics, siGooglesearchconsole, siInstagram, siGmail } from 'simple-icons';
import { ReceiptText } from 'lucide-react';

const brands: Record<string,{path:string;className:string}> = {
  'Square export':{path:siSquare.path,className:'square'}, 'Airbnb export':{path:siAirbnb.path,className:'airbnb'},
  'Google Sheets':{path:siGooglesheets.path,className:'sheets'}, 'Google Docs':{path:siGoogledocs.path,className:'docs'},
  'Google Calendar':{path:siGooglecalendar.path,className:'calendar'}, 'Google Analytics':{path:siGoogleanalytics.path,className:'analytics'},
  'Google Search Console':{path:siGooglesearchconsole.path,className:'search'}, 'Instagram':{path:siInstagram.path,className:'instagram'}, 'Gmail':{path:siGmail.path,className:'gmail'},
};
export default function BrandMark({name}:{name:string}) {
  if(name==='ClassPass export') return <svg className="brand-mark classpass" width="34" height="24" viewBox="0 0 100 24" role="img" aria-label="ClassPass"><text x="50" y="17.5" textAnchor="middle" textLength="96" lengthAdjust="spacingAndGlyphs" fontFamily="Manrope, sans-serif" fontSize="18" fontWeight="800" letterSpacing="-0.8" fill="currentColor">classpass</text></svg>;
  const brand=brands[name]; if(!brand)return <ReceiptText size={24}/>;
  return <svg className={`brand-mark ${brand.className}`} width="24" height="24" viewBox="0 0 24 24" role="img" aria-label={name}><path fill="currentColor" d={brand.path}/></svg>;
}
