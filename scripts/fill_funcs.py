#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json, re
from collections import OrderedDict

funcList = ['onSetColorTheme', 'onSetColorThemeStrength']

s1 = '''#include "../main.jsx"
'''
s2 = '();\n'

def name(s):
    return re.sub(r'[^a-zA-Z0-9-_]+', '', s)

with open('../ui/js/settings.json', "r") as f:
  settings = json.loads(f.read()[15:], object_pairs_hook=OrderedDict)

g = ''

for key in settings:
    if not 'group' in settings[key]:
        print()
        print(key.upper())
        print()
        print(settings[key]['help'])
        continue
    print('- ' + settings[key]['title'] + ' - ' + settings[key]['help'])
    with open('../jsx/funcs/on' + key + 'Click.jsx', 'w') as f:
        f.write(s1 + 'on' + key + 'Click' + s2);

for v in funcList:
    with open('../jsx/funcs/' + v + '.jsx', 'w') as f:
        f.write(s1 + v + s2);
