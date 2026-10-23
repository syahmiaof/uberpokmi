import json, urllib.request, pathlib, time
c=json.load(open('asset-research/candidates.json',encoding='utf8'))
choices=[('ayam gepuk',1),('ayam gepuk',0),('ayam gepuk',2),('ayam penyet',3),('nasi lemak',0),('nasi lemak',3),('nasi kerabu',2),('nasi ayam Malaysia',0),('roti canai',7),('roti telur',6),('murtabak Malaysia',0),('roti canai',4),('char kway teow',0),('mee goreng Malaysia',3),('char kway teow',2),('mee goreng Malaysia',5)]
result=[]
for k,(q,ix) in enumerate(choices):
 r=c[q][ix]; path=f'public/images/food-{k//4}-{k%4}.jpg'
 try:
  u=r['thumbnail'];req=urllib.request.Request(u,headers={'User-Agent':'UberpokmiAssetResearch/1.0'})
  with urllib.request.urlopen(req,timeout=30) as response:
   b=response.read(); content=response.headers.get('Content-Type','')
   if 'image' not in content:raise ValueError(content)
  pathlib.Path(path).write_bytes(b)
  r['path']='/'+path.removeprefix('public/');r['dish']=r['title'].removeprefix('File:').rsplit('.',1)[0]
  result.append(r);print(path,len(b),flush=True)
 except Exception as e:print('ERROR',path,str(e),flush=True)
 time.sleep(.4)
pathlib.Path('public/images/food-assets.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
