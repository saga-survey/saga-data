import os
import json
from urllib import urlopen

name = 'hosts_data'
folders_scales = [('hosts_wide', '14.06250'), ('hosts_zoom', '0.7031250')]

url_img = 'http://skyservice.pha.jhu.edu/DR10/ImgCutout/getjpeg.aspx?ra=%s&dec=%s&scale=%s&width=512&height=512&opt=G'

with open(name+'.json', 'r') as f:
    X = json.load(f)

for d in X:
    for folder, scale in folders_scales:
        fname = '../sdss_images/%s/%s.jpg'%(folder, d['id'])
        if not os.path.isfile(fname):
            fu = urlopen(url_img%(d['ra'], d['dec'], scale))
            with open(fname, 'wb') as fo:
                fo.write(fu.read())
            fu.close()

