import { demo } from './demo';

const asOf = Date.UTC(2026, 9, 19);
const dayMs = 86400000;
const names = [['Maya','Elena','Avery','Sophie','Nina'],['Mia','Grace','Sofia','Layla','Chloe'],['Aisha','Lily','Ella','Isabel','Olivia'],['Zoe','Leah','Naomi','Mila','Jade']];
const services = ['Pedicure','Russian Manicure','Gel-X Extensions','Structured Manicure'];
export const demoClients = names.flatMap((group, serviceIndex) => group.map((name, i) => ({
  id:`client-${serviceIndex}-${i}`, name, consent:true,
  visits:Array.from({length:6},(_, visit) => ({service:services[serviceIndex], at:new Date(asOf-(32+i+(5-visit)*28)*dayMs).toISOString().slice(0,10)})),
})));
const instagramCaptions = [
  'Healthy nails come first, always. I take the time to look at your natural nails before we choose a finish.',
  'A clean Russian manicure is all about the details: careful cuticle work, a balanced shape, and a finish that feels like you.',
  'Your Gel-X has grown out beautifully. Let’s check the fit and give your next set a fresh start.',
  'Pedicure season is here. Come in, settle down, and let me take care of the details from heel to toe.',
  'Between meetings in DTLA? A thoughtful manicure can fit into your week without feeling rushed.',
  'The before and after is lovely, but my favorite part is how comfortable her natural nails feel underneath.',
  'She came in wanting something simple for a new job. We chose a soft neutral and a shape that works at her keyboard.',
  'Cuticle oil is the little habit I recommend most. Keep a bottle by your desk and use it when your hands need care.',
  'A Russian manicure is precise, not one-size-fits-all. I adjust my approach to your nails and your skin.',
  'A Gel-X refresh for someone who loves length but still wants her nails to feel natural.',
  'Sandal weather deserves a pedicure that feels as good as it looks. I’ll make sure your feet get the attention they need.',
  'For my downtown clients heading straight back to work: a neat, durable manicure and a quiet moment in your day.',
  'From grown-out polish to a fresh, glossy finish. The transformation starts with gentle removal.',
  'One of my regulars tried a shorter shape this time. It still feels polished, and it suits her busy hands.',
  'If your nails have been feeling dry, let’s start with a little care before we decide on color.',
  'The beauty of a Russian manicure is in the preparation. I focus on the small steps that make the whole set feel right.',
  'A Gel-X fill appointment is a chance to check the health of your nails and choose a look you’ll enjoy wearing.',
  'A soft pink pedicure for warmer days. Simple, clean, and easy to wear with every pair of sandals.',
  'A little reset between the office and everything else on your calendar. My DTLA chair is ready for you.',
  'Before: a few weeks of growth. After: a fresh shape and a finish that still looks like her.',
  'She told me she wanted nails that looked put together without feeling overdone. We found the perfect sheer shade.',
  'Strong-looking nails start with consistent care. Tell me what your hands go through each day and we’ll make a plan.',
  'A close look at the cuticle work on this Russian manicure. Clean lines, careful hands, and no need to rush.',
  'For your next Gel-X appointment, bring the inspiration photo. We’ll adapt the length and shape to your real life.',
  'A pedicure is not just about polish. I want you to leave with feet that feel cared for, too.',
  'Early presentation tomorrow? Let’s choose a manicure that feels polished and still feels like you.',
  'The before and after tells the story: thoughtful shaping, a soft finish, and room for the natural nail to grow.',
  'A client came in after a long week and asked for something calm. We picked a milky shade and kept the shape short.',
  'If you’re between sets, don’t peel the product. Book a proper removal and give your natural nails some kindness.',
  'Thank you for trusting me with your hands. Whether it’s your first visit or your tenth, I’ll make time for the details.',
];
export const demoWeek = {
  today:'2026-10-19', filledHours:7,
  brief:`Hi Eve,\n\nOctober has brought in $590 net from 234 appointments. There are 29 open chair-hours this week, and the clearest opportunity is to bring loyal clients back into those openings.\n\nGoogle and referrals are doing the hard work. I’d move the influencer budget toward those channels, invite lapsed clients back, and keep ClassPass to the quieter hours. Together, these actions could add about $3,100 in estimated net next month.\n\nWhich opening would you like to fill first?`,
  instagram:instagramCaptions.map((text,i)=>{const code=`IG-${String(i+1).padStart(2,'0')}`;const reach=i===0?14800:i===1?2400:2400+((i*1957)%12401);const rate=.012+((i*11)%30)/1000;const saves=Math.max(Math.ceil(reach*.012),Math.min(Math.floor(reach*.041),Math.round(reach*rate)));return {id:`instagram-${i+1}`,caption:`${text} Book with code ${code}.`,code,reach,likes:Math.round(reach*(.045+(i%6)*.009)),saves,bookings:Math.max(1,9-Math.floor(i/4))};}),
  calendar:[
    {id:'cal-1',week:0,title:'Gel-X transformation',channel:'Instagram',format:'Reel',code:'REEL-01',status:'Posted'},
    {id:'cal-2',week:0,title:'Pedicure openings',channel:'Instagram',format:'Story',code:'STORY-02',status:'Approved'},
    {id:'cal-3',week:0,title:'Nail health tips',channel:'Google Business',format:'Post',code:'GOOGLE-03',status:'Draft'},
    {id:'cal-4',week:1,title:'Russian manicure close-up',channel:'Instagram',format:'Reel',code:'REEL-04',status:'Draft'},
    {id:'cal-5',week:1,title:'Client care ritual',channel:'Instagram',format:'Post',code:'POST-05',status:'Approved'},
    {id:'cal-6',week:2,title:'Behind the chair',channel:'Instagram',format:'Story',code:'STORY-06',status:'Draft'},
    {id:'cal-7',week:2,title:'Gel-X aftercare',channel:'Instagram',format:'Reel',code:'REEL-07',status:'Draft'},
    {id:'cal-8',week:3,title:'Downtown studio update',channel:'Google Business',format:'Post',code:'GOOGLE-08',status:'Draft'},
    {id:'cal-9',week:3,title:'Your next pedicure',channel:'Instagram',format:'Post',code:'POST-09',status:'Draft'},
  ] as const,
  searchInsights:[{label:'nail salon downtown LA',value:'1,284 searches'},{label:'gel x extensions near me',value:'892 searches'},{label:'russian manicure LA',value:'634 searches'}],
  websiteInsights:[{label:'Google Search',value:'1,620 sessions'},{label:'Instagram',value:'840 sessions'},{label:'Direct & referrals',value:'518 sessions'}],
  categorization:{automatic:47,total:50},
  transactions:[['Gel-X Extensions',115,'Service'],['Cuticle oil',18,'Product'],['Russian Manicure',95,'Service'],['Card processing',-4,'Fee'],['Gratuity',20,'Tip'],['Pedicure',90,'Service'],['Hand cream',24,'Product'],['Refund adjustment',-35,'Refund'],['Structured Manicure',85,'Service'],['Platform fee',-8,'Fee'],['Nail art add-on',30,'Service'],['Gratuity',15,'Tip']].map(([service,gross,type])=>({service:String(service),gross:Number(gross),raw:{Type:String(type)}})),
};
export function eligibleClients(service:string) {
  return demoClients.flatMap(client=>{
    const visits=[...client.visits].sort((a,b)=>a.at.localeCompare(b.at));
    const last=visits.at(-1); if(!last || last.service!==service || !client.consent) return [];
    const gaps=visits.slice(1).map((visit,i)=>(Date.parse(visit.at)-Date.parse(visits[i].at))/dayMs).sort((a,b)=>a-b);
    const middle=Math.floor(gaps.length/2); const median=gaps.length%2?gaps[middle]:(gaps[middle-1]+gaps[middle])/2;
    const since=(Date.parse(demoWeek.today)-Date.parse(last.at))/dayMs;
    return since>=21 && since>=median ? [{...client,dueDays:Math.floor(since-median),visitCount:visits.length}] : [];
  }).slice(0,5);
}
export function demoGoal(target:number) {
  const month=demo.monthly.at(-1)!;
  const averageContribution=month.cm/month.appts;
  const needed=month.appts+Math.max(0,Math.ceil((target-month.net)/averageContribution));
  const daysLeft=31-Number(demoWeek.today.slice(-2));
  return {net:month.net,appointments:month.appts,needed,daysLeft,status:month.net/target>=19/31?'On track':'Behind', progress:Math.min(100,Math.max(0,month.net/target*100))};
}
