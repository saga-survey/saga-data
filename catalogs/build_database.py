import re
import json
from urllib import urlopen

re_radec = re.compile('http://skyserver\.sdss3\.org/dr8/en/tools/explore/obj\.asp\?ra=(\d+\.\d+)&amp;dec=(-?\d+\.\d+)')
re_sdss_load = re.compile('loadSummary\(\'([0-9a-z]+)&amp;spec=([0-9a-z]+)\'\)')
re_sdss_ObjID = re.compile('<span class=\'large\'>(\d+)</span>')
re_sdss = re.compile('SDSS\s*(J\d+\.\d+[+-]\d+\.\d+)')
re_ngc = re.compile('NGC\s*(\d+)')

url_nsa = 'http://www.nsatlas.org/getAtlas.html?search=nsaid&nsaID=%s&submit_form=Submit'
url_sdss_l = 'http://skyserver.sdss3.org/dr8/en/tools/explore/OETOC.asp?ra=%s&dec=%s'
url_sdss_r = 'http://skyserver.sdss3.org/dr8/en/tools/explore/summary.asp?id=%s&spec=%s'

def loadurl(url):
    f = urlopen(url)
    X = f.read()
    f.close()
    return X

def add_value(d, key, m):
    if m is not None:
        d[key] = m.groups()[0]
    return d

def get_data(d):
    text = loadurl(url_nsa%d['nsa'])
    m = re_radec.search(text)
    if m is None: return d
    d['ra'], d['dec'] = m.groups()
    d = add_value(d, 'ngc', re_ngc.search(text))

    m = re_sdss_load.search(loadurl(url_sdss_l%(d['ra'], d['dec'])))
    if m is None: return d
    text = loadurl(url_sdss_r%m.groups())
    d = add_value(d, 'ngc', re_ngc.search(text))
    d = add_value(d, 'sdss', re_sdss.search(text))
    d = add_value(d, 'sdss_ObjID', re_sdss_ObjID.search(text))
    return d

with open('saga_hosts_nsa_ids.txt', 'r') as f:
    for i, l in enumerate(f):
        print ',' if i else '['
        items = l.split()
        d = {'id': items[0], 'nsa': items[1], 'type': 'host'}
        d = get_data(d)
        print json.dumps(d),
print
print ']'

