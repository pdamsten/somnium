#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json, re
from collections import OrderedDict

s1 = '''#include "../cc/main.jsx"
init((new File($.fileName)).parent + '/../');
on'''
s2 = 'Click();\n'

def name(s):
    return re.sub(r'[^a-zA-Z0-9-_]+', '', s)

with open('./ui/js/settings.json', "r") as f:
  settings = json.loads(f.read()[15:], object_pairs_hook=OrderedDict)

g = ''

for key in settings:
    if not 'group' in settings[key]:
        print
        print key.upper()
        print
        print settings[key]['help']
        continue
    print u'• ' + settings[key]['title'] + ' - ' + settings[key]['help']
    with open('./actions/' + name(settings[key]['group']) + '-' + name(settings[key]['title']) + '.jsx', 'w') as f:
        f.write(s1 + key + s2);
