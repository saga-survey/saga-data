import re
import json
from urllib import urlopen

re_radec = re.compile('http://skyserver\.sdss3\.org/dr8/en/tools/explore/obj\.asp\?ra=(\d+\.\d+)&amp;dec=(-?\d+\.\d+)')
re_load = re.compile('loadSummary\(\'([0-9a-z]+)&amp;spec=([0-9a-z]+)\'\)')
re_sdss = re.compile('<span class=\'large\'>(\d+)</span>')
re_iau = re.compile('(J\d+\.\d+[+-]\d+\.\d+)')
re_ngc = re.compile('NGC\s*(\d+)')

url_nsa = 'http://www.nsatlas.org/getAtlas.html?search=nsaid&nsaID=%s&submit_form=Submit'
url_sdss_l = 'http://skyserver.sdss3.org/dr8/en/tools/explore/OETOC.asp?ra=%s&dec=%s'
url_sdss_r = 'http://skyserver.sdss3.org/dr8/en/tools/explore/summary.asp?id=%s&spec=%s'

def loadurl(url):
    f = urlopen(url)
    X = f.read()
    f.close()
    return X

def get_data(nsa_id):
    d = {'nsa': str(nsa_id)}
    m = re_radec.search(loadurl(url_nsa%d['nsa']))
    if m is None: return d
    d['ra'], d['dec'] = m.groups()
    m = re_load.search(loadurl(url_sdss_l%m.groups()))
    if m is None: return d
    summary = loadurl(url_sdss_r%m.groups())
    m = re_sdss.search(summary)
    if m is not None: d['sdss'] = m.groups()[0]
    m = re_iau.search(summary)
    if m is not None: d['iau'] = 'SDSS '+m.groups()[0]
    m = re_ngc.search(summary)
    if m is not None: d['ngc'] = 'NGC '+m.groups()[0]
    return d

with open('saga_hosts_nsa_ids.txt', 'r') as f:
    for i, l in enumerate(f):
        print ',' if i else '['
        items = l.split()
        d = get_data(items[1])
        d['id'] = items[0]
        d['type'] = 'host'
        print json.dumps(d),
print
print ']'

