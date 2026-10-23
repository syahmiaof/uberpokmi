import urllib.request,urllib.parse,json,html,re,time,pathlib
queries=['kaya toast','kopi tarik','sambal udang','satay Malaysia','laksa','soto ayam Malaysia']
pool=json.load(open('asset-research/candidates.json',encoding='utf8'))
for q in queries:
 p=dict(action='query',generator='search',gsrsearch=q,gsrnamespace=6,gsrlimit=12,prop='imageinfo',iiprop='url|extmetadata|mime',iiurlwidth=960,format='json')
 try:
  u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p)
  d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'UberpokmiAssetResearch/1.0'}),timeout=30));rows=[]
  for x in sorted(d.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0)):
   ii=x['imageinfo'][0];meta=ii.get('extmetadata',{})
   if ii.get('mime')!='image/jpeg':continue
   clean=lambda k:html.unescape(re.sub('<[^>]+>','',str(meta.get(k,{}).get('value','')))).strip()
   rows.append(dict(title=x['title'],url=ii['url'].split('?')[0],thumbnail=ii.get('thumburl',ii['url']).split('?')[0],source=ii['descriptionurl'],caption=clean('ImageDescription'),artist=clean('Artist'),license=clean('LicenseShortName'),licenseUrl=clean('LicenseUrl')))
  pool[q]=rows;print(q,flush=True)
  for ix,r in enumerate(rows):print(ix,r['title'],r['license'],flush=True)
 except Exception as e:print(q,str(e),flush=True)
 time.sleep(2)
pathlib.Path('asset-research/candidates.json').write_text(json.dumps(pool,ensure_ascii=False,indent=2),encoding='utf8')
