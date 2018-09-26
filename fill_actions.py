#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
from collections import OrderedDict

s1 = '''#include "../cc/main.jsx"
init((new File($.fileName)).parent + '/../');
on'''
s2 = 'Click();\n'

with open('./ui/js/settings.json', "r") as f:
  settings = json.loads(f.read()[15:], object_pairs_hook=OrderedDict)

g = ''

for key in settings:
    if g != settings[key]['group']:
        g = settings[key]['group']
        print 
        print g
    print u'• ' + settings[key]['title'] + ' - ' + settings[key]['help']
    with open('./actions/' + settings[key]['group'].replace(' ', '') + '-' + settings[key]['title'].replace(' ', '') + '.jsx', 'w') as f:
        f.write(s1 + key + s2);
