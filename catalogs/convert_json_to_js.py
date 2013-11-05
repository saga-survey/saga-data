import json

name = 'hosts_data'
needed = ['id', 'nsa', 'iau', 'sdss', 'ngc']

with open(name+'.json', 'r') as f:
    X = json.load(f)

with open('../javascripts/%s.js'%(name), 'w') as f:
    for i, d in enumerate(X):
        f.write(',\n' if i else 'var d = [\n')
        nd = {}
        for k in needed:
            if k in d:
                nd[k] = d[k]
        f.write('  %s'%json.dumps(nd))
    f.write('\n];\n')
