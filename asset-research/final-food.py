import urllib.request,urllib.parse,json,html,re,pathlib
names=['File:Shredded Chicken Noodle Soup from Red Bowl (2024-10-27).jpg','File:Chargrilled Chicken Burger - Leon.jpg','File:Nasi lemak.jpg']
p=dict(action='query',titles='|'.join(names),prop='imageinfo',iiprop='url|extmetadata|mime',iiurlwidth=960,format='json')
u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(p);d=json.load(urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":"UberpokmiAssetResearch/1.0"})));rows=[]
for x in d['query']['pages'].values():
 if 'imageinfo' not in x:continue
 ii=x['imageinfo'][0];meta=ii.get('extmetadata',{});clean=lambda k:html.unescape(re.sub('<[^>]+>','',str(meta.get(k,{}).get('value','')))).strip()
 r=dict(title=x['title'],url=ii['url'].split('?')[0],thumbnail=ii.get('thumburl',ii['url']).split('?')[0],source=ii['descriptionurl'],caption=clean('ImageDescription'),artist=clean('Artist'),license=clean('LicenseShortName'),licenseUrl=clean('LicenseUrl'))
 rows.append(r);print(r['title'],r['caption'],flush=True)
pathlib.Path('asset-research/final-candidates.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf8')
