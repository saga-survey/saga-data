import os
import json
from urllib import urlopen

scales = [('wide', '14.06250'), ('zoom', '0.7031250')]

url_img = 'http://skyservice.pha.jhu.edu/DR10/ImgCutout/getjpeg.aspx?ra=%s&dec=%s&scale=%s&width=512&height=512&opt=G'

with open('data.json', 'r') as f:
    X = json.load(f)

for d in X:
    for folder, scale in scales:
        fname = '../sdss_images/%ss_%s/%s.jpg'%(d['type'], folder, d['id'])
        if not os.path.isfile(fname):
            fu = urlopen(url_img%(d['ra'], d['dec'], scale))
            with open(fname, 'wb') as fo:
                fo.write(fu.read())
            fu.close()

