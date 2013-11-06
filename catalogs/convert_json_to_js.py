import json

t = 'host'
name = 'hosts_data'
needed = ['id', 'nsa', 'iau', 'sdss', 'ngc']

with open('data.json', 'r') as f:
    X = json.load(f)

with open('../javascripts/%s.js'%(name), 'w') as f:
    for i, d in enumerate(X):
        if d['type'] != t:
            continue
        f.write(',\n' if i else 'var d = [\n')
        nd = {}
        for k in needed:
            if k in d:
                nd[k] = d[k]
        f.write('  %s'%json.dumps(nd))
    f.write('\n];\n')

