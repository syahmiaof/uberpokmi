import json,urllib.request,pathlib,time,shutil
c=json.load(open('asset-research/candidates.json',encoding='utf8'));e=json.load(open('asset-research/extra-candidates.json',encoding='utf8'))
c.update({k:v for k,v in e.items() if k not in c or k.startswith('intitle:iced') or k.startswith('intitle:ayam intitle:balado') or k.startswith('intitle:satay intitle:beef')})
records=json.load(open('public/images/food-assets.json',encoding='utf8'));records={r['path']:r for r in records}
# Preserve existing downloaded bytes during remapping; each photo is fetched only once.
remap=[('food-5-1.jpg','food-1-3.jpg','Nasi lemak sambal sotong'),('food-5-0.jpg','food-5-1.jpg','Sambal prawn rice'),('food-7-2.jpg','food-7-0.jpg','Curry laksa'),('food-7-3.jpg','food-7-1.jpg','Mi sup')]
for old,new,dish in remap:
 data=pathlib.Path('public/images/'+old).read_bytes();r=records['/images/'+old].copy();r['path']='/images/'+new;r['dish']=dish
 pathlib.Path('public/images/'+new).write_bytes(data);records[r['path']]=r
choices=[(1,1,'intitle:lemak intitle:rendang',0,'Nasi lemak rendang daging'),(1,2,'nasi lemak',5,'Nasi lemak pandan'),(2,3,'intitle:thosai',3,'Thosai with sambar and chutneys'),(3,2,'intitle:nasi intitle:goreng intitle:kampung',0,'Nasi goreng kampung'),(3,3,'intitle:hokkien intitle:mee',6,'KL Hokkien mee'),(4,1,'intitle:iced intitle:coffee',9,'Iced coffee'),(4,2,'roti telur',0,'French toast'),(4,3,'intitle:pandan intitle:cake',3,'Pandan chiffon cake'),(5,0,'intitle:ayam intitle:balado',0,'Ayam balado'),(5,2,'intitle:ikan intitle:bakar',0,'Ikan bakar'),(5,3,'intitle:chicken intitle:burger',1,'Grilled pesto chicken burger'),(6,1,'intitle:satay intitle:beef',0,'Grilled beef satay'),(6,3,'intitle:ayam intitle:bakar',5,'Grilled chicken leg'),(7,2,'intitle:asam intitle:laksa',0,'Asam laksa'),(7,3,'intitle:wantan intitle:mee',0,'Wantan mee')]
for i,j,q,ix,dish in choices:
 r=c[q][ix].copy();path=f'public/images/food-{i}-{j}.jpg'
 try:
  with urllib.request.urlopen(urllib.request.Request(r['thumbnail'],headers={'User-Agent':'UberpokmiAssetResearch/1.0'}),timeout=30) as response:
   b=response.read();ct=response.headers.get('Content-Type','')
   if 'image' not in ct:raise ValueError(ct)
  pathlib.Path(path).write_bytes(b);r['path']='/'+path.removeprefix('public/');r['dish']=dish
  records[r['path']]=r;print(path,len(b),flush=True)
 except Exception as err:print('ERROR',path,str(err),flush=True)
 time.sleep(.3)
pathlib.Path('public/images/food-assets.json').write_text(json.dumps(sorted(records.values(),key=lambda r:r['path']),ensure_ascii=False,indent=2),encoding='utf8')
