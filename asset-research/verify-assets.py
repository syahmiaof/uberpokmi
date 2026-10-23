import json,pathlib,html,hashlib
from PIL import Image
p=pathlib.Path('public/images');rows=json.loads((p/'food-assets.json').read_text(encoding='utf8'))
names=[['Nasi ayam gepuk','Ayam gepuk with rice','Nasi ayam gepuk with red sambal','Ayam penyet Malaysia'],['Nasi lemak with chicken','Nasi lemak with beef rendang','Nasi lemak with chicken and egg','Nasi lemak sambal sotong'],['Roti canai with dhal','Roti telur and teh tarik','Murtabak Raja Kelantan','Thosai with sambar and chutneys'],['Char kway teow','Mee goreng mamak','Nasi goreng kampung','Kuala Lumpur Hokkien mee'],['Kaya butter toast breakfast set','Iced milk coffee','French toast','Pandan chiffon cake'],['Ayam balado','Sambal prawn rice with petai','Ikan bakar','Chargrilled chicken burger'],['Chicken and beef satay','Grilled beef satay','Satay with nasi impit','Grilled chicken leg'],['Curry laksa','Chicken noodle soup','Asam laksa','Wantan mee']]
for row in rows:
 i,j=map(int,row['path'].rsplit('/',1)[1][5:-4].split('-'));row['dish']=names[i][j];row['representativePhoto']=True
 f=p/row['path'].rsplit('/',1)[1]
 with Image.open(f) as im: im.verify()
 with Image.open(f) as im:row['width'],row['height']=im.size
 row['sha256']=hashlib.sha256(f.read_bytes()).hexdigest()
 row['downloadedAt']='2026-10-23';row['modifications']='Downloaded Wikimedia thumbnail; no further pixel edits. Application may display with CSS cropping.'
assert len(rows)==32 and len({x['sha256'] for x in rows})==32 and len({x['url'] for x in rows})==32
(p/'food-assets.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8')
e=html.escape
cards=''.join(f'<article><img src="{e(r["path"].rsplit("/",1)[1])}" alt="{e(r["dish"])}" loading="lazy"><div><h2>{e(r["dish"])}</h2><p>Photo: {e(r["artist"])}</p><p><a href="{e(r["source"])}">Original source</a> · <a href="{e(r["licenseUrl"] or r["source"])}">{e(r["license"])}</a></p><small>{e(r["path"])} · {r["width"]} × {r["height"]}</small></div></article>' for r in rows)
page='<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>UBERPOKMI · Photo credits</title><style>body{font:16px/1.6 system-ui;background:#101312;color:#f5f5ee;margin:0;padding:40px;max-width:1100px;margin:auto}h1{font-size:36px}a{color:#d4ff6f}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px}article{background:#1b211e;border:1px solid #344036;border-radius:16px;overflow:hidden}article div{padding:18px}img{width:100%;height:190px;object-fit:cover}h2{font-size:19px;margin:0}p{margin:8px 0}small{color:#a7b1a9}header{margin-bottom:32px}</style><header><a href="/">← Back to UBERPOKMI</a><h1>Food photography credits</h1><p>Representative food photography from Wikimedia Commons. UBERPOKMI restaurants and menus are fictional demo content. Photos are not supplied by, or endorsements from, the demo restaurants. Portions and presentation vary.</p><p>Images retain their respective licenses. Downloaded thumbnails are unedited; the interface may crop their display. The original sources, photographers and licenses are listed below.</p></header><main>'+cards+'</main></html>'
(p/'credits.html').write_text(page,encoding='utf8')
print('Verified 32 valid unique JPEGs and 32 unique source URLs. Total bytes:',sum((p/r['path'].rsplit('/',1)[1]).stat().st_size for r in rows))
print('Licenses:',sorted({r['license'] for r in rows}))
