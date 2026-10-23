import json,urllib.request,pathlib
c=json.load(open('asset-research/final-candidates.json',encoding='utf8'));records=json.load(open('public/images/food-assets.json',encoding='utf8'));records={r['path']:r for r in records}
for r in c:
 if 'Shredded' in r['title']:name='food-7-1.jpg';dish='Chicken noodle soup'
 elif 'Nasi' in r['title']:name='food-1-2.jpg';dish='Nasi lemak'
 else:name='food-5-3.jpg';dish='Chargrilled chicken burger'
 req=urllib.request.Request(r['thumbnail'],headers={'User-Agent':'UberpokmiAssetResearch/1.0'})
 with urllib.request.urlopen(req,timeout=30) as response:b=response.read()
 pathlib.Path('public/images/'+name).write_bytes(b);r['path']='/images/'+name;r['dish']=dish;records[r['path']]=r;print(name,len(b))
pathlib.Path('public/images/food-assets.json').write_text(json.dumps(sorted(records.values(),key=lambda r:r['path']),ensure_ascii=False,indent=2),encoding='utf8')
