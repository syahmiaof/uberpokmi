import json,urllib.request,pathlib,time
c=json.load(open('asset-research/candidates.json',encoding='utf8'))
choices=[('kaya toast',0,'Kaya butter toast set'),('kaya toast',5,'Kaya toast with coffee'),('kaya toast',2,'Kaya toast'),('kaya toast',11,'Kaya butter steamed bread'),('sambal udang',4,'Sambal udang petai'),('nasi lemak',4,'Nasi lemak sambal sotong'),('nasi ayam Malaysia',2,'Nasi ayam sambado'),('sambal udang',5,'Udang sambal petai'),('satay Malaysia',4,'Satay ayam dan daging'),('satay Malaysia',5,'Satay Kajang'),('satay Malaysia',8,'Satay dengan nasi impit'),('satay Malaysia',9,'Satay atas panggangan'),('laksa',2,'Laksa noodles'),('laksa',5,'Laksa noodle soup'),('laksa',8,'Curry laksa'),('soto ayam Malaysia',0,'Mi sup')]
result=json.load(open('public/images/food-assets.json',encoding='utf8'))
for k,(q,ix,dish) in enumerate(choices):
 r=c[q][ix]; path=f'public/images/food-{4+k//4}-{k%4}.jpg'
 try:
  req=urllib.request.Request(r['thumbnail'],headers={'User-Agent':'UberpokmiAssetResearch/1.0'})
  with urllib.request.urlopen(req,timeout=30) as response:
   b=response.read();content=response.headers.get('Content-Type','')
   if 'image' not in content:raise ValueError(content)
  pathlib.Path(path).write_bytes(b);r['path']='/'+path.removeprefix('public/');r['dish']=dish
  result.append(r);print(path,len(b),flush=True)
 except Exception as e:print('ERROR',path,str(e),flush=True)
 time.sleep(.4)
pathlib.Path('public/images/food-assets.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
