#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json

s1 = '''#include "../cc/main.jsx"
init((new File($.fileName)).parent + '/../');
on'''
s2 = 'Click();\n'

with open('./ui/js/settings.json', "r") as f:
  settings = json.loads(f.read()[15:])

for key in settings:
    with open('./actions/' + settings[key]['group'] + '-' + key + '.jsx', 'w') as f:
        f.write(s1 + key + s2);
