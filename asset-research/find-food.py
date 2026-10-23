import urllib.request, urllib.parse, json, concurrent.futures, pathlib, re, html
queries=['ayam gepuk','ayam penyet','nasi lemak','nasi kerabu','nasi ayam Malaysia','roti canai','murtabak Malaysia','roti telur','char kway teow','mee goreng Malaysia','mee siam','kopi Malaysia','kaya toast','teh tarik','sambal udang','sambal sotong','ayam sambal','satay Malaysia','ikan bakar Malaysia','laksa','soto ayam Malaysia','mee sup']
def search(q):
 p=dict(action='query',generator='search',gsrsearch=q,gsrnamespace=6,gsrlimit=8,prop='imageinfo',iiprop='url|extmetadata|mime',iiurlwidth=960,format='json')
 u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p)
 try:
  d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'UberpokmiAssetResearch/1.0'}),timeout=30))
  rows=[]
  for x in sorted(d.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0)):
   ii=x['imageinfo'][0]; meta=ii.get('extmetadata',{})
   if ii.get('mime')!='image/jpeg':continue
   clean=lambda k:html.unescape(re.sub('<[^>]+>','',str(meta.get(k,{}).get('value','')))).strip()
   rows.append(dict(title=x['title'],url=ii['url'].split('?')[0],thumbnail=ii.get('thumburl',ii['url']).split('?')[0],source=ii['descriptionurl'],caption=clean('ImageDescription'),artist=clean('Artist'),license=clean('LicenseShortName'),licenseUrl=clean('LicenseUrl')))
  return q,rows
 except Exception as e:return q,{'error':str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex: result=dict(ex.map(search,queries))
pathlib.Path('asset-research/candidates.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
for q,rows in result.items():
 print('\n'+q)
 for n,r in enumerate(rows):print(n,r['title'],r['license'])
